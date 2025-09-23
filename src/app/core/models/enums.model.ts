export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  SCALE = 'SCALE',
  NPS = 'NPS',
  CSAT = 'CSAT',
  CES = 'CES',
  DROPDOWN = 'DROPDOWN',
  RADIO = 'RADIO',
  EMOTION = 'EMOTION',
  LIKE_DISLIKE = 'LIKE_DISLIKE'
}

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
