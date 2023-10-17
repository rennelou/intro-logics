import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Prover } from './prover/prover';
import ExerciseCreatorView from './views/exercise-creator-view';
import ExercisesView from './views/exercises-view';

const Stack = createNativeStackNavigator();

export default function App() {
  const [exerciseList, setExerciseList] = useState<Prover[]>([]);

  const insertExercise = (e: Prover) => {
    setExerciseList([...exerciseList, e]);
  };


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Exercises">
        <Stack.Screen name="Exercises" component={ExercisesView} />
        <Stack.Screen
          name="ExerciseCreator" 
          component={ExerciseCreatorView}
          initialParams={{ returnExercise: insertExercise }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

