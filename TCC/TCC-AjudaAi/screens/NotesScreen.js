import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity, Text, Alert } from "react-native";
import { useContext, useState, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/core";

import NoteInput from "../components/NoteInput";
import NoteItem from "../components/NoteItem";

import styles from "../styles";
import { GlobalContext } from "../components/GlobalContext";
import NoteEdit from "../components/NoteEdit";

const Stack = createNativeStackNavigator()

const NotesStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Lista Notas"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Lista Notas" component={NoteScreen} />
      <Stack.Screen name="Criar Nota" component={NoteInput} />
      <Stack.Screen name="Editar Note" component={NoteEdit} />
    </Stack.Navigator>
  );
};

const NoteScreen = ({ navigation }) => {
  const { delAnotacoes, getAnotacoes } = useContext(GlobalContext);

  const [notes, setNotes] = useState([])
  const [submitNote, setSubmitNote] = useState("")

  const createTwoButtonAlert = (id) =>
    Alert.alert("Deletar Nota", "Voce deseja deletar esta nota?", [
      {
        text: "Cancel",
        onPress: console.log("Cancel Pressed"),
      },
      {
        text: "OK",
        onPress: async () => {
          await delAnotacoes(id);
          setSubmitNote(Math.random())
        },
      },
    ]);

  const onNoteLongPress = (id) => {
    console.log(`Note long-pressed: id=${id}`);
    navigation.navigate("Editar Note", { noteId: id });
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const response = await getAnotacoes();

          if (isActive) {
            setNotes(response);
          }
        } catch (e) {
          console.error(e);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };

    }, [submitNote])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={notes}
        renderItem={(itemData) => {
          return (
            <NoteItem
              id={itemData.item.id}
              title={itemData.item.nomeAnotacao}
              text={itemData.item.descricao}
              onDeleteItem={createTwoButtonAlert}
              onLongNotePress={onNoteLongPress}
            />
          );
        }}
      />
      <TouchableOpacity
        style={styles.addBottomButtom}
        onPress={() => {navigation.navigate("Criar Nota")}}
      >
        <Text style={[styles.buttomText, { fontSize: 18 }]}>
          Adicionar Nota
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotesStack;
