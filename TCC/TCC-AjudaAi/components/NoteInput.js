import { useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles";
import { GlobalContext } from "./GlobalContext";

function NoteInput({ navigation }) {
  const { AddNote, setAnotacoes, } = useContext(GlobalContext);

  const [noteName, setNoteName] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const scheme = useColorScheme();

  async function  AddNoteHandler() {
    //AddNote(noteName, noteContent);
    await setAnotacoes(noteName, noteContent)
    setNoteName("");
    setNoteContent("");
    navigation.goBack();
  }

  return (
    <SafeAreaView style={[styles.inputModalContainer, {paddingHorizontal: 10}]}>
      <Text
        style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
      >
        Titulo
      </Text>
      <TextInput
        style={[styles.textInput, { borderRadius: 12, width: "100%" }]}
        placeholderTextColor={"#0088ffff"}
        onChangeText={setNoteName}
        value={noteName}
      />
      <Text
        style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
      >
        Conteudo
      </Text>
      <TextInput
        style={[styles.textInput, { borderRadius: 12, width: "100%" }]}
        multiline
        numberOfLines={30}
        placeholderTextColor={"#0088ffff"}
        onChangeText={setNoteContent}
        value={noteContent}
      />
      <View style={styles.buttomContainer}>
        <TouchableOpacity
          style={[styles.pickerButtom, { backgroundColor: "#ff0000ff" }]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.pickerButtomText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickerButtom} onPress={AddNoteHandler}>
          <Text style={styles.pickerButtomText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default NoteInput;
