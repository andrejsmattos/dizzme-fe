export interface ClientDto {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  surveysCount: number;
}

export interface ClientUpdateRequest {
  name: string;
  email: string;
  active?: boolean;
}

export interface ClientSummaryDto {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  surveysCount: number;
  responsesCount: number;
}
