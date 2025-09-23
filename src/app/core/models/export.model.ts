export interface ExportRequest {
  surveyId: number;
  format: string;
  dateFrom?: string;
  dateTo?: string;
  includeHeaders?: boolean;
}
