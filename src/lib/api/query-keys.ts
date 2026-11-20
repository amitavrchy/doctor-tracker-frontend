export const queryKeys = {
  auth: { me: ["auth", "me"] as const },
  doctors: {
    all: ["doctors"] as const,
    list: (query: object) => ["doctors", "list", query] as const,
    detail: (id: string) => ["doctors", "detail", id] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (query: object) => ["patients", "list", query] as const,
    doctorList: (id: string, query: object) =>
      ["patients", "doctor", id, query] as const,
    detail: (id: string) => ["patients", "detail", id] as const,
  },
  dashboard: (query: object) => ["dashboard", query] as const,
};
