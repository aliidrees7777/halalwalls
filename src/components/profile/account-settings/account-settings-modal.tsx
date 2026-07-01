"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PremiumIcon } from "@/components/profile/premium-icon";
import { AccountFormField } from "@/components/profile/account-settings/account-form-field";
import { AccountImageUpload } from "@/components/profile/account-settings/account-image-upload";
import { AccountSectionTitle } from "@/components/profile/account-settings/account-section-title";
import {
  validateAccountForm,
  hasFormErrors,
  type AccountFormValues,
  type AccountFormErrors,
} from "@/components/profile/account-settings/validation";
import { useAuth } from "@/context/auth-context";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

// The editable account form values (profile fields). Subscription + payment
// state is fetched live from the backend, not carried in here.
export type AccountSettingsData = AccountFormValues;

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: AccountSettingsData;
  onSave: (data: AccountSettingsData) => void | Promise<void>;
}

// Live subscription status from GET /subscriptions/me.
interface SubscriptionInfo {
  isPremium: boolean;
  status: string | null;
  plan: string | null;
  currentPeriodEnd: string | null;
}

// Human-readable plan label from the stored plan key / status.
function formatPlanLabel(sub: SubscriptionInfo | null): string {
  if (!sub) return "Premium Plan";
  if (sub.status === "lifetime" || sub.plan === "lifetime")
    return "Premium Plan (Lifetime)";
  if (sub.plan === "yearly") return "Premium Plan (Annual)";
  if (sub.plan === "monthly") return "Premium Plan (Monthly)";
  return "Premium Plan";
}

// Billing line derived from the current period end + status.
function formatBilling(sub: SubscriptionInfo | null): string {
  if (!sub) return "";
  if (sub.status === "lifetime" || sub.plan === "lifetime")
    return "Lifetime access — no renewal";
  if (!sub.currentPeriodEnd) return "";
  const date = new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const renews = sub.status === "active" || sub.status === "trialing";
  return `${renews ? "Renews on" : "Active until"} ${date}`;
}

export function AccountSettingsModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: AccountSettingsModalProps) {
  const router = useRouter();
  const { user, changePassword, resendVerification, deleteAccount } = useAuth();
  const [values, setValues] = useState<AccountSettingsData>(initialData);
  const [errors, setErrors] = useState<AccountFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof AccountFormValues, boolean>>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Live subscription + billing-portal + delete state.
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Change-password state — kept independent of the profile `values` so that
  // saving the profile and updating the password are fully separate actions.
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const resetForm = useCallback(() => {
    setValues(initialData);
    setErrors({});
    setTouched({});
    setShowDeleteConfirm(false);
    setStatusMessage(null);
    setSaving(false);
    setSaveError(null);
    setResending(false);
    setResent(false);
    setPortalLoading(false);
    setDeleting(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordSubmitting(false);
    setPasswordError(null);
    setPasswordSuccess(false);
  }, [initialData]);

  useEffect(() => {
    if (open) resetForm();
  }, [open, resetForm]);

  // Load the real subscription status whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    let ignore = false;
    setSubLoading(true);
    api
      .get<SubscriptionInfo>("/subscriptions/me")
      .then((data) => {
        if (!ignore) setSubscription(data);
      })
      .catch(() => {
        if (!ignore) setSubscription(null);
      })
      .finally(() => {
        if (!ignore) setSubLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [open]);

  const subscriptionActive = !!subscription?.isPremium;
  const planLabel = formatPlanLabel(subscription);
  const billingText = formatBilling(subscription);

  function updateField<K extends keyof AccountFormValues>(
    key: K,
    value: AccountFormValues[K]
  ) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (touched[key]) {
        setErrors(validateAccountForm(next));
      }
      return next;
    });
  }

  function markTouched(key: keyof AccountFormValues) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validateAccountForm(values));
  }

  async function handleSave() {
    const nextErrors = validateAccountForm(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, description: true });

    if (hasFormErrors(nextErrors)) return;

    setSaving(true);
    setSaveError(null);
    try {
      await onSave(values); // persists to the backend; throws on failure
      setStatusMessage("Account saved successfully.");
      setTimeout(() => {
        setStatusMessage(null);
        onOpenChange(false);
      }, 700);
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : "Couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleResendVerification() {
    setResent(false);
    setSaveError(null);
    setResending(true);
    try {
      await resendVerification();
      setResent(true);
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : "Couldn't resend the confirmation email. Please try again."
      );
    } finally {
      setResending(false);
    }
  }

  // Open Stripe's billing portal (manage payment method / cancel subscription).
  // On success the browser navigates away, so loading state is left on.
  async function openBillingPortal() {
    setSaveError(null);
    setStatusMessage(null);
    setPortalLoading(true);
    try {
      const { url } = await api.post<{ url: string }>(
        "/subscriptions/portal",
        {}
      );
      window.location.href = url;
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : "Couldn't open the billing portal. Please try again."
      );
      setPortalLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setSaveError(null);
    setDeleting(true);
    try {
      await deleteAccount(); // DELETE /me + clears the session
      router.push("/"); // leave the (now inaccessible) profile page
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : "Couldn't delete your account. Please try again."
      );
      setDeleting(false);
    }
  }

  function handleCancel() {
    resetForm();
    onOpenChange(false);
  }

  async function handleChangePassword() {
    setPasswordSuccess(false);
    setPasswordError(null);

    // Client-side guards before hitting the backend.
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

    setPasswordSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setPasswordSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent showCloseButton className="max-w-[640px] border-[#05DF8B]">
        <DialogHeader className="shrink-0 border-b border-hw-border ">
          <DialogTitle className="text-xl sm:text-2xl text-hw-depw">Account Information</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          <AnimatePresence mode="wait">
            {statusMessage ? (
              <motion.p
                key="status"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                className="mb-4 rounded-lg border border-hw-green/40 bg-hw-green/10 px-3 py-2 text-center text-xs text-hw-green sm:text-sm"
              >
                {statusMessage}
              </motion.p>
            ) : null}
          </AnimatePresence>

          {/* Profile images */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <AccountImageUpload
              label="profile photo"
              src={values.avatar}
              alt=""
              variant="avatar"
              onChange={(avatar) => updateField("avatar", avatar)}
            />
            <AccountImageUpload
              label="banner image"
              src={values.banner}
              alt=""
              variant="banner"
              onChange={(banner) => updateField("banner", banner)}
            />
          </div>

          {/* Account fields */}
          <div className="mt-5 space-y-3.5 sm:mt-6">
            <AccountFormField
              id="account-name"
              label="Name"
              value={values.name}
              onChange={(name) => updateField("name", name)}
              onBlur={() => markTouched("name")}
              error={touched.name ? errors.name : undefined}
            />
            <AccountFormField
              id="account-email"
              label="Email (cannot be changed)"
              type="email"
              value={values.email}
              onChange={() => {}}
              disabled
            />
            {/* Email verification status + resend */}
            {user && !user.emailVerified ? (
              <div className="-mt-1 flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                <span className="text-[12px] text-amber-400">
                  Your email is not verified.
                </span>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending || resent}
                  className="text-[12px] font-semibold text-[#05DF8B] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resent
                    ? "Confirmation sent ✓"
                    : resending
                      ? "Sending…"
                      : "Resend confirmation"}
                </button>
              </div>
            ) : user?.emailVerified ? (
              <p className="-mt-1 px-1 text-[12px] text-[#05DF8B]">
                ✓ Email verified
              </p>
            ) : null}
            <AccountFormField
              id="account-description"
              label="Description"
              multiline
              value={values.description}
              onChange={(description) => updateField("description", description)}
              onBlur={() => markTouched("description")}
              error={touched.description ? errors.description : undefined}
            />
          </div>


          {/* Change Password — hidden until the client approves. Flip `false` to
              `true` (or delete the guard) to re-enable the whole section. */}
          {false && (
          <div className="mt-7 space-y-3 sm:mt-8">
            <AccountSectionTitle className="text-xl sm:text-2xl text-hw-depw">Change Password</AccountSectionTitle>
            <div className="space-y-3.5">
              <AccountFormField
                id="account-current-password"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <AccountFormField
                id="account-new-password"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                error={
                  newPassword.length > 0 && newPassword.length < 8
                    ? "Use at least 8 characters."
                    : undefined
                }
              />
              <AccountFormField
                id="account-confirm-password"
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                error={
                  confirmNewPassword.length > 0 && newPassword !== confirmNewPassword
                    ? "Passwords do not match."
                    : undefined
                }
              />
              {/* Live match confirmation */}
              {confirmNewPassword.length > 0 &&
              newPassword.length >= 8 &&
              newPassword === confirmNewPassword ? (
                <p role="status" className="text-[12px] text-[#05DF8B]">
                  ✓ Passwords match
                </p>
              ) : null}
              {passwordError ? (
                <p role="alert" className="text-[12px] text-red-400">
                  {passwordError}
                </p>
              ) : passwordSuccess ? (
                <p role="status" className="text-[12px] text-[#05DF8B]">
                  ✓ Password updated.
                </p>
              ) : null}
              <Button
                type="button"
                onClick={handleChangePassword}
                disabled={
                  passwordSubmitting ||
                  !currentPassword ||
                  newPassword.length < 8 ||
                  newPassword !== confirmNewPassword
                }
                className="h-9 rounded-[5px] bg-[#05DF8B] px-4 text-[13px] font-semibold text-hw-input hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordSubmitting ? "Updating…" : "Change Password"}
              </Button>
            </div>
          </div>
          )}

          {/* Payment Method */}
          <div className="mt-7 space-y-3 sm:mt-8">
            <AccountSectionTitle className="text-xl sm:text-2xl text-hw-depw">Payment Method</AccountSectionTitle>
            {subscriptionActive ? (
              <button
                type="button"
                disabled={portalLoading}
                className="flex w-full items-center gap-3 rounded-[6px] border border-hw-faint/40 bg-hw-input px-3 py-2.5 text-left transition-colors duration-200 hover:border-hw-faint/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/40 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={openBillingPortal}
              >
                <CreditCard className="size-5 shrink-0 text-hw-foreground/70" />
                <span className="min-w-0 flex-1 text-[13px] text-hw-foreground/95 sm:text-sm">
                  {portalLoading
                    ? "Opening secure portal…"
                    : "Manage your payment method in the secure billing portal"}
                </span>
              </button>
            ) : (
              <p className="rounded-[6px] border border-hw-faint/40 bg-hw-input px-3 py-2.5 text-[13px] text-hw-muted">
                No payment method on file.
              </p>
            )}
          </div>

          {/* Subscription Plan */}
          <div className="mt-7 space-y-3 sm:mt-8">
            <AccountSectionTitle className="text-xl sm:text-2xl text-hw-depw">Subscription Plan</AccountSectionTitle>

            {subLoading ? (
              <p className="rounded-[6px] border border-hw-faint/40 bg-hw-input px-3.5 py-2.5 text-[13px] text-hw-muted">
                Loading subscription…
              </p>
            ) : (
              <>
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[6px] border bg-hw-input px-3.5 py-2.5 transition-colors duration-200",
                    subscriptionActive
                      ? "border-[#FFD700]"
                      : "border-hw-faint/40 opacity-70"
                  )}
                >
                  <span
                    className={cn(
                      "text-[13px] font-medium sm:text-sm",
                      subscriptionActive ? "text-[#FFD700]" : "text-hw-muted"
                    )}
                  >
                    {subscriptionActive ? planLabel : "No active subscription"}
                  </span>
                  {subscriptionActive ? (
                    <PremiumIcon size={18} className="shrink-0 opacity-90" />
                  ) : null}
                </div>

                {subscriptionActive ? (
                  <div className="flex flex-col gap-3 rounded-[6px] border border-hw-faint/40 bg-hw-input px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-2.5">
                    <p className="text-[12px] text-hw-faint sm:text-[13px]">
                      {billingText || "Active subscription"}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={portalLoading}
                      className="h-8 shrink-0 rounded-[5px] border-0 bg-hw-faint px-3 text-[12px] font-semibold text-hw-input hover:bg-hw-faint/80 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]"
                      onClick={openBillingPortal}
                    >
                      {portalLoading ? "Opening…" : "Cancel Subscription"}
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Danger Zone */}
          <div className="mt-7 space-y-3 sm:mt-8">
            <AccountSectionTitle variant="danger">Danger Zone</AccountSectionTitle>

            {!showDeleteConfirm ? (
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-[6px] border border-[#B10000] bg-hw-input px-3.5 py-3 text-left transition-colors duration-200 hover:bg-[#B10000]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B10000]/40"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <span className="text-[13px] font-medium text-[#B10000] sm:text-sm">
                  Delete Account
                </span>
                <Trash2 className="size-4 shrink-0 text-[#B10000]" />
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 rounded-lg border border-red-500/80 bg-red-500/5 p-3.5"
              >
                <p className="text-center text-[12px] text-hw-foreground/90 sm:text-[13px]">
                  This deactivates your account and signs you out. Your data is
                  kept — you can restore it anytime by signing back in.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-hw-muted"
                    disabled={deleting}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Keep Account
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                  >
                    {deleting ? "Deleting…" : "Delete Account"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 flex-col gap-2 border-t border-hw-border px-5 py-4 sm:flex-row sm:items-center sm:px-7">
          {saveError ? (
            <p
              role="alert"
              className="mr-auto text-[12px] text-red-400 sm:self-center"
            >
              {saveError}
            </p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={saving}
            className="text-hw-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#05DF8B] font-semibold text-hw-input hover:brightness-95"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function profileUserToAccountSettings(
  user: {
    name: string;
    email: string;
    bio: string;
    avatar: string;
    banner: string;
  },
  overrides?: Partial<AccountSettingsData>
): AccountSettingsData {
  return {
    name: user.name,
    email: user.email,
    description: user.bio,
    avatar: user.avatar,
    banner: user.banner,
    ...overrides,
  };
}
