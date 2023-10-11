import React, { useState } from 'react';
import { View, Button } from 'react-native';

import PropositionCreatorView from './components/proposition-creator-view';
import PremisesCreatorView from './components/premise-creator-view';
import { Expression } from '../prover/propositional';
import { Prover } from '../prover/prover';
import { ExerciseBuilder, createExerciseBuilder, createProver, addProposition, addPremise } from '../prover/exercise-creator';

interface ExerciseCreatorProps {
  returnExercise: (p: Prover) => void 
}

export default function ExerciseCreatorView({returnExercise}: ExerciseCreatorProps) {
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
      <Button title="Return Exercise" onPress={() => returnExercise(createProver(exerciseBuilder))} />
    </View>
  );
}
