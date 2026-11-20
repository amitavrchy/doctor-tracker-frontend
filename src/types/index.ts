export type User = { _id: string; name: string; email: string; role: "admin" };

export type LoginUser = Omit<User, "_id"> & { id: string };

export type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  patientCount?: number;
};

export type Patient = {
  _id: string;
  doctor: string | { _id: string; name: string } | null;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  condition: string;
  admissionDate: string;
  notes?: string;
  status: "active" | "discharged";
  createdAt: string;
  updatedAt: string;
};

export type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListQuery = {
  page?: number;
  limit?: number;
  q?: string;
  from?: string;
  to?: string;
  order?: "asc" | "desc";
};

export type DoctorQuery = ListQuery & {
  specialization?: string;
  hospital?: string;
  sortBy?: "createdAt" | "name" | "specialization" | "hospital";
};

export type PatientQuery = ListQuery & {
  doctor?: string;
  condition?: string;
  gender?: Patient["gender"];
  status?: Patient["status"];
  sortBy?: "createdAt" | "admissionDate" | "name" | "condition";
};

export type DashboardQuery = {
  from?: string;
  to?: string;
  granularity?: "day" | "week" | "month";
  tz?: string;
  limit?: number;
};

type Count = { label: string; count: number };

export type DashboardResponse = {
  range: {
    from: string;
    to: string;
    granularity: "day" | "week" | "month";
    tz: string;
  };
  totals: {
    doctors: number;
    patients: number;
    active: number;
    discharged: number;
    newPatients: number;
  };
  patientsPerDoctor: {
    doctor: {
      id: string;
      name: string;
      specialization: string;
      hospital: string;
    } | null;
    count: number;
  }[];
  patientsByCondition: Count[];
  patientsByStatus: Count[];
  patientsByGender: Count[];
  doctorsBySpecialization: Count[];
  trends: { bucket: string; patientsAdmitted: number; doctorsAdded: number }[];
};
