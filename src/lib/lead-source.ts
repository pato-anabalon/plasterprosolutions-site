/**
 * The ways a customer can say they found the company, offered in the contact
 * form and sent to the CRM as the lead's `source`.
 *
 * Every entry has to be spelled exactly as it is in the CRM — either one of its
 * own sources (Referral, Social media, Other…) or an option added under
 * Settings → Company. The CRM matches the text to its list and files anything it
 * doesn't know under "Website", so a label that drifts from the CRM's isn't
 * refused: the answer silently stops being recorded. Change both together.
 *
 * `value` is what is sent and must match the CRM; `label` is only what the
 * customer reads, so the two can differ ("Other Social Network" is sent as the
 * CRM's "Social media").
 */
export const leadSourceOptions = [
  { label: "Google Campaign", value: "Google Campaign" },
  { label: "NoCowboys", value: "NoCowboys" },
  { label: "Facebook", value: "Facebook" },
  { label: "Instagram", value: "Instagram" },
  { label: "Flyer", value: "Flyer" },
  { label: "Referral", value: "Referral" },
  { label: "Cold Call", value: "Cold Call" },
  { label: "Event", value: "Event" },
  { label: "Other Social Network", value: "Social media" },
  { label: "Other", value: "Other" },
] as const;

/** What a lead is when the form says nothing, or something not on the list. */
export const defaultLeadSource = "Website";

/**
 * The value to forward. The browser's answer is checked against the list here as
 * well: the form is public, and a hand-made request must not put its own words
 * in the CRM's source field.
 */
export function resolveLeadSource(value: string): string {
  return leadSourceOptions.find((option) => option.value === value)?.value ?? defaultLeadSource;
}
