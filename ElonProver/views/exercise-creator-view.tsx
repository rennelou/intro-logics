import React, { useState } from 'react';

import {
  Text,
  View,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styles } from './styles';
import { RootStackParamList } from './utils'

import { storeExercise } from '../storage';
import { propositionPrint, expressionPrint } from './utils'; 
import ExpressionCreatorView from './components/expression-creator-view';
import { Expression, contextToList } from '../prover/propositional';
import { ExerciseBuilder, createExerciseBuilder, createProver, addProposition, addPremise } from '../prover/exercise-creator';

type exerciseCreatorViewProps = NativeStackScreenProps<RootStackParamList, 'ExerciseCreator'>;

export default function ExerciseCreatorView({ route, navigation }: exerciseCreatorViewProps) {
  const [exerciseBuilder, setExerciseBuilder] = useState<ExerciseBuilder>(createExerciseBuilder());

  const insertProposition = (newProposition: string) => { 
    setExerciseBuilder((prevExerciseBuilder) => { return addProposition (prevExerciseBuilder) (newProposition); } );
  };

  const insertPremise = (newPremise: Expression) => {
    setExerciseBuilder( (prevExerciseBuilder) => { return addPremise (prevExerciseBuilder) (newPremise); } );
  };

  const createExercise = (e: Expression) => {
    const exercise = createProver(exerciseBuilder, e);

    storeExercise(exercise).then(() => navigation.goBack() );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }} >
      <View style={styles.container}>
        <PropositionCreatorView exerciseBuilder={exerciseBuilder} onAddProposition={insertProposition} />
        <PremisesCreatorView exerciseBuilder={exerciseBuilder} onAddPremise={insertPremise} />
      </View>
      <CreateExerciseButton exerciseBuilder={exerciseBuilder} onReturnGoal={createExercise} />
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
    <View style={{ margin:5, justifyContent: 'center' }} >

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
                         
    </View>
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
    <View style={{ margin: 5, justifyContent: 'center' }} >
     
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

interface CreateExerciseButtonProps {
  exerciseBuilder: ExerciseBuilder;
  onReturnGoal: (newPremise: Expression) => void;
}

function CreateExerciseButton({exerciseBuilder, onReturnGoal}: CreateExerciseButtonProps) { 
  const [modalVisible, setModalVisible] = useState(false);
 
  const addItem = (e: Expression) => {
    onReturnGoal(e);
    setModalVisible(false);
  };

  return (
    <View>
     
      <ExpressionCreatorView 
        modalVisible={modalVisible}
        propositions={exerciseBuilder.propositions}
        premises={contextToList(exerciseBuilder.premises)}
        returnExpression={addItem}
        close={() => setModalVisible(false)}
      />

      <Button title="Create Exercise" onPress={() => setModalVisible(true)} />

    </View>
  );
};

