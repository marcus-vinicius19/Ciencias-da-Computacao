import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { Picker } from "@react-native-picker/picker";

import { GlobalContext } from "../components/GlobalContext";
import TaskDatePicker from "../components/TaskDatePicker";
import styles from "../styles";

const CreateAccountScreen = ({navigation}) => {
  const { criarLogin } = useContext(GlobalContext);

  const [inputUser, setInputUser] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState("");
  const [nType, setNType] = useState("");
  const [inputBirthDate, setInputBirthDate] = useState(new Date());
  const [inputGender, setInputGender] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
      <Text style={localStyles.text1}>Nome do Usuario</Text>
      <TextInput
        style={localStyles.loginTextInput}
        value={inputUser}
        onChangeText={setInputUser}
        autoComplete="name"
        placeholder="Nome do usuario"
        placeholderTextColor="#0088ffff"
      />
      <Text style={localStyles.text1}>Data de Nascimento</Text>
      <TaskDatePicker
        placeholder="Insira a data de nascimento"
        onDateConfirm={setInputBirthDate}
        value={inputBirthDate}
      />
      <Text style={localStyles.text1}>Genero</Text>
      <View style={styles.priorityInput}>
        <Picker
          selectedValue={inputGender}
          onValueChange={setInputGender}
          style={{ color: "#0088ffff" }}
        >
          <Picker.Item label="Masculino" value="M" />
          <Picker.Item label="Feminino" value="F" />
          <Picker.Item label="Outro" value="O" />
        </Picker>
      </View>
      <Text style={localStyles.text1}>E-Mail</Text>
      <TextInput
        style={localStyles.loginTextInput}
        value={inputEmail}
        onChangeText={setInputEmail}
        inputMode="email"
        autoCapitalize="none"
        placeholder="Email"
        placeholderTextColor="#0088ffff"
      />
      <Text style={localStyles.text1}>Senha</Text>
      <TextInput
        style={localStyles.loginTextInput}
        value={inputPassword}
        onChangeText={setInputPassword}
        placeholder="Senha"
        placeholderTextColor="#0088ffff"
        secureTextEntry={true}
      />
      <Text style={localStyles.text1}>Confirmar Senha</Text>
      <TextInput
        style={[localStyles.loginTextInput, {marginBottom: 20}]}
        value={inputPasswordConfirm}
        onChangeText={setInputPasswordConfirm}
        placeholder="Confirmar senha"
        placeholderTextColor="#0088ffff"
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.pickerButtom}
        onPress={() => {
          if (inputPassword !== inputPasswordConfirm) {
            console.error("Passwords do not match!!");
            setInputPassword("");
            setInputPasswordConfirm("");
            return;
          }

          if (criarLogin(
            inputEmail,
            inputPassword,
            inputPasswordConfirm,
            inputUser,
            nType,
            inputBirthDate,
            inputGender
          )) {
            navigation.replace("User");
          }
        }}
      >
        <Text style={[styles.pickerButtomText, { fontSize: 18 }]}>Criar Conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  loginTextInput: {
    borderWidth: 2,
    borderColor: "#0088ffff",
    color: "#0088ffff",
    borderRadius: 16,
    width: "100%",
    padding: 16,
  },

  text1: {
    fontSize: 18,
    marginTop: 14,
    marginBottom: 5,
    marginLeft: 8,
    color: "#0088ffff",
  },
});

export default CreateAccountScreen;
