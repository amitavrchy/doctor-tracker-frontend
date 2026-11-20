"use client";

import { useEffect, useState } from "react";
import { Input, Select } from "@/components/ui";
import { useDoctors } from "@/features/doctors/api/hooks";

export function DoctorPicker({
  value,
  label,
  onChange,
  initialName,
  filterLayout = false,
}: {
  value: string;
  label: string;
  onChange: (value: string) => void;
  initialName?: string;
  filterLayout?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);
  const query = useDoctors({ q: debounced, limit: "50" });
  const doctors = query.data?.data || [];
  return (
    <div
      className={
        filterLayout
          ? "grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:contents"
          : "grid gap-2"
      }
    >
      <div className={filterLayout ? "lg:order-1" : undefined}>
        <Input
          label={`Search ${label.toLowerCase()}`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search doctors"
          maxLength={100}
        />
      </div>
      <div className={filterLayout ? "lg:order-1" : undefined}>
        <Select
          label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select a doctor</option>
          {value && !doctors.some((doctor) => doctor._id === value) && (
            <option value={value}>{initialName || "Selected doctor"}</option>
          )}
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name} · {doctor.specialization}
            </option>
          ))}
        </Select>
      </div>
      {query.isError && (
        <p
          role="alert"
          className="text-sm text-red-600 sm:col-span-2 lg:order-2 lg:col-span-full"
        >
          Could not load doctors. Try another search.
        </p>
      )}
    </div>
  );
}
