export interface Response<T> {
  status: number;
  data: T;
}

export interface ErrorDetail {
    detail: string;
}

export function isErrorDetail(obj: unknown): obj is ErrorDetail {
    return typeof obj === "object" && obj !== null && "detail" in obj;
}