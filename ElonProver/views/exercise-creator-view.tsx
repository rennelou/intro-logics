import React, { useState } from 'react';
import { View, Button } from 'react-native';

import PropositionCreatorView from './components/proposition-creator-view';
import PremisesCreatorView from './components/premise-creator-view';
import { Expression } from '../prover/propositional';
import { ExerciseBuilder, createExerciseBuilder, addProposition, addPremise } from '../prover/exercise-creator';
import ExpressionCreatorView from './components/expression-creator-view';

export default function App() {
  const [modalVisible, setVisible] = useState<boolean>(false);

  const [exerciseBuilder, setExerciseBuilder] = useState<ExerciseBuilder>(createExerciseBuilder());

  const insertProposition = (newProposition: string) => { 
    setExerciseBuilder( addProposition (exerciseBuilder) (newProposition) );
  };

  const insertPremise = (newPremise: Expression) => {
    setExerciseBuilder( addPremise (exerciseBuilder) (newPremise));
  };

  return (
    <View>
      <PropositionCreatorView exerciseBuilder={exerciseBuilder} onAddProposition={insertProposition} />
      <PremisesCreatorView exerciseBuilder={exerciseBuilder} onAddPremise={insertPremise} />
      <ExpressionCreatorView modalVisible={modalVisible} close={() => setVisible(false)} />
      <Button title="toogle" onPress={() => { setVisible(!modalVisible); } } />
    </View>
  );
}
