import React, { useState } from 'react';
import { View, Button } from 'react-native';
import PropositionCreatorView from './components/proposition-creator-view';

import { Proposition } from '../prover/propositional';

export default function App() {
  const [propositions, setPropositions] = useState<Proposition[]>([]);

  const addProposition = (newProposition: Proposition) => {
    setPropositions([...propositions, newProposition]);
  };

  return (
    <View>
      <PropositionCreatorView propositions={propositions} onAddProposition={addProposition} />
    </View>
  );
}
