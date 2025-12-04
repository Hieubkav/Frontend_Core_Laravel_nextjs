export interface MediaItem {
  id: number;
  name: string;
  file_name: string;
  collection_name: string;
  mime_type: string | null;
  size: number;
  url: string;
  thumbnail_url: string;
  custom_properties: Record<string, any>;
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
