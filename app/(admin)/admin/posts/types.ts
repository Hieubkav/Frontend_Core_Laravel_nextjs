export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  active: boolean;
  order: number | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
  links?: {
    next?: string | null;
    prev?: string | null;
  };
}
