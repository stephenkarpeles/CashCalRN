import { View, Text } from 'react-native';
import { Button } from 'tamagui';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <Button>Login</Button>
    </View>
  );
}
