import React, { useState } from 'react';
import { Modal, View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

interface ListItem {
  id: number;
  text: string;
  selected: boolean;
}

interface ExpressionCreatorProps {
  modalVisible: boolean,
  close: () => void
}

export default function ExpressionCreatorView({modalVisible, close}: ExpressionCreatorProps) {
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, text: 'Item 1', selected: false },
    { id: 2, text: 'Item 2', selected: false },
    { id: 3, text: 'Item 3', selected: false },
  ]);

  const handleToggleSelection = (item: ListItem) => {
    const updatedItems = [...items];
    const index = updatedItems.findIndex((i) => i.id === item.id);
    updatedItems[index].selected = !item.selected;
    setItems(updatedItems);
  };

  const handleButton1 = (selectedItems: ListItem[]) => {
    console.log('Botão 1 pressionado com os itens selecionados:', selectedItems);
  };

  const handleButton2 = (selectedItem: ListItem) => {
    console.log('Botão 2 pressionado com o item selecionado:', selectedItem);
  };

  const handleButton3 = (selectedItems: ListItem[]) => {
    console.log('Botão 3 pressionado com os itens selecionados:', selectedItems);
  };

  const selectedItems = items.filter((item) => item.selected);

  return (
    <Modal visible={modalVisible} animationType="slide">
       <View>
         <FlatList
           data={items}
           keyExtractor={(item) => item.id.toString()}
           renderItem={({ item }) => (
             <TouchableOpacity
               style={[styles.item, { backgroundColor: item.selected ? 'lightblue' : 'white' }]}
               onPress={() => handleToggleSelection(item)}
             >
               <Text>{item.text}</Text>
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

         <Button title="Cancel" onPress={close}/>
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
