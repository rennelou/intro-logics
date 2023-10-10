import React, { useState } from 'react';
import { View } from 'react-native';

import PropositionCreatorView from './components/proposition-creator-view';
import ItemListComponent from './components/expression-creator-view';
import { ExerciseBuilder, createExerciseBuilder, addProposition } from '../prover/exercise-creator';

export default function App() {
  const [exerciseBuilder, setExerciseBuilder] = useState<ExerciseBuilder>(createExerciseBuilder());

  const insertProposition = (newProposition: string) => { 
    setExerciseBuilder( addProposition (exerciseBuilder) (newProposition) );
  };

  return (
    <View>
      <PropositionCreatorView exerciseBuilder={exerciseBuilder} onAddProposition={insertProposition} />
      <ItemListComponent />
    </View>
  );
}
