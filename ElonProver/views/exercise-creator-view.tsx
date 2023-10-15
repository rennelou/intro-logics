import React, { useState } from 'react';

import {
  Text,
  StyleSheet,
  View,
  Button,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';

import { propositionPrint, expressionPrint } from './utils'; 
import ExpressionCreatorView from './components/expression-creator-view';
import { Expression, contextToList } from '../prover/propositional';
import { Prover } from '../prover/prover';
import { ExerciseBuilder, createExerciseBuilder, createProver, addProposition, addPremise } from '../prover/exercise-creator';

interface ExerciseCreatorProps {
  returnExercise: (p: Prover) => void 
}

export default function ExerciseCreatorView({returnExercise}: ExerciseCreatorProps) {
  const [exerciseBuilder, setExerciseBuilder] = useState<ExerciseBuilder>(createExerciseBuilder());
  const [createExercisseModal, setCreateExerciseModal] = useState(false);

  const insertProposition = (newProposition: string) => { 
    setExerciseBuilder((prevExerciseBuilder) => { return addProposition (prevExerciseBuilder) (newProposition); } );
  };

  const insertPremise = (newPremise: Expression) => {
    setExerciseBuilder( (prevExerciseBuilder) => { return addPremise (prevExerciseBuilder) (newPremise); } );
  };

  const createExercise = (e: Expression) => {
    const exercise = createProver(exerciseBuilder, e);

    console.log(exercise);
  };

  return (
    <View>
      <PropositionCreatorView exerciseBuilder={exerciseBuilder} onAddProposition={insertProposition} />
      <PremisesCreatorView exerciseBuilder={exerciseBuilder} onAddPremise={insertPremise} />
      
      <ExpressionCreatorView 
        modalVisible={createExercisseModal}
        propositions={exerciseBuilder.propositions}
        premises={contextToList(exerciseBuilder.premises)}
        returnExpression={createExercise}
        close={() => setCreateExerciseModal(false)}
      />

      <Button title="Create Exercise" onPress={() => setCreateExerciseModal(true)} />
    </View>
  );
}

interface PropositionCreatorProps {
  exerciseBuilder: ExerciseBuilder;
  onAddProposition: (newProposition: string) => void;
}

function PropositionCreatorView({exerciseBuilder, onAddProposition}: PropositionCreatorProps) {
  
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

interface PremiseCreatorProps {
  exerciseBuilder: ExerciseBuilder;
  onAddPremise: (newPremise: Expression) => void;
}

function PremisesCreatorView({exerciseBuilder, onAddPremise}: PremiseCreatorProps) { 
  const [modalVisible, setModalVisible] = useState(false);
 
  const addItem = (e: Expression) => {
    onAddPremise(e);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
     
      <View style={styles.header}>
        <Text style={styles.title}>Premises</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text>  +  </Text>
        </TouchableOpacity>
      </View>
     
      <FlatList
        data={contextToList(exerciseBuilder.premises)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{expressionPrint(item)}</Text>
          </View>
        )}
      />
      
      <ExpressionCreatorView 
        modalVisible={modalVisible}
        propositions={exerciseBuilder.propositions}
        premises={contextToList(exerciseBuilder.premises)}
        returnExpression={addItem}
        close={() => setModalVisible(false)}
      />

    </View>
  );
};


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


