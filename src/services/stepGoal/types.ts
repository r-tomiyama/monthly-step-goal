export interface StepGoal {
  userId: string;
  dailyStepGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStepGoalData {
  dailyStepGoal: number;
}

export interface UpdateStepGoalData {
  dailyStepGoal: number;
}
