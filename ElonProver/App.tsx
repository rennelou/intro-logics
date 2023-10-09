import React, { useEffect, useState } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar
} from 'react-native';

import ExerciseCreatorView from './views/exercise-creator-view';

export default function App() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    const getStatusBarHeight = () => {
      setStatusBarHeight(StatusBar.currentHeight || 0);
    };

    getStatusBarHeight();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{marginTop: statusBarHeight}}>
          <Text style={styles.title}>Título da Tela</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <ExerciseCreatorView/ >
      </View>

      <View style={styles.menuBar}>
        <TouchableOpacity style={styles.menuItem}>
          <Text>Item 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text>Item 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text>Item 3</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    height: 60,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

