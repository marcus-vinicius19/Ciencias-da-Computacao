import { useState, useContext, useEffect } from "react";
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

function NoteEdit({ navigation, route }) {
  const { getAnotacoes, updateAnotacao, delAnotacoes } = useContext(GlobalContext);

  const { noteId } = route.params;

  const [noteName, setNoteName] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const scheme = useColorScheme();

  async function applyNoteEdit() {
    await updateAnotacao(noteId, noteName, noteContent);
    setNoteName("");
    setNoteContent("");
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchNoteDetails() {
      // Fetch note details using noteId and populate state
      // This is a placeholder; replace with actual data fetching logic
      const noteDetails = await getAnotacoes(noteId);
      setNoteName(noteDetails.nomeAnotacao);
      setNoteContent(noteDetails.descricao);
    }
    fetchNoteDetails();
  }, [noteId]);


  return (
    <SafeAreaView style={[styles.inputModalContainer, {paddingHorizontal: 10}]}>
      <Text
        style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
      >
        Editar Nota
      </Text>
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
          onPress={ async () => {
            await delAnotacoes(noteId);
            navigation.goBack();
          }}
        >
          <Text style={styles.pickerButtomText}>Apagar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickerButtom} onPress={applyNoteEdit}>
          <Text style={styles.pickerButtomText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default NoteEdit;
