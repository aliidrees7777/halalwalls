"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

const fieldClass =
  "w-full rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text3)] focus:border-[var(--brand)]";

const labelClass = "mb-1.5 block text-xs font-semibold text-[var(--text2)]";

const SettingsPage = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setBio(user.bio ?? "");
  }, [user]);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    const trimmedFirst = firstName.trim();
    if (!trimmedFirst) {
      setProfileError("First name is required.");
      return;
    }

    setProfileSaving(true);
    try {
      await updateProfile({
        firstName: trimmedFirst,
        lastName: lastName.trim(),
        bio: bio.trim(),
      });
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(
        err instanceof ApiError
          ? err.message
          : "Couldn't save your profile. Please try again.",
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof ApiError
          ? err.message
          : "Couldn't change your password. Please try again.",
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.35rem] font-extrabold tracking-tight">Settings</h1>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[var(--text2)]">
            {["Dashboard", "Settings"].map((b, i) => (
              <span key={b} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight size={13} /> : null}
                <span className={i === 1 ? "text-[var(--text)]" : "text-[var(--brand)]"}>
                  {b}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="card">
          <div className="card-hdr">
            <h2 className="card-ttl">My account</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            {profileMessage ? (
              <p className="rounded-lg border border-[var(--brand)]/40 bg-[var(--brand)]/10 px-3 py-2 text-sm text-[var(--brand)]">
                {profileMessage}
              </p>
            ) : null}
            {profileError ? (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {profileError}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="settings-first-name" className={labelClass}>
                  First name
                </label>
                <input
                  id="settings-first-name"
                  type="text"
                  className={fieldClass}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="settings-last-name" className={labelClass}>
                  Last name
                </label>
                <input
                  id="settings-last-name"
                  type="text"
                  className={fieldClass}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="settings-email" className={labelClass}>
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                className={`${fieldClass} cursor-not-allowed opacity-70`}
                value={user?.email ?? ""}
                readOnly
              />
              <p className="mt-1 text-xs text-[var(--text3)]">
                Email cannot be changed here.
              </p>
            </div>

            <div>
              <label htmlFor="settings-bio" className={labelClass}>
                Bio
              </label>
              <textarea
                id="settings-bio"
                rows={3}
                className={`${fieldClass} resize-y`}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short bio (optional)"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-black transition-[filter] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {profileSaving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-hdr">
            <h2 className="card-ttl">Change password</h2>
          </div>

          <form onSubmit={handlePasswordSave} className="space-y-4">
            {passwordMessage ? (
              <p className="rounded-lg border border-[var(--brand)]/40 bg-[var(--brand)]/10 px-3 py-2 text-sm text-[var(--brand)]">
                {passwordMessage}
              </p>
            ) : null}
            {passwordError ? (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {passwordError}
              </p>
            ) : null}

            <div>
              <label htmlFor="settings-current-password" className={labelClass}>
                Current password
              </label>
              <input
                id="settings-current-password"
                type="password"
                className={fieldClass}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="settings-new-password" className={labelClass}>
                  New password
                </label>
                <input
                  id="settings-new-password"
                  type="password"
                  className={fieldClass}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="settings-confirm-password" className={labelClass}>
                  Confirm new password
                </label>
                <input
                  id="settings-confirm-password"
                  type="password"
                  className={fieldClass}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="inline-flex items-center rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--bg4)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordSaving ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
