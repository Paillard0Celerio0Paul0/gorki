export enum PredictionType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY'
}

export interface User {
  id: string;
  discord_id: string;
  username: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: Date;
}

export interface Prediction {
  id: string;
  text: string;
  type: PredictionType;
  points: number;
  created_by: string;
  created_at: Date | string;
  is_validated: boolean;
  correct_answer?: boolean;
  validated_at?: Date | string;
  
  // Dates
  day?: Date | string;                    // Pour journalières
  week_start?: Date | string;             // Pour hebdomadaires
  week_end?: Date | string;
  
  // Statut de vote
  voting_open: boolean;
  voting_closes_at?: Date | string;
  
  // Relations
  votes?: Vote[];
  creator?: User;
  mentioned_user?: User;         // Utilisateur mentionné dans la prédiction
  userVote?: Vote;               // Vote de l'utilisateur connecté (si existe)
  totalVotes?: number;           // Nombre total de votes
  yesVotes?: number;             // Votes "OUI"
  noVotes?: number;              // Votes "NON"
}

export interface Vote {
  id: string;
  prediction_id: string;
  user_id: string;
  vote: boolean;                 // true = OUI/VRAI, false = NON/FAUX
  created_at: Date;
  updated_at: Date;
  user?: User;
}

export interface UserVotingStatus {
  has_voted: boolean;
  can_vote: boolean;
  vote_value?: boolean;
  voting_ends_at?: Date | string;
  time_remaining?: string;
}

export interface PredictionWithVotingStatus extends Prediction {
  userVotingStatus: UserVotingStatus;
}

export interface UserScore {
  user?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  user_id: string;
  daily_correct: number;
  daily_total: number;
  weekly_correct: number;
  weekly_total: number;
  total_points_earned: number;
  total_points_possible: number;
  accuracy_percentage: number;
}

export interface PredictionLimits {
  daily_created_today: number;
  weekly_created_this_week: number;
  max_daily_per_day: 1;
  max_weekly_per_week: 3;
  can_create_daily: boolean;
  can_create_weekly: boolean;
}
