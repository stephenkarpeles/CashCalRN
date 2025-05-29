import { View, Text } from 'react-native';
import { Button } from 'tamagui';

export default function SignupScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Signup Screen</Text>
      <Button>Signup</Button>
    </View>
  );
}
