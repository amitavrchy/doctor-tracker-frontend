// Shared frontend types (TODO: align with backend models)
export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
