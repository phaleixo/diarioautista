import { View } from 'react-native';
import EmotionTracker from '../components/EmotionTracker';


const DiarioScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <EmotionTracker />
    </View>
  );
};

export default DiarioScreen;