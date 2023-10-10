import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';

import { ExerciseBuilder } from '../../prover/exercise-creator';
import { propositionPrint } from '../utils'; 

interface PropositionCreatorProps {
  exerciseBuilder: ExerciseBuilder;
  onAddProposition: (newProposition: string) => void;
}

export default function PropositionCreatorView({exerciseBuilder, onAddProposition}: PropositionCreatorProps) {
  
  const [isAddingProposition, setIsAddingProposition] = useState(false);
  const [propositionText, setPropositionText] = useState('');

  const startAddingProposition = () => {
    setIsAddingProposition(true);
  };

  const cancelAddingProposition = () => {
    setIsAddingProposition(false);
  };


  const confirmProposition = () => {
    if (propositionText.trim() !== '') {
      onAddProposition(propositionText);
      setPropositionText('');
      setIsAddingProposition(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}> 
        <Text style={styles.title}>Propositions</Text>
        <TouchableOpacity style={styles.addButton} onPress={startAddingProposition}>
          <Text>  +  </Text>
        </TouchableOpacity>
      </View>

     <Modal visible={isAddingProposition} animationType='slide'>
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
         <TouchableOpacity style={styles.cancelButton} onPress={cancelAddingProposition}>
           <Text>Cancel</Text>
         </TouchableOpacity>
       </View>
     </Modal>

     <FlatList
       data={exerciseBuilder.propositions}
       renderItem={({ item }) => (
         <View>
           <Text>{propositionPrint(item)}</Text>
         </View>
       )}
       keyExtractor={(item, index) => index.toString()}
     />
                         
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
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
  cancelButton: {
    backgroundColor: 'red',
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
