"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
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
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import pencil from "../../../../public/my-account/pencil.svg"
export interface AccountSettingsData extends AccountFormValues {
  cardLast4: string;
  cardExpiry: string;
  planLabel: string;
  billingPeriod: string;
}

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: AccountSettingsData;
  onSave: (data: AccountSettingsData) => void | Promise<void>;
}

function VisaBadge() {
  return (
    <span
      className="inline-flex h-7 w-11 shrink-0 items-center justify-center rounded-[3px] bg-[#0E4595] text-[12px] font-bold italic tracking-tight text-white"
      aria-hidden
    >
      VISA
    </span>
  );
}

export function AccountSettingsModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: AccountSettingsModalProps) {
  const { user, changePassword, resendVerification } = useAuth();
  const [values, setValues] = useState<AccountSettingsData>(initialData);
  const [errors, setErrors] = useState<AccountFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof AccountFormValues, boolean>>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelSubConfirm, setShowCancelSubConfirm] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

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
    setShowCancelSubConfirm(false);
    setSubscriptionActive(true);
    setStatusMessage(null);
    setSaving(false);
    setSaveError(null);
    setResending(false);
    setResent(false);
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


          {/* Payment Method */}
          <div className="mt-7 space-y-3 sm:mt-8">
            <AccountSectionTitle className="text-xl sm:text-2xl text-hw-depw">Payment Method</AccountSectionTitle>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-[6px] border border-hw-faint/40 bg-hw-input px-3 py-2.5 text-left transition-colors duration-200 hover:border-hw-faint/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hw-green/40"
              onClick={() =>
                setStatusMessage("Payment editing is available in a future update.")
              }
            >
              <VisaBadge />
              <span className="min-w-0 flex-1 text-[13px] text-hw-foreground/95 sm:text-sm">
                <span className="text-hw-muted">****</span> {values.cardLast4}
                <span className="mx-2 text-hw-muted/60">·</span>
                Exp. {values.cardExpiry}
              </span>
              <Image src={pencil} alt="pencil" className="size-3.5 shrink-0 text-hw-foreground/50"/>
              
            </button>
          </div>

          {/* Subscription Plan */}
          <div className="mt-7 space-y-3 sm:mt-8">
            <AccountSectionTitle className="text-xl sm:text-2xl text-hw-depw">Subscription Plan</AccountSectionTitle>

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
                {subscriptionActive
                  ? values.planLabel
                  : "No active subscription"}
              </span>
              {subscriptionActive ? (
                <PremiumIcon size={18} className="shrink-0 opacity-90" />
              ) : null}
            </div>

            {subscriptionActive ? (
              <div className="flex flex-col gap-3 rounded-[6px] border border-hw-faint/40 bg-hw-input px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-2.5">
                <p className="text-[12px] text-hw-faint sm:text-[13px]">
                  Billing period: {values.billingPeriod}
                </p>
                {!showCancelSubConfirm ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 shrink-0 rounded-[5px] border-0 bg-hw-faint px-3 text-[12px] font-semibold text-hw-input hover:bg-hw-faint/80 sm:text-[13px]"
                    onClick={() => setShowCancelSubConfirm(true)}
                  >
                    Cancel Subscription
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <span className="text-[11px] text-hw-muted">
                      Cancel your plan?
                    </span>
                    <Button
                      type="button"
                      size="xs"
                      variant="destructive"
                      onClick={() => {
                        setSubscriptionActive(false);
                        setShowCancelSubConfirm(false);
                        setStatusMessage("Subscription cancelled (demo).");
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      className="text-hw-muted"
                      onClick={() => setShowCancelSubConfirm(false)}
                    >
                      Keep
                    </Button>
                  </motion.div>
                )}
              </div>
            ) : null}
          </div>

          {/* Danger Zone */}
          <div className="mt-7 space-y-3 sm:mt-8">
            <AccountSectionTitle variant="danger">Danger Zone</AccountSectionTitle>

            {!showDeleteConfirm ? (
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-[6px] border border-[#B10000] bg-hw-input/50 px-3.5 py-3 text-left transition-all duration-200 hover:bg-[#B10000]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B10000]/40"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <span className="text-[13px] font-medium text-[#B10000] sm:text-sm">
                  Delete Account Permanently
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
                  This action cannot be undone. All data will be removed.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-hw-muted"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Keep Account
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setStatusMessage("Account deletion requested (demo).");
                      setShowDeleteConfirm(false);
                    }}
                  >
                    Delete Permanently
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
    cardLast4: "4243",
    cardExpiry: "8/2030",
    planLabel: "Premium Plan (Annual)",
    billingPeriod: "May 14, 2026 ~ May 14, 2027",
    ...overrides,
  };
}
