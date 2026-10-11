import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, ImagePlus, LogOut, Plus, Save, Trash2, Video, X } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolio";
import ProjectMediaView from "@/components/ProjectMedia";
import { neonAuthClient } from "@/lib/neonAuth";
import {
  ProjectAdminApiError,
  projectAdminRequest,
} from "@/lib/projectAdminApi";

type ProjectRecord = PortfolioProject & {
  id: string;
  mediaUrl: string | null;
  mediaPublicId: string | null;
  mediaType: "image" | "video" | null;
  githubUrl: string | null;
  hostedUrl: string | null;
};

type ProjectMedia = {
  mediaUrl: string;
  mediaPublicId: string;
  mediaType: "image" | "video";
};

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  resourceType: "image" | "video";
  folder: string;
  public_id: string;
  timestamp: number;
  signature: string;
};

type ProjectDraft = {
  title: string;
  description: string;
  githubUrl: string;
  hostedUrl: string;
  year: string;
  role: string;
  category: string;
  technologies: string;
};

const emptyDraft: ProjectDraft = {
  title: "",
  description: "",
  githubUrl: "",
  hostedUrl: "",
  year: "",
  role: "",
  category: "",
  technologies: "",
};

const mediaFromProject = (project?: ProjectRecord): ProjectMedia | null =>
  project?.mediaUrl && project.mediaPublicId && project.mediaType
    ? {
        mediaUrl: project.mediaUrl,
        mediaPublicId: project.mediaPublicId,
        mediaType: project.mediaType,
      }
    : null;

function draftFromProject(project?: ProjectRecord): ProjectDraft {
  if (!project) return emptyDraft;
  return {
    title: project.title,
    description: project.description,
    githubUrl: project.githubUrl ?? "",
    hostedUrl: project.hostedUrl ?? "",
    year: project.year ?? "",
    role: project.role ?? "",
    category: project.category ?? "",
    technologies: project.technologies?.join(", ") ?? "",
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function ProjectManager() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [savingAuth, setSavingAuth] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectRecord | undefined>();
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const [draftMedia, setDraftMedia] = useState<ProjectMedia | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [cleaningMedia, setCleaningMedia] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    setAuthError("");
    try {
      const result = await projectAdminRequest<{ projects: ProjectRecord[] }>(
        "/api/projects/manage",
      );
      setProjects(result.projects);
      const firstProject = result.projects[0];
      setEditingProject(firstProject);
      setDraft(draftFromProject(firstProject));
      setDraftMedia(mediaFromProject(firstProject));
      setConfirmDeleteId(null);
    } catch (error) {
      setAuthError(
        error instanceof ProjectAdminApiError && error.status === 403
          ? "This account is not authorized. Use the verified email configured as ADMIN_EMAIL."
          : getErrorMessage(error),
      );
    } finally {
      setLoadingProjects(false);
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
          await loadProjects();
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
  }, [loadProjects]);

  function resetEditor() {
    setEditingProject(undefined);
    setDraft(emptyDraft);
    setDraftMedia(null);
    setFormError("");
    setNotice("");
    if (fileInput.current) fileInput.current.value = "";
  }

  async function startNewProject() {
    await discardDraft();
  }

  function startEditing(project: ProjectRecord) {
    setEditingProject(project);
    setDraft(draftFromProject(project));
    setDraftMedia(mediaFromProject(project));
    setFormError("");
    setNotice("");
    setConfirmDeleteId(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function selectProject(project: ProjectRecord) {
    if (
      editingProject?.id === project.id ||
      uploadingMedia ||
      cleaningMedia ||
      savingProject
    ) return;

    if (draftMedia && draftMedia.mediaPublicId !== editingProject?.mediaPublicId) {
      setCleaningMedia(true);
      try {
        await removeUploadedMedia(draftMedia);
      } catch (error) {
        setFormError(`The unsaved upload could not be removed: ${getErrorMessage(error)}`);
        return;
      } finally {
        setCleaningMedia(false);
      }
    }

    startEditing(project);
  }

  async function removeUploadedMedia(media: ProjectMedia) {
    await projectAdminRequest<void>("/api/projects/media", {
      method: "DELETE",
      body: JSON.stringify(media),
    });
  }

  async function discardDraft() {
    let cleanupError = "";
    if (
      draftMedia &&
      draftMedia.mediaPublicId !== editingProject?.mediaPublicId
    ) {
      try {
        await removeUploadedMedia(draftMedia);
      } catch (error) {
        cleanupError = `The unsaved upload could not be removed: ${getErrorMessage(error)}`;
      }
    }
    resetEditor();
    if (cleanupError) setFormError(cleanupError);
  }

  async function uploadFile(file: File) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const limit = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (!isImage && !isVideo) {
      setFormError("Choose an image or video file.");
      return;
    }
    if (file.size > limit) {
      setFormError(`This ${isVideo ? "video" : "image"} exceeds the ${isVideo ? "100 MB" : "15 MB"} upload limit.`);
      return;
    }

    setUploadingMedia(true);
    setFormError("");
    setNotice("");
    try {
      const resourceType = isVideo ? "video" : "image";
      const signature = await projectAdminRequest<UploadSignature>(
        "/api/projects/upload-signature",
        {
          method: "POST",
          body: JSON.stringify({ resourceType }),
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

      const previousDraftMedia = draftMedia;
      const nextMedia: ProjectMedia = {
        mediaUrl: result.secure_url,
        mediaPublicId: result.public_id,
        mediaType: resourceType,
      };
      setDraftMedia(nextMedia);
      setNotice("Media uploaded. Save the project to publish the change.");

      if (
        previousDraftMedia &&
        previousDraftMedia.mediaPublicId !== editingProject?.mediaPublicId
      ) {
        try {
          await removeUploadedMedia(previousDraftMedia);
        } catch (error) {
          setNotice(`Media uploaded, but the previous unsaved file remains in storage: ${getErrorMessage(error)}`);
        }
      }
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!neonAuthClient) return;
    setSavingAuth(true);
    setAuthError("");

    try {
      const result =
        authMode === "sign-up"
          ? await neonAuthClient.signUp.email({
              name: email.split("@")[0] || "Portfolio admin",
              email,
              password,
            })
          : await neonAuthClient.signIn.email({ email, password });

      if (result.error) throw new Error(result.error.message);
      const session = await neonAuthClient.getSession();
      if (session.error) throw new Error(session.error.message);
      if (!session.data.user) {
        setNotice("Check your email to verify your account, then return here to sign in.");
        setAuthMode("sign-in");
        return;
      }

      setUserEmail(session.data.user.email);
      await loadProjects();
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setSavingAuth(false);
    }
  }

  async function handleSignOut() {
    if (!neonAuthClient) return;
    const { error } = await neonAuthClient.signOut();
    if (error) {
      setAuthError(error.message);
      return;
    }
    setUserEmail("");
    setProjects([]);
    setEditingProject(undefined);
    setDraft(emptyDraft);
    setDraftMedia(null);
    setAuthError("");
    setNotice("");
  }

  async function handleSaveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draftMedia) {
      setFormError("Upload an image or video before saving this project.");
      return;
    }

    setSavingProject(true);
    setFormError("");
    setNotice("");
    const payload = {
      ...draft,
      mediaUrl: draftMedia.mediaUrl,
      mediaPublicId: draftMedia.mediaPublicId,
      mediaType: draftMedia.mediaType,
      technologies: draft.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
    };

    try {
      const result = editingProject
        ? await projectAdminRequest<{ project: ProjectRecord; warning?: string }>(
            `/api/projects/${encodeURIComponent(editingProject.id)}`,
            { method: "PUT", body: JSON.stringify(payload) },
          )
        : {
            project: await projectAdminRequest<ProjectRecord>("/api/projects", {
              method: "POST",
              body: JSON.stringify(payload),
            }),
          };

      setProjects((current) =>
        editingProject
          ? current.map((project) =>
              project.id === result.project.id ? result.project : project,
            )
          : [...current, result.project],
      );
      setEditingProject(result.project);
      setDraft(draftFromProject(result.project));
      setDraftMedia(mediaFromProject(result.project));
      setNotice(result.warning ?? "Project saved.");
      await queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSavingProject(false);
    }
  }

  async function handleDelete(project: ProjectRecord) {
    setDeletingProjectId(project.id);
    setAuthError("");
    setNotice("");
    try {
      if (
        editingProject?.id === project.id &&
        draftMedia &&
        draftMedia.mediaPublicId !== editingProject.mediaPublicId
      ) {
        await removeUploadedMedia(draftMedia);
      }
      const result = await projectAdminRequest<{ success: true; warning?: string }>(
        `/api/projects/${encodeURIComponent(project.id)}`,
        { method: "DELETE" },
      );
      setProjects((current) => current.filter((item) => item.id !== project.id));
      setConfirmDeleteId(null);
      if (editingProject?.id === project.id) resetEditor();
      setNotice(result.warning ?? "Project deleted.");
      await queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setDeletingProjectId(null);
    }
  }

  async function removeUnsavedMedia() {
    if (!draftMedia) return;
    setCleaningMedia(true);
    setFormError("");
    try {
      await removeUploadedMedia(draftMedia);
      setDraftMedia(null);
      setNotice("Unsaved media removed.");
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setCleaningMedia(false);
    }
  }

  const isAuthenticated = Boolean(userEmail);

  return (
    <main className="project-manager">
      <header className="project-manager__bar">
        <Link className="project-manager__brand" to="/">
          IS-HAQ ABDUL-MOOMIN
        </Link>
        <div className="project-manager__bar-actions">
          <Link className="project-manager__text-button" to="/projects">
            Public projects
          </Link>
          {isAuthenticated && (
            <>
              <span className="project-manager__identity">{userEmail}</span>
              <button className="project-manager__text-button" type="button" onClick={handleSignOut}>
                <LogOut aria-hidden="true" size={16} /> Sign out
              </button>
            </>
          )}
        </div>
      </header>

      <div className="project-manager__content">
        <div className="project-manager__heading">
          <div>
            <h1>Manage projects</h1>
            <p>Keep your public project records current.</p>
          </div>
          {isAuthenticated && (
            <button
              className="project-manager__primary-button"
              type="button"
              disabled={savingProject || uploadingMedia || cleaningMedia}
              onClick={() => void startNewProject()}
            >
              <Plus aria-hidden="true" size={17} /> New project
            </button>
          )}
        </div>

        {loadingSession ? (
          <p className="project-manager__message" role="status">Checking your sign-in…</p>
        ) : !neonAuthClient ? (
          <p className="project-manager__message project-manager__message--error" role="alert">
            Neon Auth is not configured. Set <code>VITE_NEON_AUTH_URL</code> and restart the frontend.
          </p>
        ) : !isAuthenticated ? (
          <section className="project-manager__auth" aria-labelledby="project-auth-title">
            <h2 id="project-auth-title">{authMode === "sign-in" ? "Sign in to continue." : "Create your admin account."}</h2>
            <p>
              Only the verified account matching <code>ADMIN_EMAIL</code> can change project records.
            </p>
            {authError && <p className="project-manager__message project-manager__message--error" role="alert">{authError}</p>}
            {notice && <p className="project-manager__message" role="status">{notice}</p>}
            <form className="project-manager__form project-manager__auth-form" onSubmit={handleAuthSubmit}>
              <label>
                Email address
                <input
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  autoComplete={authMode === "sign-in" ? "current-password" : "new-password"}
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              <button className="project-manager__primary-button" type="submit" disabled={savingAuth}>
                {savingAuth ? "Please wait…" : authMode === "sign-in" ? "Sign in" : "Create account"}
              </button>
            </form>
            <button
              className="project-manager__text-button project-manager__auth-switch"
              type="button"
              onClick={() => {
                setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in");
                setAuthError("");
                setNotice("");
              }}
            >
              {authMode === "sign-in" ? "First time here? Create an account" : "Already registered? Sign in"}
            </button>
          </section>
        ) : (
          <>
            {authError && <p className="project-manager__message project-manager__message--error" role="alert">{authError}</p>}
            {notice && <p className="project-manager__message" role="status">{notice}</p>}
            {loadingProjects ? (
              <p className="project-manager__message" role="status">Loading project records…</p>
            ) : authError ? (
              <button className="project-manager__text-button" type="button" onClick={() => void loadProjects()}>
                Retry access check
              </button>
            ) : (
              <div className="project-manager__workspace">
                <section className="project-manager__list" aria-labelledby="project-list-title">
                  <div className="project-manager__section-heading">
                    <h2 id="project-list-title">Projects</h2>
                    <span className="print-label">{String(projects.length).padStart(2, "0")} records</span>
                  </div>
                  {projects.length === 0 ? (
                    <div className="project-manager__empty">
                      <h3>No project records yet.</h3>
                      <p>Create the first entry to add it to your portfolio.</p>
                    </div>
                  ) : (
                    <ol className="project-manager__catalog">
                      {projects.map((project) => (
                        <li className="project-manager__record" key={project.id}>
                          <button
                            className={`project-manager__record-select${editingProject?.id === project.id ? " is-selected" : ""}`}
                            type="button"
                            disabled={savingProject || uploadingMedia || cleaningMedia || Boolean(deletingProjectId)}
                            aria-pressed={editingProject?.id === project.id}
                            onClick={() => void selectProject(project)}
                          >
                            <span className="project-manager__record-media">
                              {project.mediaUrl && project.mediaType === "image" ? (
                                <img src={project.mediaUrl} alt="" loading="lazy" />
                              ) : (
                                <span>
                                  {project.mediaType === "video" ? "Video attached" : "No media added"}
                                </span>
                              )}
                            </span>
                            <span className="project-manager__record-copy">
                              <span className="project-manager__record-title">{project.title}</span>
                              <span className="project-manager__record-meta">
                                {project.year || "Year not set"} · {project.category || project.mediaType || "Media needed"}
                              </span>
                            </span>
                          </button>
                          <div className="project-manager__record-actions">
                            {deletingProjectId === project.id ? (
                              <span className="print-label" role="status">Deleting…</span>
                            ) : confirmDeleteId === project.id ? (
                              <>
                                <button
                                  className="project-manager__text-button project-manager__delete-confirm"
                                  type="button"
                                  disabled={savingProject || uploadingMedia || cleaningMedia}
                                  onClick={() => void handleDelete(project)}
                                >
                                  Confirm delete
                                </button>
                                <button
                                  className="project-manager__icon-button"
                                  type="button"
                                  aria-label="Cancel delete"
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  <X aria-hidden="true" size={17} />
                                </button>
                              </>
                            ) : (
                              <button
                                className="project-manager__icon-button project-manager__icon-button--danger"
                                type="button"
                                disabled={savingProject || uploadingMedia || cleaningMedia}
                                aria-label={`Delete ${project.title}`}
                                onClick={() => setConfirmDeleteId(project.id)}
                              >
                                <Trash2 aria-hidden="true" size={17} />
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>

                <section className="project-manager__editor" aria-labelledby="project-editor-title">
                  <div className="project-manager__section-heading">
                    <div className="project-manager__editor-title">
                      <h2 id="project-editor-title">{editingProject?.title || "New project"}</h2>
                      <p>{editingProject ? "Edit this public project record." : "Add a project to your portfolio."}</p>
                    </div>
                    {editingProject && (
                      <button
                        className="project-manager__text-button"
                        type="button"
                        disabled={savingProject || uploadingMedia || cleaningMedia}
                        onClick={() => void discardDraft()}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="project-manager__featured-media">
                    {draftMedia ? (
                      <ProjectMediaView
                        className="project-manager__media-view"
                        mediaUrl={draftMedia.mediaUrl}
                        mediaType={draftMedia.mediaType}
                        title={draft.title || "Selected project"}
                      />
                    ) : (
                      <div className="project-manager__media-empty">No project media yet</div>
                    )}
                  </div>
                  <form className="project-manager__form" onSubmit={handleSaveProject}>
                    <label>
                      Project title
                      <input
                        maxLength={160}
                        value={draft.title}
                        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        maxLength={10000}
                        rows={5}
                        value={draft.description}
                        onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                        required
                      />
                    </label>

                    <div className="project-manager__field">
                      <span>Project image or video</span>
                      <input
                        ref={fileInput}
                        accept="image/*,video/*"
                        aria-label="Choose a project image or video"
                        className="project-manager__file-input"
                        type="file"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadFile(file);
                        }}
                      />
                      <div className="project-manager__media-control">
                        <button
                          className="project-manager__secondary-button"
                          type="button"
                          disabled={uploadingMedia || savingProject || cleaningMedia}
                          onClick={() => fileInput.current?.click()}
                        >
                          {draftMedia?.mediaType === "video" ? <Video aria-hidden="true" size={17} /> : <ImagePlus aria-hidden="true" size={17} />}
                          {uploadingMedia ? "Uploading…" : draftMedia ? "Replace media" : "Choose image or video"}
                        </button>
                        <span className="print-label">Images up to 15 MB · videos up to 100 MB</span>
                      </div>
                      {draftMedia && draftMedia.mediaPublicId !== editingProject?.mediaPublicId && (
                        <button
                          className="project-manager__text-button project-manager__remove-upload"
                          type="button"
                          disabled={savingProject || uploadingMedia || cleaningMedia}
                          onClick={() => void removeUnsavedMedia()}
                        >
                          <X aria-hidden="true" size={16} /> Remove unsaved media
                        </button>
                      )}
                    </div>

                    <div className="project-manager__form-grid">
                      <label>
                        GitHub repository URL
                        <input
                          type="url"
                          inputMode="url"
                          placeholder="https://github.com/owner/repository"
                          value={draft.githubUrl}
                          onChange={(event) => setDraft({ ...draft, githubUrl: event.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Hosted project URL <span className="project-manager__optional">(optional)</span>
                        <input
                          type="url"
                          inputMode="url"
                          placeholder="https://your-project.example"
                          value={draft.hostedUrl}
                          onChange={(event) => setDraft({ ...draft, hostedUrl: event.target.value })}
                        />
                      </label>
                      <label>
                        Year <span className="project-manager__optional">(optional)</span>
                        <input
                          maxLength={20}
                          value={draft.year}
                          onChange={(event) => setDraft({ ...draft, year: event.target.value })}
                        />
                      </label>
                      <label>
                        Role <span className="project-manager__optional">(optional)</span>
                        <input
                          maxLength={120}
                          value={draft.role}
                          onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                        />
                      </label>
                      <label>
                        Category <span className="project-manager__optional">(optional)</span>
                        <input
                          maxLength={80}
                          value={draft.category}
                          onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                        />
                      </label>
                      <label>
                        Technologies <span className="project-manager__optional">(comma separated)</span>
                        <input
                          value={draft.technologies}
                          onChange={(event) => setDraft({ ...draft, technologies: event.target.value })}
                        />
                      </label>
                    </div>

                    {formError && <p className="project-manager__message project-manager__message--error" role="alert">{formError}</p>}
                    <div className="project-manager__form-actions">
                      {editingProject && (
                        <button
                          className="project-manager__text-button project-manager__open-public"
                          type="button"
                          onClick={() => window.open(`/projects`, "_blank", "noopener,noreferrer")}
                        >
                          View project index <ArrowUpRight aria-hidden="true" size={15} />
                        </button>
                      )}
                      <button
                        className="project-manager__primary-button"
                        type="submit"
                        disabled={savingProject || uploadingMedia || cleaningMedia}
                      >
                        <Save aria-hidden="true" size={17} />
                        {savingProject ? "Saving…" : editingProject ? "Save changes" : "Create project"}
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
