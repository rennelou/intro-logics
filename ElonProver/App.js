import { React } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={'./assets/icon.png'} />
      
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
  image: {
    width: 200,
    height: 200
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
