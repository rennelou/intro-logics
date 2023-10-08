import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';

import { Proposition, proposition } from '../../prover/propositional';

function propositionPrint(p: Proposition): string {
  return p.value;  
}


interface ExerciseCreatorViewProps {
  propositions: Proposition[];
  onAddProposition: (newProposition: Proposition) => void;
}

export default function PropositionCreatorView({propositions, onAddProposition}: ExerciseCreatorViewProps) {
  
  const [isAddingProposition, setIsAddingProposition] = useState(false);
  const [propositionText, setPropositionText] = useState('');

  const startAddingProposition = () => {
    setIsAddingProposition(true);
  };

  const confirmProposition = () => {
    if (propositionText.trim() !== '') {
      onAddProposition(proposition(propositionText));
      setPropositionText('');
      setIsAddingProposition(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stack}>
      
        <Text style={styles.title}>Insert your proposition</Text>

        {isAddingProposition ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={propositionText}
              onChangeText={(text) => setPropositionText(text)}
              placeholder="Enter your proposition"
            />
            <TouchableOpacity style={styles.confirmButton} onPress={confirmProposition}>
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <FlatList
          data={propositions}
          renderItem={({ item }) => (
            <View style={styles.propositionContainer}>
              <Text>{propositionPrint(item)}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity style={styles.addButton} onPress={startAddingProposition}>
          <Text>  +  </Text>
        </TouchableOpacity>
      </View>
                 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: {
    marginTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, // Espaçamento entre o título e o botão
  },
  addButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  propositionContainer: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  }  
});
