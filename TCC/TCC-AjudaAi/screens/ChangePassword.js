import { Text, TextInput, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePassword = () => {
  return (
    <SafeAreaView>
      <Text>Senha Antiga</Text>
      <TextInput style={styles.loginTextInput} placeholder="senha antiga" />
      <Text>Nova Senha</Text>
      <TextInput style={styles.loginTextInput} placeholder="nova senha" />
      <Button title="Mudar Senha"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginTextInput: {
    borderWidth: 2,
    borderColor: "#0088ffff",
    borderRadius: 16,
    width: "100%",
    padding: 16,
  },
});

export default ChangePassword