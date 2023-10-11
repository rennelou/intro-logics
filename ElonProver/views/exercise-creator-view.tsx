import React, { useState } from 'react';
import { View } from 'react-native';

import PropositionCreatorView from './components/proposition-creator-view';
import PremisesCreatorView from './components/premise-creator-view';
import { Expression } from '../prover/propositional';
import { ExerciseBuilder, createExerciseBuilder, addProposition, addPremise } from '../prover/exercise-creator';

export default function App() {
  const [exerciseBuilder, setExerciseBuilder] = useState<ExerciseBuilder>(createExerciseBuilder());

  const insertProposition = (newProposition: string) => { 
    setExerciseBuilder((prevExerciseBuilder) => { return addProposition (prevExerciseBuilder) (newProposition); } );
  };

  const insertPremise = (newPremise: Expression) => {
    setExerciseBuilder( (prevExerciseBuilder) => { return addPremise (prevExerciseBuilder) (newPremise); } );
  };

  return (
    <View>
      <PropositionCreatorView exerciseBuilder={exerciseBuilder} onAddProposition={insertProposition} />
      <PremisesCreatorView exerciseBuilder={exerciseBuilder} onAddPremise={insertPremise} />
    </View>
  );
}
