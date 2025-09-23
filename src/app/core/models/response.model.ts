export interface AnswerDto {
  id: number;
  questionId: number;
  questionText: string;
  questionType: string;
  value: string;
}

export interface ResponseDto {
  id: number;
  submittedAt: string;
  userIp: string;
  answers: AnswerDto[];
}

export interface AnswerSubmitRequest {
  questionId: number;
  value: string;
}

export interface ResponseSubmitRequest {
  surveyPublicId: string;
  answers: AnswerSubmitRequest[];
  lgpdConsent?: boolean;
}
