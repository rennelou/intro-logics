import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ExerciseCreatorView from './views/exercise-creator-view';
import { Prover } from './prover/prover';

export function HomeScreen() { 

  const addExercise = (e: Prover) => {
    console.log(e);
  }; 

  return (<ExerciseCreatorView returnExercise={addExercise} />);
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

