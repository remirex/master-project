export interface PaginationResponse {
  next: object;
  previous: object;
  data: string[];
  totalPages: number;
  currentPage: number;
}
