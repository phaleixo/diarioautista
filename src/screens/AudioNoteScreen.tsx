import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, useColorScheme, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AudioEntry {
  id: number;
  uri: string;
  date: string;
  time: string;
}

const AudioNoteScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioEntries, setAudioEntries] = useState<AudioEntry[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<{ [key: number]: { duration: number, position: number } }>({});
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadAudioEntries();
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        alert('Permissão para acessar o microfone é necessária.');
      }
    } catch (err) {
      console.error('Falha ao iniciar gravação', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        const now = new Date();
        const newEntry: AudioEntry = {
          id: Date.now(),
          uri,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const updatedEntries = [newEntry, ...audioEntries];
        setAudioEntries(updatedEntries);
        await AsyncStorage.setItem('audioNotes', JSON.stringify(updatedEntries));
      }
      setRecording(null); // Move this to the end to avoid resetting state prematurely
    }
  };

  const loadAudioEntries = async () => {
    const data = await AsyncStorage.getItem('audioNotes');
    if (data) {
      setAudioEntries(JSON.parse(data));
    }
  };

  const deleteAudioEntry = async (id: number) => {
    const updatedEntries = audioEntries.filter(entry => entry.id !== id);
    setAudioEntries(updatedEntries);
    await AsyncStorage.setItem('audioNotes', JSON.stringify(updatedEntries));
  };

  const playPauseAudio = async (id: number, uri: string) => {
    if (playingId === id) {
      // Pause the currently playing audio
      if (sound) {
        await sound.pauseAsync();
      }
      setPlayingId(null);
    } else {
      // Play the selected audio
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setPlayingId(id);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackStatus((prevStatus) => ({
            ...prevStatus,
            [id]: {
              duration: status.durationMillis || 0,
              position: status.positionMillis || 0,
            },
          }));
        }
      });
      await newSound.playAsync();
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.length === 1 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gravações de Áudio</Text>
      <Text style={styles.subtitle}>Histórico</Text>
      <FlatList
        data={audioEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.audioEntryContainer}>
            <Text style={styles.dateText}>{item.date} {item.time}</Text>
            <View style={styles.audioControls}>
              <TouchableOpacity
                onPress={() => playPauseAudio(item.id, item.uri)}
                style={styles.controlButton}
              >
                <View style={styles.iconBackground}>
                  <Icon
                    name={playingId === item.id ? 'pause' : 'play'}
                    size={22}
                    color={colorScheme === 'dark' ? 'white' : 'black'}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteAudioEntry(item.id)}
                style={styles.controlButton}
              >
                <View style={styles.iconBackground}>
                  <Icon name="trash" size={22} color="red" />
                </View>
              </TouchableOpacity>
            </View>
            {playbackStatus[item.id] && (
              <Text style={styles.playbackText}>
                {formatTime(playbackStatus[item.id].position)} / {formatTime(playbackStatus[item.id].duration)}
              </Text>
            )}
          </View>
        )}
      />
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={[styles.recordButton, styles.commonButton, { backgroundColor: recording ? '#FF0000' : '#4CAF50' }]}
      >
        <Text style={styles.recordButtonText}>
          {recording ? 'Parar Gravação' : 'Iniciar Gravação'}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
  audioEntryContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    margin: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '100%',
  },
  controlButton: {
    padding: 10,
  },
  iconBackground: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  playbackText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  recordButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    margin: 5,
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
  },
  commonButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AudioNoteScreen;