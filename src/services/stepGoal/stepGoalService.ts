import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { CreateStepGoalData, StepGoal, UpdateStepGoalData } from './types';

const COLLECTION_NAME = 'stepGoals';

export const getStepGoal = async (userId: string): Promise<StepGoal | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        userId,
        dailyStepGoal: data.dailyStepGoal,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting step goal:', error);
    throw error;
  }
};

export const createStepGoal = async (
  userId: string,
  data: CreateStepGoalData
): Promise<void> => {
  try {
    const now = Timestamp.now();
    const docRef = doc(db, COLLECTION_NAME, userId);
    await setDoc(docRef, {
      dailyStepGoal: data.dailyStepGoal,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error('Error creating step goal:', error);
    throw error;
  }
};

export const updateStepGoal = async (
  userId: string,
  data: UpdateStepGoalData
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(docRef, {
      dailyStepGoal: data.dailyStepGoal,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating step goal:', error);
    throw error;
  }
};
