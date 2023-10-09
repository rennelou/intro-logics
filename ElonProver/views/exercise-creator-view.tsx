import React, { useState } from 'react';
import { View } from 'react-native';
import PropositionCreatorView from './components/proposition-creator-view';

import { Proposition, Expression } from '../prover/propositional';
import { ExerciseBuilder } from '../prover/exercise-creator';

export default function App() {
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [expressions, setExpressions] = useState<Expression[]>([]);

  const addProposition = (newProposition: Proposition) => {
    setPropositions([...propositions, newProposition]);
  };

  const addExpressions = (newExpression: Expression) => {
    setExpressions([...expressions, newExpression]);
  };

  return (
    <View>
      <PropositionCreatorView propositions={propositions} onAddProposition={addProposition} />
    </View>
  );
}
