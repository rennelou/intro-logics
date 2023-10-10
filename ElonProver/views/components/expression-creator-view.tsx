import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet } from 'react-native';
import { Expression, and, proposition, contextToList } from '../../prover/propositional';
import { ExerciseBuilder } from '../../prover/exercise-creator';
import { expressionPrint } from '../utils';

interface ExerciseBuilderProps {
  exerciseBuilder: ExerciseBuilder;
  onAddPremise: (newPremise: Expression) => void;
}


export default function PremisesCreatorView({exerciseBuilder, onAddPremise}: ExerciseBuilderProps) {
  const expressionMock = and(proposition("q"), proposition("p"));

  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');

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
       
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome do novo item"
            value={newItemName}
            onChangeText={(text) => setNewItemName(text)}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={addItem}>
            <Text>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
