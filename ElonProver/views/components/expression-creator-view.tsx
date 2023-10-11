import React, { useState } from 'react';
import { Modal, View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Expression } from '../../prover/propositional';
import { expressionPrint } from '../utils';

interface ExpressionCreatorProps {
  modalVisible: boolean,
  expressions: Expression[],
  setExpression: (e: Expression) => void,
  returnExpression: (e: Expression) => void,
  close: () => void
}

export default function ExpressionCreatorView({modalVisible, expressions, setExpression, returnExpression, close}: ExpressionCreatorProps) {
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

  const handleButton1 = (selectedItems: Expression[]) => {
    console.log('Botão 1 pressionado com os itens selecionados:', selectedItems);
  };

  const handleButton2 = (selectedItem: Expression[]) => {
    console.log('Botão 2 pressionado com o item selecionado:', selectedItem);
  };

  const handleButton3 = (selectedItems: Expression[]) => {
    console.log('Botão 3 pressionado com os itens selecionados:', selectedItems);
  };

  const handleCancel = () => {
    setSelected((_) => { return []; });
    close();
  }

  return (
    <Modal visible={modalVisible} animationType="slide">
       <View>
         <FlatList
           data={expressions}
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
         <Button title="Botão 1" onPress={() => handleButton1(selectedItems)} />
         <Button
           title="Botão 2"
           onPress={() => {
             if (selectedItems.length === 1) {
               handleButton2(selectedItems[0]);
             } else {
               console.log('Selecione exatamente um item para o Botão 2.');
             }
           }}
         />
         <Button title="Botão 3" onPress={() => handleButton3(selectedItems)} />

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
