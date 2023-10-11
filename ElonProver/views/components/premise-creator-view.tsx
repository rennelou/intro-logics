import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet } from 'react-native';
import { Expression, and, proposition, contextToList } from '../../prover/propositional';
import { ExerciseBuilder, exerciseBuilderToList } from '../../prover/exercise-creator';
import ExpressionCreatorView from './expression-creator-view';
import { expressionPrint } from '../utils';

interface PremiseCreatorProps {
  exerciseBuilder: ExerciseBuilder;
  onAddPremise: (newPremise: Expression) => void;
}

export default function PremisesCreatorView({exerciseBuilder, onAddPremise}: PremiseCreatorProps) {
  const expressionMock = and(proposition("q"), proposition("p"));
  const [newItemName, setNewItemName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [expressions, setExpressions] = useState<Expression[]>(exerciseBuilderToList(exerciseBuilder));

  const addAuxExpression = (e: Expression) => {
    setExpressions([...expressions, e]);
  };

  const addItem = () => {
    if (newItemName) {
      onAddPremise(expressionMock);
      setModalVisible(false);
      setNewItemName('');
    }
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
        expressions={expressions}
        setExpression={addAuxExpression}
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
    alignItems: 'center',
    justifyContent: 'center',
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
