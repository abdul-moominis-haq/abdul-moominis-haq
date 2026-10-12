import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, FileUp, ImagePlus, LogOut, RotateCcw, Save, Trash2 } from "lucide-react";
import {
  defaultPortfolioContent,
  type PortfolioAsset,
  type PortfolioContent,
} from "@/data/portfolioContent";
import {
  NeonAdminAccountSettings,
  NeonAdminAuthPanel,
  type AdminAuthIdentity,
} from "@/components/NeonAdminAuth";
import { neonAuthClient } from "@/lib/neonAuth";
import { projectAdminRequest, ProjectAdminApiError } from "@/lib/projectAdminApi";

type ContentSection = keyof PortfolioContent;
type ContentRecord = { document: unknown; updatedAt?: string };
type ManagedContent = Partial<Record<ContentSection, ContentRecord>>;
type UploadSignature = {
  cloudName: string;
  apiKey: string;
  resourceType: PortfolioAsset["mediaType"];
  folder: string;
  public_id: string;
  timestamp: number;
  signature: string;
};
type UploadedMedia = {
  secure_url: string;
  public_id: string;
  resource_type: PortfolioAsset["mediaType"];
};
type PendingAssets = Partial<Record<ContentSection, PortfolioAsset[]>>;

const sections: Array<{
  id: ContentSection;
  label: string;
  summary: string;
}> = [
  { id: "home", label: "Home", summary: "Identity, location, CV, and homepage media" },
  { id: "about", label: "About", summary: "Biography, education, and highlights" },
  { id: "experience", label: "Experience", summary: "Roles, dates, achievements, and tags" },
  { id: "skills", label: "Skills", summary: "Skill groups, languages, and certifications" },
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function documentText(section: ContentSection, content: PortfolioContent) {
  return JSON.stringify(content[section], null, 2);
}

function parseDocument(value: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(value);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Portfolio content must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

function assetsFromDocument(value: Record<string, unknown>): PortfolioAsset[] {
  const assets = value.assets;
  return Array.isArray(assets)
    ? assets.filter(
        (asset): asset is PortfolioAsset =>
          typeof asset === "object" &&
          asset !== null &&
          "mediaPublicId" in asset &&
          typeof asset.mediaPublicId === "string" &&
          "mediaUrl" in asset &&
          typeof asset.mediaUrl === "string" &&
          "mediaType" in asset &&
          (asset.mediaType === "image" || asset.mediaType === "video" || asset.mediaType === "raw") &&
          "label" in asset &&
          typeof asset.label === "string",
      )
    : [];
}

function isAssetList(value: unknown): value is PortfolioAsset[] {
  return Array.isArray(value) && assetsFromDocument({ assets: value }).length === value.length;
}

function isSectionDocument<K extends ContentSection>(
  section: K,
  value: unknown,
): value is PortfolioContent[K] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const document = value as Record<string, unknown>;
  if (!isAssetList(document.assets)) return false;

  if (section === "home") {
    return (
      ["name", "location", "discipline", "specialties", "cvUrl"].every(
        (field) => typeof document[field] === "string",
      ) &&
      (document.portraitUrl === undefined || typeof document.portraitUrl === "string")
    );
  }
  if (section === "about") {
    const education = document.education;
    return (
      ["heading", "intro", "narrativeTitle", "narrative"].every(
        (field) => typeof document[field] === "string",
      ) &&
      typeof education === "object" &&
      education !== null &&
      !Array.isArray(education) &&
      ["degree", "period", "school", "grade", "concentrations", "coursework"].every(
        (field) => typeof education[field] === "string",
      ) &&
      Array.isArray(document.highlights) &&
      document.highlights.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          !Array.isArray(item) &&
          "title" in item &&
          typeof item.title === "string" &&
          "description" in item &&
          typeof item.description === "string",
      )
    );
  }
  if (section === "experience") {
    return (
      typeof document.heading === "string" &&
      typeof document.intro === "string" &&
      Array.isArray(document.items) &&
      document.items.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          !Array.isArray(item) &&
          ["company", "role", "location", "period"].every(
            (field) => field in item && typeof item[field] === "string",
          ) &&
          "achievements" in item &&
          Array.isArray(item.achievements) &&
          item.achievements.every((achievement: unknown) => typeof achievement === "string") &&
          "tags" in item &&
          Array.isArray(item.tags) &&
          item.tags.every((tag: unknown) => typeof tag === "string"),
      )
    );
  }
  return (
    typeof document.heading === "string" &&
    typeof document.intro === "string" &&
    Array.isArray(document.categories) &&
    document.categories.every(
      (category) =>
        typeof category === "object" &&
        category !== null &&
        !Array.isArray(category) &&
        "category" in category &&
        typeof category.category === "string" &&
        "skills" in category &&
        Array.isArray(category.skills) &&
        category.skills.every((skill: unknown) => typeof skill === "string"),
    ) &&
    Array.isArray(document.languages) &&
    document.languages.every(
      (language) =>
        typeof language === "object" &&
        language !== null &&
        !Array.isArray(language) &&
        "name" in language &&
        typeof language.name === "string" &&
        "level" in language &&
        typeof language.level === "string",
    ) &&
    Array.isArray(document.certifications) &&
    document.certifications.every((item: unknown) => typeof item === "string")
  );
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [activeSection, setActiveSection] = useState<ContentSection>("home");
  const [documents, setDocuments] = useState<PortfolioContent>(defaultPortfolioContent);
  const [pendingAssets, setPendingAssets] = useState<PendingAssets>({});
  const [draft, setDraft] = useState(documentText("home", defaultPortfolioContent));
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [authError, setAuthError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const loadContent = useCallback(async () => {
    setLoadingContent(true);
    setAuthError("");
    try {
      const result = await projectAdminRequest<ManagedContent>("/api/content/manage");
      const next = { ...defaultPortfolioContent };
      for (const section of sections) {
        const record = result[section.id];
        if (!record) continue;
        switch (section.id) {
          case "home":
            if (isSectionDocument("home", record.document)) next.home = record.document;
            break;
          case "about":
            if (isSectionDocument("about", record.document)) next.about = record.document;
            break;
          case "experience":
            if (isSectionDocument("experience", record.document)) next.experience = record.document;
            break;
          case "skills":
            if (isSectionDocument("skills", record.document)) next.skills = record.document;
            break;
        }
      }
      setDocuments(next);
    } catch (error) {
      setAuthError(
        error instanceof ProjectAdminApiError && error.status === 403
          ? "This account is not authorized. Use the verified email configured as ADMIN_EMAIL."
          : getErrorMessage(error),
      );
    } finally {
      setLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!neonAuthClient) {
        setLoadingSession(false);
        return;
      }

      try {
        const { data, error } = await neonAuthClient.getSession();
        if (error) throw new Error(error.message);
        if (active && data.user) {
          setUserEmail(data.user.email);
          setUserName(data.user.name ?? "");
          setEmailVerified(data.user.emailVerified);
          await loadContent();
        }
      } catch (error) {
        if (active) setAuthError(getErrorMessage(error));
      } finally {
        if (active) setLoadingSession(false);
      }
    }
    void restoreSession();

    return () => {
      active = false;
    };
  }, [loadContent]);

  useEffect(() => {
    setDraft(documentText(activeSection, documents));
    setFormError("");
    setNotice("");
  }, [activeSection, documents]);

  async function handleSignOut() {
    if (!neonAuthClient) return;
    const { error } = await neonAuthClient.signOut();
    if (error) {
      setAuthError(error.message);
      return;
    }
    setUserEmail("");
    setUserName("");
    setEmailVerified(false);
    setAuthError("");
    setNotice("");
  }

  async function handleSectionChange(section: ContentSection) {
    if (section === activeSection) return;
    if (hasUnsavedChanges && !window.confirm("Discard unsaved edits and switch sections?")) {
      return;
    }

    const pending = pendingAssets[activeSection] ?? [];
    if (pending.length) {
      const cleanupErrors = await deleteRemovedAssets(activeSection, pending, []);
      if (cleanupErrors.length) {
        setFormError("An unsaved upload could not be removed from storage. Save the section or try again before switching.");
        return;
      }
      setPendingAssets((current) => ({ ...current, [activeSection]: [] }));
    }
    setActiveSection(section);
  }

  async function deleteRemovedAssets(
    section: ContentSection,
    previous: PortfolioAsset[],
    next: PortfolioAsset[],
  ) {
    const nextIds = new Set(next.map((asset) => asset.mediaPublicId));
    const removed = previous.filter((asset) => !nextIds.has(asset.mediaPublicId));
    const failures: string[] = [];
    for (const asset of removed) {
      try {
        await projectAdminRequest<void>("/api/content/media", {
          method: "DELETE",
          body: JSON.stringify({
            section,
            mediaUrl: asset.mediaUrl,
            mediaPublicId: asset.mediaPublicId,
            mediaType: asset.mediaType,
          }),
        });
      } catch (error) {
        failures.push(getErrorMessage(error));
      }
    }
    return failures;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingContent(true);
    setFormError("");
    setNotice("");
    try {
      const content = parseDocument(draft);
      const result = await projectAdminRequest<ContentRecord & { section: ContentSection }>(
        `/api/content/${activeSection}`,
        { method: "PUT", body: JSON.stringify({ document: content }) },
      );
      if (!isSectionDocument(activeSection, result.document)) {
        throw new Error("The server saved content but returned an invalid document.");
      }
      const previousAssets = [
        ...documents[activeSection].assets,
        ...(pendingAssets[activeSection] ?? []),
      ];
      const savedDocument = result.document;
      setDocuments((current) => ({ ...current, [activeSection]: savedDocument }));
      const cleanupErrors = await deleteRemovedAssets(
        activeSection,
        previousAssets,
        savedDocument.assets,
      );
      setPendingAssets((current) => ({ ...current, [activeSection]: [] }));
      setNotice(
        cleanupErrors.length
          ? "Changes saved, but a removed file could not be deleted from storage."
          : "Changes saved and published.",
      );
      await queryClient.invalidateQueries({ queryKey: ["portfolio-content"] });
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSavingContent(false);
    }
  }

  async function handleReset() {
    setSavingContent(true);
    setFormError("");
    setNotice("");
    try {
      await projectAdminRequest<void>(`/api/content/${activeSection}`, { method: "DELETE" });
      const previousAssets = [
        ...documents[activeSection].assets,
        ...(pendingAssets[activeSection] ?? []),
      ];
      const resetDocument = defaultPortfolioContent[activeSection];
      setDocuments((current) => ({ ...current, [activeSection]: resetDocument }));
      const cleanupErrors = await deleteRemovedAssets(activeSection, previousAssets, []);
      setPendingAssets((current) => ({ ...current, [activeSection]: [] }));
      setNotice(
        cleanupErrors.length
          ? "Section reset, but a removed file could not be deleted from storage."
          : "Section reset to its original portfolio content.",
      );
      await queryClient.invalidateQueries({ queryKey: ["portfolio-content"] });
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSavingContent(false);
    }
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const resourceType: PortfolioAsset["mediaType"] =
      file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : file.type === "application/pdf"
            ? "raw"
            : "raw";
    const validType =
      resourceType === "image" ||
      resourceType === "video" ||
      file.type === "application/pdf";
    const limit =
      resourceType === "video"
        ? 100 * 1024 * 1024
        : resourceType === "raw"
          ? 25 * 1024 * 1024
          : 15 * 1024 * 1024;
    if (!validType) {
      setFormError("Choose an image, video, or PDF document.");
      return;
    }
    if (file.size > limit) {
      setFormError(`This file exceeds the ${resourceType === "video" ? "100 MB" : resourceType === "raw" ? "25 MB" : "15 MB"} upload limit.`);
      return;
    }

    setUploadingMedia(true);
    setFormError("");
    setNotice("");
    try {
      const signature = await projectAdminRequest<UploadSignature>(
        "/api/content/upload-signature",
        {
          method: "POST",
          body: JSON.stringify({ section: activeSection, resourceType }),
        },
      );
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signature.apiKey);
      body.append("timestamp", String(signature.timestamp));
      body.append("folder", signature.folder);
      body.append("public_id", signature.public_id);
      body.append("signature", signature.signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/${resourceType}/upload`,
        { method: "POST", body },
      );
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "object" &&
          result.error !== null &&
          "message" in result.error &&
          typeof result.error.message === "string"
            ? result.error.message
            : `Media upload returned ${response.status}`;
        throw new Error(message);
      }
      if (
        typeof result !== "object" ||
        result === null ||
        !("secure_url" in result) ||
        typeof result.secure_url !== "string" ||
        !("public_id" in result) ||
        result.public_id !== signature.public_id ||
        !("resource_type" in result) ||
        result.resource_type !== resourceType
      ) {
        throw new Error("Media service returned an invalid upload response");
      }

      const uploaded = result as UploadedMedia;
      const document = parseDocument(draft);
      const assets = assetsFromDocument(document);
      if (activeSection === "home" && resourceType === "raw") {
        document.cvUrl = uploaded.secure_url;
      }
      if (activeSection === "home" && resourceType === "image") {
        document.portraitUrl = uploaded.secure_url;
      }
      document.assets = [
        ...assets,
        {
          label: file.name.slice(0, 100),
          mediaUrl: uploaded.secure_url,
          mediaPublicId: uploaded.public_id,
          mediaType: uploaded.resource_type,
        },
      ];
      setPendingAssets((current) => ({
        ...current,
        [activeSection]: [
          ...(current[activeSection] ?? []),
          {
            label: file.name.slice(0, 100),
            mediaUrl: uploaded.secure_url,
            mediaPublicId: uploaded.public_id,
            mediaType: uploaded.resource_type,
          },
        ],
      }));
      setDraft(JSON.stringify(document, null, 2));
      setNotice("Upload complete. Save this section to publish the new file.");
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setUploadingMedia(false);
    }
  }

  const isAuthenticated = Boolean(userEmail);
  const activeSectionInfo = sections.find((section) => section.id === activeSection)!;
  const hasUnsavedChanges = draft !== documentText(activeSection, documents);

  return (
    <main className="project-manager admin-dashboard">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="project-manager__bar">
        <Link className="project-manager__brand" to="/">
          IS-HAQ ABDUL-MOOMIN
        </Link>
        <div className="project-manager__bar-actions">
          <Link className="project-manager__text-button" to="/">
            View portfolio <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          {isAuthenticated && (
            <>
              <span className="project-manager__identity">{userEmail}</span>
              <button className="project-manager__text-button" type="button" onClick={() => void handleSignOut()}>
                <LogOut aria-hidden="true" size={16} /> Sign out
              </button>
            </>
          )}
        </div>
      </header>

      <div className="project-manager__content admin-dashboard__content">
        {loadingSession ? (
          <p className="project-manager__message" role="status">Checking your sign-in…</p>
        ) : !neonAuthClient ? (
          <p className="project-manager__message project-manager__message--error" role="alert">
            Neon Auth is not configured. Set <code>VITE_NEON_AUTH_URL</code> and restart the frontend.
          </p>
        ) : !isAuthenticated ? (
          <NeonAdminAuthPanel
            title="Sign in to manage your portfolio."
            description={<>Only the verified account matching <code>ADMIN_EMAIL</code> can change public portfolio content.</>}
            onAuthenticated={async (identity: AdminAuthIdentity) => {
              setUserEmail(identity.email);
              setUserName(identity.name);
              setEmailVerified(identity.emailVerified);
              await loadContent();
            }}
          />
        ) : (
          <>
            <NeonAdminAccountSettings
              email={userEmail}
              name={userName}
              emailVerified={emailVerified}
              onNameChanged={setUserName}
            />
            <div className="admin-dashboard__heading">
              <div>
                <h1>Portfolio editor</h1>
                <p>Update public pages and media from one private workspace.</p>
              </div>
              <Link className="project-manager__primary-button" to="/admin/projects">
                Manage projects <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </div>

            <nav className="admin-dashboard__tabs" aria-label="Portfolio sections">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={activeSection === section.id ? "is-active" : ""}
                  aria-current={activeSection === section.id ? "page" : undefined}
                  disabled={savingContent || uploadingMedia}
                  onClick={() => void handleSectionChange(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            {authError && (
              <div className="project-manager__message project-manager__message--error" role="alert">
                {authError}
                <button className="project-manager__text-button" type="button" onClick={() => void loadContent()}>
                  Retry
                </button>
              </div>
            )}
            {notice && <p className="project-manager__message" role="status">{notice}</p>}

            {loadingContent ? (
              <p className="project-manager__message" role="status">Loading saved portfolio content…</p>
            ) : (
              <section className="admin-dashboard__workspace" aria-labelledby="content-title">
                <aside className="admin-dashboard__section-info">
                  <h2 id="content-title">{activeSectionInfo.label}</h2>
                  <p>{activeSectionInfo.summary}</p>
                  <p>Changes are published as soon as you save.</p>
                  <Link className="project-manager__text-button" to={`/${activeSection === "home" ? "" : activeSection}`}>
                    Preview public page <ArrowUpRight aria-hidden="true" size={16} />
                  </Link>
                </aside>

                <form className="admin-dashboard__editor" onSubmit={(event) => void handleSave(event)}>
                  <label className="project-manager__field" htmlFor="content-json">
                    Section content
                    <span className="project-manager__optional">
                      Edit the structured JSON. Lists are stored in arrays such as <code>items</code>, <code>highlights</code>, and <code>categories</code>.
                    </span>
                    <textarea
                      id="content-json"
                      className="admin-dashboard__json"
                      value={draft}
                      disabled={savingContent || uploadingMedia}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      onChange={(event) => setDraft(event.target.value)}
                      aria-describedby="content-json-help"
                    />
                  </label>
                  <p id="content-json-help" className="admin-dashboard__help">
                    Keep the field names and data types intact. Add or remove list entries inside the matching array.
                  </p>

                  <div className="admin-dashboard__uploads">
                    <div>
                      <h3>Media for {activeSectionInfo.label}</h3>
                      <p>Upload images, videos, or a PDF. Files appear on the public page after you save.</p>
                    </div>
                    <input
                      ref={fileInput}
                      className="project-manager__file-input"
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      onChange={(event) => void handleMediaUpload(event)}
                      aria-label={`Upload media for ${activeSectionInfo.label}`}
                    />
                    <button
                      className="project-manager__secondary-button"
                      type="button"
                      disabled={uploadingMedia || savingContent}
                      onClick={() => fileInput.current?.click()}
                    >
                      {uploadingMedia ? (
                        "Uploading…"
                      ) : (
                        <>
                          <FileUp aria-hidden="true" size={17} /> Upload file
                        </>
                      )}
                    </button>
                    <ul className="admin-dashboard__asset-list">
                      {assetsFromDocument(
                        (() => {
                          try {
                            return parseDocument(draft);
                          } catch {
                            return {};
                          }
                        })(),
                      ).map((asset) => (
                        <li key={asset.mediaPublicId}>
                          {asset.mediaType === "image" ? (
                            <ImagePlus aria-hidden="true" size={16} />
                          ) : asset.mediaType === "video" ? (
                            <span className="print-label">VIDEO</span>
                          ) : (
                            <span className="print-label">PDF</span>
                          )}
                          <span>{asset.label}</span>
                          <button
                            className="project-manager__icon-button project-manager__icon-button--danger"
                            type="button"
                            aria-label={`Remove ${asset.label} from this section`}
                            onClick={() => {
                              try {
                                const content = parseDocument(draft);
                                content.assets = assetsFromDocument(content).filter(
                                  (item) => item.mediaPublicId !== asset.mediaPublicId,
                                );
                                setDraft(JSON.stringify(content, null, 2));
                              } catch (error) {
                                setFormError(getErrorMessage(error));
                              }
                            }}
                          >
                            <Trash2 aria-hidden="true" size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {formError && <p className="project-manager__message project-manager__message--error" role="alert">{formError}</p>}
                  <div className="admin-dashboard__actions">
                    <button
                      className="project-manager__primary-button"
                      type="submit"
                      disabled={savingContent || uploadingMedia}
                    >
                      <Save aria-hidden="true" size={16} />
                      {savingContent ? "Saving…" : "Save and publish"}
                    </button>
                    <button
                      className="project-manager__secondary-button"
                      type="button"
                      disabled={savingContent || uploadingMedia}
                      onClick={() => {
                        const pending = pendingAssets[activeSection] ?? [];
                        void deleteRemovedAssets(activeSection, pending, []).then((errors) => {
                          if (errors.length) {
                            setFormError("An unsaved upload could not be removed from storage. Try again before discarding.");
                            return;
                          }
                          setPendingAssets((current) => ({ ...current, [activeSection]: [] }));
                          setDraft(documentText(activeSection, documents));
                          setFormError("");
                          setNotice("Unsaved edits discarded.");
                        });
                      }}
                    >
                      Discard edits
                    </button>
                    <button
                      className="project-manager__text-button admin-dashboard__reset"
                      type="button"
                      disabled={savingContent || uploadingMedia}
                      onClick={() => {
                        if (window.confirm(`Reset ${activeSectionInfo.label} to its original content?`)) {
                          void handleReset();
                        }
                      }}
                    >
                      <RotateCcw aria-hidden="true" size={16} /> Reset section
                    </button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
