import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

const InfoScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre o Aplicativo</Text>
      <Text style={styles.content}>
        Este aplicativo foi desenvolvido por um autista para ajudar outras pessoas autistas a organizarem suas tarefas diárias.
        {'\n\n'}
        Com este app, é possível registrar suas emoções, tarefas a serem realizadas e também notas de áudio.
      </Text>
      
      <Text style={styles.title}>Privacidade</Text>
      <Text style={styles.content}>
        Todos os dados são salvos apenas no aparelho, e você tem total controle sobre eles.
        {'\n\n'}
        Caso queira, é possível deletar todos os dados armazenados.
      </Text>
      
      <Text style={styles.footer}>
        Desenvolvido por Paulo Henrique Aleixo de Campos
        {'\n\n'}
        GitHub: <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/phaleixo')}>https://github.com/phaleixo</Text>
        {'\n\n'}
        Email: <Text style={styles.link} onPress={() => Linking.openURL('mailto:phaleixo@outlook.com.br')}>phaleixo@outlook.com.br</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 120,
  },
  link: {
    color: '#007BFF',
  },
});

export default InfoScreen;