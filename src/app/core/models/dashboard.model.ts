import { ClientSummaryDto } from './client.model';
import { SurveySummaryDto } from './survey.model';

export interface DashboardStatsDto {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  responsesToday: number;
  avgNPS: number;
  avgCSAT: number;
  avgCES: number;
}

export interface QuestionStatsDto {
  questionId: number;
  questionText: string;
  questionType: string;
  totalAnswers: number;
  answerDistribution: { [key: string]: number };
  textAnswers: string[];
  average?: number;
  npsPromoters?: number;
  npsPassives?: number;
  npsDetractors?: number;
  npsScore?: number;
}

export interface SurveyStatsDto {
  surveyId: number;
  surveyTitle: string;
  totalResponses: number;
  lastResponse: string;
  questionStats: QuestionStatsDto[];
}

export interface AdminDashboardDto {
  totalClients: number;
  activeClients: number;
  totalSurveys: number;
  totalResponses: number;
  monthlyStats: { [key: string]: number };
  recentClients: ClientSummaryDto[];
  recentSurveys: SurveySummaryDto[];
}
