export interface Response<T> {
  status: number;
  data: T;
}

export interface ErrorResponse {
  status: number;
  detail: {
    type: string;
    msg: string;
    input?: string;
  }[] | string;
}

export function isErrorDetail(obj: unknown): obj is ErrorResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "status" in obj &&
    "detail" in obj &&
    Array.isArray((obj as ErrorResponse).detail)
  );
}
