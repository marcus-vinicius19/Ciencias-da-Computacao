import { Text, View, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import styles from "../styles";
import QuestionnaireScreen from "./QuestionnaireScreen";
import { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { GlobalContext } from "../components/GlobalContext";

const SettingsStack = createNativeStackNavigator();

const SettingsOptionsScreen = ({ navigation }) => {
  const { aiVoice, setAIVoice, currentUser, setCurrentUser, getNType, updtTutorialFeito, getTutorialFeito } = useContext(GlobalContext);

  const [learnType, setLearnType] = useState("");

  // Debug state
  const [tutorialDone, setTutorialDone] = useState("")

  const toggleSwitch = () => setAIVoice((previousState) => !previousState);

  const redoQuestions = () => {
    navigation.navigate("Questions");
  };

  const logout = () => {
    setCurrentUser()
    navigation.replace("User")
  }

  useFocusEffect(
    useCallback(() => {
      const fetchLearnType = async () => {
        try {
          const type = await getNType();
          setLearnType(type);
        } catch (error) {
          setLearnType("Desconhecido");
          console.error("Error fetching learning type: ", error);
        }

        try {
          const tf = await getTutorialFeito()
          setTutorialDone(tf)
        } catch (error) {
          setTutorialDone("Desconhecido");
          console.error("Error fetching learning type: ", error);
        }
      };

      fetchLearnType();
  }, []));


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#0088ffff" }}>Voz da IA</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={aiVoice ? "#0088ffff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={aiVoice}
        />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#0088ffff"}}>{"Estilo Aprendizado: " + learnType} </Text>
        <TouchableOpacity style={styles.pickerButtom} onPress={redoQuestions}>
          <Text style={styles.pickerButtomText}>Refazer Questionario</Text>
        </TouchableOpacity>        
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#0088ffff" }}>Tutorial</Text>
        <TouchableOpacity style={styles.pickerButtom} onPress={() => {navigation.navigate("Tutorial")}}>
          <Text style={styles.pickerButtomText}>Rever Tutorial</Text>
        </TouchableOpacity>        
      </View>      

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#0088ffff"}}>Conta atual: {currentUser?.record.nome} </Text>
        <TouchableOpacity style={[styles.pickerButtom, { backgroundColor: "#ff0000ff" }]} onPress={logout}>
          <Text style={[styles.pickerButtomText]}>Sair</Text>
        </TouchableOpacity>
      </View>
        {/* Debug view code */}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#0088ffff"}}>{"tutorial feito: " + tutorialDone }</Text>
        <TouchableOpacity style={[styles.pickerButtom, { backgroundColor: "#ff0000ff" }]} onPress={async () => { 
          await updtTutorialFeito(false) 
          console.log(getTutorialFeito())
         }}>
          <Text style={[styles.pickerButtomText]}>make Tutorial false</Text>
        </TouchableOpacity>
      </View>       */}
    </SafeAreaView>
  );
};

const SettingsScreen = () => {
  return (
    <SettingsStack.Navigator
      initialRouteName="Options"
      screenOptions={{ headerShown: false }}
    >
      <SettingsStack.Screen name="Options" component={SettingsOptionsScreen} />
      <SettingsStack.Screen name="Questions" component={QuestionnaireScreen} />
    </SettingsStack.Navigator>
  );
};

export default SettingsScreen;
