import React from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity
} from 'react-native';

import ExerciseCreatorView from './views/exercise-creator-view';

export default function App() {
  
  return (
    <SafeAreaView style={styles.container}>
         
          <ExerciseCreatorView />

           <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text>Button 1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text>Button 1</Text>
          </TouchableOpacity>
        
          <TouchableOpacity style={styles.button}>
            <Text>Button 1</Text>
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
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5
  } 
});
