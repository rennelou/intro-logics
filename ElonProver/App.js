import { React } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
          
      <Text>Insert your propositions</Text>  
      

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
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
