import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DiarioScreen from './src/screens/DiarioScreen';
import AudioNoteScreen from './src/screens/AudioNoteScreen';
import TarefasScreen from './src/screens/TarefasScreen';
import InfoScreen from './src/screens/InfoScreen';
import { useColorScheme } from 'react-native';

const Tab = createBottomTabNavigator();

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2424a4',
    background: '#ffffff',
    card: '#2424a4',
    text: '#000000',
    border: '#2424a4',
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#2424a4',
    background: '#000000',
    card: '#2424a4',
    text: '#ffffff',
    border: '#2424a4',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyLightTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string = '';

            if (route.name === 'Diário') {
              iconName = 'happy-outline';
            } else if (route.name === 'Áudio') {
              iconName = 'mic-outline';
            } else if (route.name === 'Tarefas') {
              iconName = 'checkmark-outline';
            } else if (route.name === 'Sobre') {
              iconName = 'information-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color="white" />; // Definir a cor dos ícones como branca
          },
          tabBarActiveTintColor: 'white', // Ícones ativos brancos
          tabBarInactiveTintColor: 'white', // Ícones inativos brancos
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            backgroundColor: '#2424a4', // Cor de fundo azul
          },
        })}
      >
        <Tab.Screen 
          name="Tarefas" 
          component={TarefasScreen} 
          options={{ 
            headerTitle: 'Diário Autista',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#2424a4',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 24,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            },
          }} 
        />
        <Tab.Screen 
          name="Áudio" 
          component={AudioNoteScreen} 
          options={{ 
            headerTitle: 'Diário Autista',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#2424a4',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 24,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            },
          }} 
        />
        <Tab.Screen 
          name="Diário" 
          component={DiarioScreen} 
          options={{ 
            headerTitle: 'Diário Autista',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#2424a4',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 24,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            },
          }} 
        />
        <Tab.Screen 
          name="Sobre" 
          component={InfoScreen} 
          options={{ 
            headerTitle: 'Diário Autista',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#2424a4',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 24,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
            },
          }} 
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
