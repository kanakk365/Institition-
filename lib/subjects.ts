export const SUBJECT_OPTIONS = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Zoology", label: "Zoology" },
  { value: "History", label: "History" },
  { value: "Economics", label: "Economics" },
  { value: "Civics", label: "Civics" },
  { value: "Geography", label: "Geography" },
  { value: "English", label: "English" },
] as const;

export type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

export const SUBJECT_VALUES = SUBJECT_OPTIONS.map((option) => option.value);
