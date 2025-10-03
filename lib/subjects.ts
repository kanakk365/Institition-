export const SUBJECT_OPTIONS = [
  { value: "Math", label: "Math" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Zoology", label: "Zoology" },
  { value: "History", label: "History" },
  { value: "Economics", label: "Economics" },
  { value: "Civics", label: "Civics" },
  { value: "Geography", label: "Geography" },
  { value: "English", label: "English" },
  { value: "Science", label: "Science" },
  { value: "Social Studies", label: "Social Studies" },
  { value: "UG", label: "UG" },
  { value: "PG", label: "PG" },
] as const;

export type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

export const SUBJECT_VALUES = SUBJECT_OPTIONS.map((option) => option.value);
