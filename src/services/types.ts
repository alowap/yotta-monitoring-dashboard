export interface APIResponse<T> {
  status: number;
  data: T;
  message: string;
}

export interface APIResponseStatus {
  status: number;
  message: string;
}