import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const animation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!taskText) return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTaskText('');
    setModalVisible(false);
  };

  const deleteTask = async (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const toggleTaskCompletion = async (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toLocaleString() : undefined }
        : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Animação ao concluir a tarefa
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      setTasks(JSON.parse(data));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View style={{ transform: [{ scale: animation }] }}>
            <View style={styles.taskContainer}>
              <TouchableOpacity
                onPress={() => toggleTaskCompletion(item.id)}
                style={[styles.task, item.completed && styles.completedTask]}
              >
                <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
                  {item.text}
                </Text>
                <Text style={styles.taskDate}>Adicionado em: {item.createdAt}</Text>
                {item.completedAt && (
                  <Text style={styles.taskDate}>Concluído em: {item.completedAt}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.addButton, styles.commonButton]}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Adicionar nova tarefa"
                value={taskText}
                onChangeText={setTaskText}
                style={styles.input}
              />
              <TouchableOpacity onPress={addTask} style={styles.modalAddButton}>
                <Text style={styles.modalAddButtonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelButton}>
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // Remover a cor de fundo
    // backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    margin: 5,
  },
  task: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  completedTask: {
    backgroundColor: '#d3d3d3',
  },
  taskText: {
    fontSize: 18,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDate: {
    fontSize: 12,
    color: 'gray',
  },
  deleteButton: {
    marginLeft: 20,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.50,
    shadowRadius: 6,
    elevation: 5,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
  },
  modalAddButton: {
    backgroundColor: '#4CAF50',
    padding: 15, 
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  commonButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default TaskList;