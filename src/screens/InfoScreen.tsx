import React from 'react';
import { Image, Text, StyleSheet, ScrollView, Linking, useColorScheme } from 'react-native';

const InfoScreen: React.FC = () => {
  const theme = useColorScheme() || 'light'; // Define 'light' como padrão se theme for null
  const styles = dynamicStyles(theme); // Aplica estilos dinâmicos

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre o Aplicativo</Text>
      <Text style={styles.content}>
        Este aplicativo foi desenvolvido por um autista para ajudar outras pessoas autistas a organizarem suas tarefas diárias.
        {'\n'}
        Com este app, é possível registrar suas emoções, tarefas a serem realizadas e também notas de áudio.
      </Text>
      
      <Text style={styles.title}>Privacidade</Text>
      <Text style={styles.content}>
        Sua privacidade é muito importante.
        {'\n'}
        Por isso todos os dados são salvos apenas no aparelho, e você tem total controle sobre eles.
        {'\n'}
        Caso queira, é possível deletar todos os dados armazenados.
      </Text>
      <Image
        source={require('../assets/icon.png')} 
        style={styles.localImage}
      />
      <Text style={styles.footer}>
        Diario autista v1.1.0 licenciado sob a MIT License.
        {'\n'}
        Desenvolvido por Phaleixo.
        {'\n'}
        GitHub: <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/phaleixo')}>https://github.com/phaleixo</Text>
        {'\n'}
        Email: <Text style={styles.link} onPress={() => Linking.openURL('mailto:phaleixo@outlook.com.br')}>phaleixo@outlook.com.br</Text>
        {'\n'}
      </Text>
    </ScrollView>
  );
};

// Função para gerar estilos dinâmicos
const dynamicStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme === 'dark' ? '#FFFFFF' : '#000000', // Cor do título dinâmica
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 50,
    color: theme === 'dark' ? '#CCCCCC' : '#333333', // Cor do conteúdo dinâmica
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    color: theme === 'dark' ? '#CCCCCC' : '#333333', // Cor do rodapé dinâmica
  },
  link: {
    color: theme === 'dark' ? '#80D8FF' : '#007BFF', // Cor do link dinâmica
  },
  localImage: {
    width: 96,
    height: 96,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default InfoScreen;