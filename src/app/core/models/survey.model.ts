import { QuestionDto, QuestionStatsDto, QuestionCreateRequest, QuestionTemplate } from './question.model';

export interface SurveyDto {
  id: number;
  title: string;
  description: string;
  publicId: string;
  active: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  questions: QuestionDto[];
  responsesCount: number;
  publicUrl: string;
  qrCodeUrl: string;
}

export interface SurveyCreateRequest {
  title: string;
  description: string;
  questions: QuestionCreateRequest[];
}

export interface SurveyUpdateRequest {
  title?: string;
  description?: string;
  active?: boolean;
  status?: string;
  questions?: QuestionCreateRequest[];
}

export interface SurveySummaryDto {
  id: number;
  title: string;
  description: string;
  active: boolean;
  status: string;
  createdAt: string;
  questionsCount: number;
  responsesCount: number;
  publicUrl: string;
}

export interface SurveyTemplate {
  name: string;
  description: string;
  category: string;
  questions: QuestionTemplate[];
}

export interface SurveyStatsDto {
  surveyId: number;
  surveyTitle: string;
  totalResponses: number;
  lastResponse: string;
  questionStats: QuestionStatsDto[];
}
