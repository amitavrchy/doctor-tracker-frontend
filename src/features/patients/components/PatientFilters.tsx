import {
  ListFilters,
  type ListFilterProps,
} from "@/features/shared/ListFilters";

const filters = [
  { name: "condition", label: "Condition" },
  {
    name: "gender",
    label: "Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  {
    name: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "discharged", label: "Discharged" },
    ],
  },
  { name: "from", label: "Admitted from", type: "date" },
  { name: "to", label: "Admitted to", type: "date" },
];
const sorts = [
  { value: "createdAt", label: "Date added" },
  { value: "admissionDate", label: "Admission date" },
  { value: "name", label: "Name" },
  { value: "condition", label: "Condition" },
];
export function PatientFilters(props: ListFilterProps) {
  return <ListFilters {...props} filters={filters} sortOptions={sorts} />;
}
