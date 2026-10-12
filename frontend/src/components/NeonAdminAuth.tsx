import { useState, type FormEvent, type ReactNode } from "react";
import { neonAuthClient } from "@/lib/neonAuth";

export type AdminAuthIdentity = {
  email: string;
  name: string;
  emailVerified: boolean;
};

type NeonAdminAuthPanelProps = {
  title: string;
  description: ReactNode;
  onAuthenticated: (identity: AdminAuthIdentity) => Promise<void>;
};

type AuthFlow = "sign-in" | "sign-up" | "verify-email" | "forgot-password" | "reset-password";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function NeonAdminAuthPanel({
  title,
  description,
  onAuthenticated,
}: NeonAdminAuthPanelProps) {
  const [flow, setFlow] = useState<AuthFlow>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function finishSignIn() {
    if (!neonAuthClient) return;
    const session = await neonAuthClient.getSession();
    if (session.error) throw new Error(session.error.message);
    if (!session.data.user) throw new Error("No active session was created. Please sign in again.");

    if (!session.data.user.emailVerified) {
      setFlow("verify-email");
      setNotice("Verify your email address before continuing.");
      return;
    }

    await onAuthenticated({
      email: session.data.user.email,
      name: session.data.user.name ?? "",
      emailVerified: session.data.user.emailVerified,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!neonAuthClient) return;
    setSaving(true);
    setError("");
    setNotice("");
    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (flow === "sign-in") {
        const result = await neonAuthClient.signIn.email({
          email: normalizedEmail,
          password,
        });
        if (result.error) throw new Error(result.error.message);
        await finishSignIn();
        return;
      }

      if (flow === "sign-up") {
        const result = await neonAuthClient.signUp.email({
          name: normalizedEmail.split("@")[0] || "Portfolio admin",
          email: normalizedEmail,
          password,
        });
        if (result.error) throw new Error(result.error.message);

        if (result.data?.user?.emailVerified) {
          await finishSignIn();
        } else {
          setEmail(normalizedEmail);
          setVerificationCode("");
          setFlow("verify-email");
          setNotice("Enter the verification code sent to your email address.");
        }
        return;
      }

      if (flow === "verify-email") {
        const result = await neonAuthClient.emailOtp.verifyEmail({
          email: normalizedEmail,
          otp: verificationCode.trim(),
        });
        if (result.error) throw new Error(result.error.message);

        const session = await neonAuthClient.getSession();
        if (session.error) throw new Error(session.error.message);
        if (session.data.user?.emailVerified) {
          await finishSignIn();
        } else {
          setFlow("sign-in");
          setPassword("");
          setNotice("Your email is verified. Sign in to continue.");
        }
        return;
      }

      if (flow === "forgot-password") {
        const result = await neonAuthClient.emailOtp.sendVerificationOtp({
          email: normalizedEmail,
          type: "forget-password",
        });
        if (result.error) throw new Error(result.error.message);
        setEmail(normalizedEmail);
        setVerificationCode("");
        setFlow("reset-password");
        setNotice("If the account is eligible, a password-reset code has been sent.");
        return;
      }

      const result = await neonAuthClient.emailOtp.resetPassword({
        email: normalizedEmail,
        otp: verificationCode.trim(),
        password,
      });
      if (result.error) throw new Error(result.error.message);
      setPassword("");
      setVerificationCode("");
      setFlow("sign-in");
      setNotice("Password updated. Sign in with your new password.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setSaving(false);
    }
  }

  async function resendVerificationCode() {
    if (!neonAuthClient) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await neonAuthClient.emailOtp.sendVerificationOtp({
        email: email.trim().toLowerCase(),
        type: "email-verification",
      });
      if (result.error) throw new Error(result.error.message);
      setNotice("A new verification code has been sent.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setSaving(false);
    }
  }

  function switchFlow(nextFlow: AuthFlow) {
    setFlow(nextFlow);
    setError("");
    setNotice("");
    setPassword("");
    setVerificationCode("");
  }

  const verificationFlow = flow === "verify-email" || flow === "reset-password";
  const passwordFlow = flow === "sign-in" || flow === "sign-up" || flow === "reset-password";
  const flowTitle = flow === "verify-email"
    ? "Verify your email"
    : flow === "forgot-password"
      ? "Reset your password"
      : flow === "reset-password"
        ? "Choose a new password"
        : flow === "sign-up"
          ? "Create your admin account."
          : title;

  return (
    <section className="project-manager__auth admin-auth-workflow" aria-labelledby="admin-auth-title">
      <h2 id="admin-auth-title">{flowTitle}</h2>
      <p>
        {flow === "verify-email"
          ? `Enter the six-digit code sent to ${email}. Codes expire after 15 minutes.`
          : flow === "forgot-password"
            ? "Enter the email address on your admin account. We will send a time-limited reset code."
            : flow === "reset-password"
              ? `Enter the reset code sent to ${email} and choose a new password.`
              : flow === "sign-up"
                ? "New accounts must verify their email. Only the address matching ADMIN_EMAIL is allowed."
                : description}
      </p>
      {error && <p className="project-manager__message project-manager__message--error" role="alert">{error}</p>}
      {notice && <p className="project-manager__message" role="status">{notice}</p>}

      <form className="project-manager__form project-manager__auth-form" onSubmit={handleSubmit}>
        {flow !== "verify-email" && flow !== "reset-password" && (
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
        )}
        {verificationFlow && (
          <label>
            {flow === "verify-email" ? "Verification code" : "Password-reset code"}
            <input
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />
          </label>
        )}
        {passwordFlow && (
          <label>
            {flow === "reset-password" ? "New password" : "Password"}
            <input
              autoComplete={flow === "sign-in" ? "current-password" : "new-password"}
              type="password"
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        )}
        <button className="project-manager__primary-button" type="submit" disabled={saving}>
          {saving
            ? "Please wait…"
            : flow === "sign-in"
              ? "Sign in"
              : flow === "sign-up"
                ? "Create account"
                : flow === "verify-email"
                  ? "Verify email"
                  : flow === "forgot-password"
                    ? "Send reset code"
                    : "Update password"}
        </button>
      </form>

      <div className="admin-auth-workflow__actions">
        {flow === "verify-email" && (
          <button className="project-manager__text-button" type="button" disabled={saving} onClick={() => void resendVerificationCode()}>
            Resend verification code
          </button>
        )}
        {flow === "sign-in" && (
          <button className="project-manager__text-button" type="button" onClick={() => switchFlow("forgot-password")}>
            Forgot password?
          </button>
        )}
        {(flow === "sign-in" || flow === "sign-up") && (
          <button
            className="project-manager__text-button"
            type="button"
            onClick={() => switchFlow(flow === "sign-in" ? "sign-up" : "sign-in")}
          >
            {flow === "sign-in" ? "First time here? Create an account" : "Already registered? Sign in"}
          </button>
        )}
        {(flow === "verify-email" || flow === "reset-password" || flow === "forgot-password") && (
          <button className="project-manager__text-button" type="button" onClick={() => switchFlow("sign-in")}>
            Back to sign in
          </button>
        )}
      </div>
    </section>
  );
}

type NeonAdminAccountSettingsProps = {
  email: string;
  name: string;
  emailVerified: boolean;
  onNameChanged: (name: string) => void;
};

export function NeonAdminAccountSettings({
  email,
  name,
  emailVerified,
  onNameChanged,
}: NeonAdminAccountSettingsProps) {
  const [nextName, setNextName] = useState(name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!neonAuthClient) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await neonAuthClient.updateUser({ name: nextName.trim() });
      if (result.error) throw new Error(result.error.message);
      const session = await neonAuthClient.getSession();
      if (session.error) throw new Error(session.error.message);
      const updatedName = session.data.user?.name ?? nextName.trim();
      setNextName(updatedName);
      onNameChanged(updatedName);
      setNotice("Account name updated.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!neonAuthClient) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await neonAuthClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (result.error) throw new Error(result.error.message);
      setCurrentPassword("");
      setNewPassword("");
      setNotice("Password changed. Other active sessions have been signed out.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="admin-auth-settings">
      <summary>Account settings</summary>
      <div className="admin-auth-settings__content">
        <p className="admin-auth-settings__identity">
          Signed in as <strong>{email}</strong> · Email {emailVerified ? "verified" : "not verified"}
        </p>
        {error && <p className="project-manager__message project-manager__message--error" role="alert">{error}</p>}
        {notice && <p className="project-manager__message" role="status">{notice}</p>}
        <div className="admin-auth-settings__forms">
          <form className="project-manager__form" onSubmit={handleProfileSubmit}>
            <h2>Profile</h2>
            <label>
              Display name
              <input
                autoComplete="name"
                maxLength={100}
                value={nextName}
                onChange={(event) => setNextName(event.target.value)}
                required
              />
            </label>
            <p className="admin-auth-settings__help">Email address changes are not currently supported by Neon Auth.</p>
            <button className="project-manager__secondary-button" type="submit" disabled={saving || nextName.trim() === name}>
              Update name
            </button>
          </form>
          <form className="project-manager__form" onSubmit={handlePasswordSubmit}>
            <h2>Change password</h2>
            <label>
              Current password
              <input
                autoComplete="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </label>
            <label>
              New password
              <input
                autoComplete="new-password"
                type="password"
                minLength={8}
                maxLength={128}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </label>
            <button className="project-manager__secondary-button" type="submit" disabled={saving}>
              Change password
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}
