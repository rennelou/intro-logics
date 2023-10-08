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

export default function ExerciseCreatorView() {
  
  const [propositions, setPropositions] = useState([]);
  const [isAddingProposition, setIsAddingProposition] = useState(false);
  const [propositionText, setPropositionText] = useState('');

  const startAddingProposition = () => {
    setIsAddingProposition(true);
  };

  const confirmProposition = () => {
    if (propositionText.trim() !== '') {
      setPropositions([...propositions, propositionText]);
      setPropositionText('');
      setIsAddingProposition(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
          
      <Text style={styles.title}>Insert your propositions</Text>  
     
      <FlatList
        data={propositions}
        renderItem={({ item }) => (
          <View style={styles.propositionContainer}>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      
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
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={startAddingProposition}>
          <Text>Add a new proposition</Text>
        </TouchableOpacity>
      )}
      
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
  title: {
    marginTop: 50
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 50,
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
    backgroundColor: 'green',
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
