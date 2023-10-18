import AsyncStorage from '@react-native-async-storage/async-storage';

import { Prover } from './prover/prover';

const exercisesKey = 'exercises';

export const storeExercise = async (p: Prover) => {
  const obj = await AsyncStorage.getItem(exercisesKey);

  if (obj !== null) {
    const list: Prover[] = Object.assign([], obj);
    const newList = [...list, p];
    const serialized = JSON.stringify(newList);
    await AsyncStorage.setItem(exercisesKey, serialized);
  } else {
    const serialized = JSON.stringify([p]);
    await AsyncStorage.setItem(exercisesKey, serialized);
  }
};

export const getExercises = async () => {
  const obj = await AsyncStorage.getItem(exercisesKey);

  if (obj !== null) {
    const list : Prover[] = Object.assign([], obj);
    return list;
  } else {
    return [];
  }
};
