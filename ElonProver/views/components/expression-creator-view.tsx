import React, { useState } from 'react';
import { Modal, View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Expression, not, and, or, implies } from '../../prover/propositional';
import { expressionPrint } from '../utils';

interface ExpressionCreatorProps {
  modalVisible: boolean,
  propositions: Expression[],
  premises: Expression[],
  returnExpression: (e: Expression) => void,
  close: () => void
}

export default function ExpressionCreatorView({modalVisible, propositions, premises, returnExpression, close}: ExpressionCreatorProps) {
  const [expressions, setExpression] = useState<Expression[]>([]);
  const [selectedItems, setSelected] = useState([]);

  const handleToggleSelection = (item: Expression) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter((selectedItem) => selectedItem !== item);
      } else {
        return [...prevSelected, item];
      } 
    });
  };

  const handleNot = (selectedItems: Expression[]) => {
    if (selectedItems.length === 1) {
      addExpression(not(selectedItems[0]));
    } else {
      console.log('Por favor, selecione somente 1 item', selectedItems);
    }
  };

  const handleAnd = (selectedItems: Expression[]) => {
    if (selectedItems.length === 2) {
       addExpression(and(selectedItems[0], selectedItems[1]));
    } else if (selectedItems.length === 1) {
      addExpression(and(selectedItems[0], selectedItems[0]));
    } 
    else {
      console.log('Por favor, selecione 1 ou 2 items', selectedItems);
    }
  };

  const handleOr = (selectedItems: Expression[]) => {
    if (selectedItems.length === 2) {
       addExpression(or(selectedItems[0], selectedItems[1]));
    } else if (selectedItems.length === 1) {
      addExpression(or(selectedItems[0], selectedItems[0]));
    } else {
      console.log('Por favor, selecione 1 ou 2 items', selectedItems);
    }
  };

  const handleImplies = (selectedItems: Expression[]) => {
    if (selectedItems.length === 2) {
       addExpression(implies(selectedItems[0], selectedItems[1]));
    } else if (selectedItems.length === 1) {
      addExpression(implies(selectedItems[0], selectedItems[0]));
    } else {
      console.log('Por favor, selecione 1 ou 2 items', selectedItems);
    }  
  };

  const handleReturn = (selectedItems: Expression[]) => {
    if (selectedItems.length === 1) {
      returnExpression(selectedItems[0]);
      clearSelected();
    } else {
      console.log('Por favor, selecione somente 1 item', selectedItems);
    } 
  };
  
  const handleCancel = () => {
    clearSelected();
    close();
  };

  const addExpression = (e: Expression) => {
    setExpression([...expressions, e]);
    clearSelected();
  };

  const clearSelected = () => {
    setSelected((_) => { return []; });
  };

  const expressionList = [...new Set(propositions.concat(premises).concat(expressions))]; 

  return (
    <Modal visible={modalVisible} animationType="slide">
       <View>
         <FlatList
           data={expressionList}
           keyExtractor={(item, key) => key.toString()}
           renderItem={({ item }) => (
             <TouchableOpacity
               style={[styles.item, { backgroundColor: selectedItems.includes(item) ? 'lightblue' : 'white' }]}
               onPress={() => handleToggleSelection(item)}
             >
               <Text>{expressionPrint(item)}</Text>
             </TouchableOpacity>
           )}
         />
         
         <Button title="Not" onPress={() => handleNot(selectedItems)} />
         <Button title="And" onPress={() => handleAnd(selectedItems) }/>
         <Button title="Or" onPress={() => handleOr(selectedItems)} />
         <Button title="Implies" onPress={() => handleImplies(selectedItems)} />
         <Button title="Return" onPress={() => handleReturn(selectedItems)} />

         <Button title="Cancel" onPress={handleCancel}/>
       </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
});
