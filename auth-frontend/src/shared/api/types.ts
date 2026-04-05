export type ApiResponse<T> = {
  data: T;
};

export type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};
