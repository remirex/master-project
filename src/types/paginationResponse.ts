export interface PaginationResponse {
  next: Record<string, unknown>;
  previous: Record<string, unknown>;
  data: string[];
  totalPages: number;
  currentPage: number;
}
