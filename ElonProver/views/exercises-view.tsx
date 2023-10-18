import React, { useState } from 'react';

import {
  Text,
  StyleSheet,
  View,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styles } from './styles';

import { getExercises } from '../storage';
import { Prover } from '../prover/prover';
import { proverPrint, RootStackParamList } from './utils'

type exerciseViewProps = NativeStackScreenProps<RootStackParamList, 'Exercises'>;

export default function ExercisesView({ route, navigation }: exerciseViewProps) {
  const [exerciseList, setExerciseList] = useState<Prover[]>([]); 

  // talvez eu tenha que usar effects
  //await getExercises();
  
  return (
    <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
     
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>Exercises</Text>
        </View>

        <FlatList
          data={exerciseList}
          renderItem={({ item }) => (
            <View>
              <Text>{proverPrint(item)}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.push('ExerciseCreator')} >
        
        <Text>  +  </Text>
      </TouchableOpacity>
    
    </View>
  );
}
