import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Entry {
  id: number;
  emotion: string;
  note: string;
  date: string;
  time: string;
}

const EMOTIONS = [
  { emoji: '😀', name: 'Feliz' },
  { emoji: '😊', name: 'Satisfeito' },
  { emoji: '😐', name: 'Neutro' },
  { emoji: '😔', name: 'Triste' },
  { emoji: '😢', name: 'Muito Triste' },
  { emoji: '😡', name: 'Raiva' }
];

const DiarioEmocoes: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const saveEntry = async () => {
    if (!selectedEmotion) {
      return;
    }

    const now = new Date();
    const newEntry: Entry = {
      id: Date.now(),
      emotion: selectedEmotion,
      note,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    await AsyncStorage.setItem('diario', JSON.stringify(updatedEntries));

    setSelectedEmotion(null);
    setNote('');
    setModalVisible(false);
  };

  const loadEntries = async () => {
    const data = await AsyncStorage.getItem('diario');
    if (data) {
      setEntries(JSON.parse(data));
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginVertical: 5, fontWeight: 'bold', textAlign: 'center' }}>Diario</Text>
      <Text style={{ fontSize: 18, marginVertical: 10, textAlign: 'center' }}>Histórico</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={{ fontSize: 24 }}>{item.emotion}</Text>
            <Text>{item.date} às {item.time}</Text>
            {item.note && <Text>{item.note}</Text>}
          </View>
        )}
        showsVerticalScrollIndicator={true}
        style={{ maxHeight: 480 }}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.button, styles.commonButton]}>
        <Text style={styles.buttonText}>Como você está se sentindo hoje?</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Como você está se sentindo hoje?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10 }}>
              {EMOTIONS.map((emotion) => (
                <TouchableOpacity
                  key={emotion.emoji}
                  onPress={() => setSelectedEmotion(emotion.emoji)}
                  style={{
                    margin: 5,
                    alignItems: 'center',
                    borderWidth: selectedEmotion === emotion.emoji ? 2 : 0,
                    borderColor: selectedEmotion === emotion.emoji ? '#4CAF50' : 'transparent',
                    borderRadius: 10,
                    padding: 10,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                  }}
                >
                  <Text style={{ fontSize: 30 }}>{emotion.emoji}</Text>
                  <Text>{emotion.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              placeholder="Adicione uma nota (opcional)"
              value={note}
              onChangeText={(text) => setNote(text)}
              style={{ borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 }}
            />
            <TouchableOpacity onPress={saveEntry} style={{ backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: '#4CAF50', textAlign: 'center' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  entryCard: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    margin: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  commonButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default DiarioEmocoes;