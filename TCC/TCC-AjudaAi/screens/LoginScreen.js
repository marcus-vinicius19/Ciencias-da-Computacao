import {
  Text,
  TextInput,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePassword from "./ChangePassword";
import CreateAccountScreen from "./CreateAccountScreen";
import { useState, useContext, useEffect } from "react";

import { GlobalContext } from "../components/GlobalContext";
import styles from "../styles";

const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Criar Conta" component={CreateAccountScreen} />
      <Stack.Screen name="Mudar Senha" component={ChangePassword} />
    </Stack.Navigator>
  );
};

const LoginScreen = ({ navigation }) => {
  const { login, currentUser, getTutorialFeito } = useContext(GlobalContext);

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    const checkTutorial = async () => {
      if (typeof currentUser !== 'undefined') {
        const tutorialFeito = await getTutorialFeito();
        if (tutorialFeito === false) {
          navigation.replace("FirstQuestions");
        } else {
          navigation.replace("Drawer");
        }
      }
    };
    checkTutorial();
  }, [currentUser]);

  const tryLogin = async () => {
    const user = await login(emailInput, passwordInput);
    console.log("User: ", user);

    if (typeof user !== "undefined") {
      if (user.record.tutorialFeito === false) {
        navigation.replace("FirstQuestions");
      }
      else {
        navigation.replace("Drawer");
      }
    } else {
      console.error("Login Failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
      <Text style={localStyles.appName}>AjudAI</Text>
      <Text style={localStyles.text1}>E-Mail</Text>
      <TextInput
        style={localStyles.loginTextInput}
        value={emailInput}
        autoCapitalize="none"
        autoComplete="email"
        onChangeText={setEmailInput}
        placeholder="email"
        placeholderTextColor="#0088ffff"
      />
      <Text style={localStyles.text1}>Senha</Text>
      <TextInput
        style={localStyles.loginTextInput}
        value={passwordInput}
        autoCapitalize="none"
        onChangeText={setPasswordInput}
        placeholder="senha"
        placeholderTextColor="#0088ffff"
        secureTextEntry={true}
      />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ margin: 10 }}
          onPress={() => {
            navigation.navigate("Criar Conta");
          }}
        >
          <Text style={localStyles.text2}>Criar Conta</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{ margin: 10 }}
          onPress={() => {
            navigation.navigate("Mudar Senha");
          }}
        >
          <Text style={localStyles.text2}>Esqueci Minha Senha</Text>
        </TouchableOpacity> */}
      </View>
      <TouchableOpacity style={styles.pickerButtom} onPress={tryLogin}>
        <Text style={[styles.pickerButtomText, { fontSize: 18 }]}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const LoginStartScreen = () => {
  return <LoginStack />;
};

const localStyles = StyleSheet.create({
  loginTextInput: {
    borderWidth: 2,
    borderColor: "#0088ffff",
    borderRadius: 16,
    color: "#0088ffff",
    width: "100%",
    padding: 14,
  },

  appName: {
    fontSize: 64,
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 16,
    color: "#0088ffff",
  },

  text1: {
    fontSize: 18,
    marginTop: 14,
    marginBottom: 5,
    marginLeft: 8,
    color: "#0088ffff",
  },

  text2: {
    fontSize: 18,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#0088ffff",
    color: "#0088ffff",
  },
});

export default LoginStartScreen;
