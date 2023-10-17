import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './views/utils';
import { Prover } from './prover/prover';
import ExerciseCreatorView from './views/exercise-creator-view';
import ExercisesView from './views/exercises-view';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Exercises">
        <Stack.Screen name="Exercises" component={ExercisesView} />
        <Stack.Screen name="ExerciseCreator" component={ExerciseCreatorView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

