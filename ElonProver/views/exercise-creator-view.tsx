import React, { useState } from 'react';
import { View, Button } from 'react-native';
import PropositionCreatorView from './components/proposition-creator-view';

export default function App() {
  const [propositions, setPropositions] = useState<string[]>([]);

  const addProposition = (newProposition: string) => {
    setPropositions([...propositions, newProposition]);
  };

  return (
    <View>
      <PropositionCreatorView propositions={propositions} onAddProposition={addProposition} />
    </View>
  );
}
