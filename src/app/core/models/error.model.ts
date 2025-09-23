export interface ErrorResponse {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: string;
  validationErrors?: { [key: string]: string };
}

export interface ValidationErrorResponse {
  field: string;
  message: string;
  rejectedValue: any;
}
