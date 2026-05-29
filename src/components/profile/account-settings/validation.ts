export interface AccountFormValues {
  name: string;
  email: string;
  description: string;
  avatar: string;
  banner: string;
}

export type AccountFormErrors = Partial<
  Record<keyof Pick<AccountFormValues, "name" | "email" | "description">, string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAccountForm(
  values: AccountFormValues
): AccountFormErrors {
  const errors: AccountFormErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.description.length > 200) {
    errors.description = "Description must be 200 characters or fewer.";
  }

  return errors;
}

export function hasFormErrors(errors: AccountFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
