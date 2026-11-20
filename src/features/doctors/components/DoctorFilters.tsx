import {
  ListFilters,
  type ListFilterProps,
} from "@/features/shared/ListFilters";

const filters = [
  { name: "specialization", label: "Specialization" },
  { name: "hospital", label: "Hospital" },
  { name: "from", label: "Added from", type: "date" },
  { name: "to", label: "Added to", type: "date" },
];
const sorts = [
  { value: "createdAt", label: "Date added" },
  { value: "name", label: "Name" },
  { value: "specialization", label: "Specialization" },
  { value: "hospital", label: "Hospital" },
];
export function DoctorFilters(props: ListFilterProps) {
  return <ListFilters {...props} filters={filters} sortOptions={sorts} />;
}
