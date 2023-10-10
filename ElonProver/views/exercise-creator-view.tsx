import React, { useState } from 'react';
import { View } from 'react-native';

import PropositionCreatorView from './components/proposition-creator-view';
import PremisesCreatorView from './components/expression-creator-view';
import { ExerciseBuilder, createExerciseBuilder, addProposition } from '../prover/exercise-creator';

export default function App() {
  const [exerciseBuilder, setExerciseBuilder] = useState<ExerciseBuilder>(createExerciseBuilder());

  const insertProposition = (newProposition: string) => { 
    setExerciseBuilder( addProposition (exerciseBuilder) (newProposition) );
  };

  const insertPremise = (new)

  return (
    <View>
      <PropositionCreatorView exerciseBuilder={exerciseBuilder} onAddProposition={insertProposition} />
      <PremisesCreatorView exerciseBuilder={exerciseBuilder} />
    </View>
  );
}
