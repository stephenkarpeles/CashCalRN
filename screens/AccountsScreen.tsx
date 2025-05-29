import { View, Text } from 'react-native';
import { Button } from 'tamagui';

export default function AccountsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Accounts Screen</Text>
      <Button>Add Account</Button>
    </View>
  );
}
