interface responseError {
  status: number;
  data: {
    detail: string;
  };
}

export type { responseError };