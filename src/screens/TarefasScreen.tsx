import React from 'react';
import { View } from 'react-native';
import TaskList from '../components/TaskList';

const TarefasScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <TaskList />
    </View>
  );
};

export default TarefasScreen;