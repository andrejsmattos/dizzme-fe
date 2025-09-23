export interface QuestionDto {
  id: number;
  type: string;
  text: string;
  options: string[];
  questionOrder: number;
  required: boolean;
}


export interface AnswerDistribution {
  [option: string]: number;
}

export interface QuestionCreateRequest {
  type: string;
  text: string;
  options: string[];
  questionOrder: number;
  required: boolean;
}

export interface QuestionTemplate {
  type: string;
  text: string;
  options: string;
  required: boolean;
  questionOrder: number;
}

export interface QuestionStatsDto {
  questionId: number;
  questionText: string;
  questionType: string;
  totalAnswers: number;
  answerDistribution: Record<string, number>;
  textAnswers: string[];
  average?: number;
  npsPromoters?: number;
  npsPassives?: number;
  npsDetractors?: number;
  npsScore?: number;
}
