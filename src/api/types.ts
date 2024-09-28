export interface responseError {
  status: number;
  data: {
    detail: string;
  };
}

export function isErrorData(data: unknown): data is { error: boolean } {
  return typeof data === 'object' && data !== null && 'error' in data;
}