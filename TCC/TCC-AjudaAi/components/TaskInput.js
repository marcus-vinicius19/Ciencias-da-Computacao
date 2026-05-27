import { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import TaskDatePicker from "./TaskDatePicker";
import styles from "../styles";

import StepItem from "./StepItem";

import { GlobalContext } from "./GlobalContext";
import { useFocusEffect } from "@react-navigation/core";
import TagItem from "./TagItem";

function TaskInput({ navigation }) {
  const { setTarefa, getTags, setTag, delTags, scheduleNotification } =
    useContext(GlobalContext);

  const scheme = useColorScheme();

  // Task input states
  const [taskName, setTaskName] = useState("");
  const [steps, setSteps] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [selectedTag, setSelectedTag] = useState();

  // Tags list
  const [tags, setTags] = useState([]);

  // Input states
  // Tag
  const [tagInput, setTagInput] = useState("");
  const [submitTag, setSubmitTag] = useState("");

  // Steps
  const [stepInput, setStepInput] = useState("");

  // Notifications
  const [shouldScheduleNotification, setShouldScheduleNotification] =
    useState(false);

  // Update state
  const [updateState, setUpdateState] = useState("");

  const toggleSwitch = () =>
    setShouldScheduleNotification((previousState) => !previousState);

  async function AddTaskHandler() {
    await setTarefa(taskName, startDate, dueDate, steps, priority, selectedTag.id);
    setTaskName("");
    setSteps([]);
    setDueDate(new Date());
    setStartDate(new Date());
    setTags([]);

    if (shouldScheduleNotification === true) {
      await scheduleNotification(dueDate);
    }

    navigation.goBack();
  }


  function AddStep(title) {
    setSteps([...steps, { key: Math.random(), id: Math.random(), nomeSubtarefa: title }]);
  }

  function RemoveStep(id) {
    const newSteps = steps.filter((step) => step.id !== id);
    setSteps(newSteps);
  }


  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          const response = await getTags();

          if (isActive) {
            setTags(response);
          }
        } catch (e) {
          console.error("Error focus effect", e);
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [submitTag, updateState])
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginHorizontal: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 64}
    >
      <SafeAreaView>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.formContainer}>
        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          Criar Tarefa
        </Text>          
        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          Nome
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da tarefa"
          placeholderTextColor={"#0088ffff"}
          onChangeText={setTaskName}
          value={taskName}
        />
        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          Etapas
        </Text>
        <FlatList
          style={{ flexGrow: 0 }}
          data={steps}
          renderItem={({ item }) => <StepItem item={item} onRemove={RemoveStep} />}
          scrollEnabled={false}
          ListEmptyComponent={<Text>*Sem etapas ainda</Text>}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome da etapa"
          value={stepInput}
          onChangeText={setStepInput}
          placeholderTextColor={"#0088ffff"}
          onSubmitEditing={() => {
            AddStep(stepInput);
            setStepInput("");
          }}
        />

        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          Data de Inicio
        </Text>
        <TaskDatePicker
          placeholder="Insira a data de inicio"
          onDateConfirm={setStartDate}
          value={startDate}
        />
        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          Data de Conclusao
        </Text>
        <TaskDatePicker
          placeholder="Insira a data de conclusao"
          onDateConfirm={setDueDate}
          value={dueDate}
        />
        <View style={styles.rowBetween}>
          <Text
            style={
              scheme === "dark" ? styles.nameTextDark : styles.nameTextLight
            }
          >
            Lembretes
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={shouldScheduleNotification ? "#0088ffff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={shouldScheduleNotification}
          />
        </View>

        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          Prioridade
        </Text>
        <View style={styles.priorityInput}>
          <Picker
            selectedValue={priority}
            onValueChange={setPriority}
            style={{ color: "#0088ffff" }}
          >
            <Picker.Item label="Baixa" value={0} />
            <Picker.Item label="Media" value={1} />
            <Picker.Item label="Alta" value={2} />
          </Picker>
        </View>

        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          Tags
        </Text>
        <FlatList
          style={{ flexGrow: 0 }}
          data={tags}
          renderItem={({ item }) => <TagItem item={item} onSelect={setSelectedTag} onLongPress={delTags} updateState={setUpdateState} />}
          horizontal={true}
          scrollEnabled={false}
          contentContainerStyle={styles.tagRow}
          ListEmptyComponent={<Text>*Sem tags criadas</Text>}
        />
        <Text
          style={scheme === "dark" ? styles.nameTextDark : styles.nameTextLight}
        >
          {`Tag selecionada: ` + (selectedTag ? selectedTag.descricao : "Nenhuma")}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da tag"
          value={tagInput}
          onChangeText={setTagInput}
          placeholderTextColor={"#0088ffff"}
          onSubmitEditing={async () => {
            const trimmedTag = tagInput.trim();
            if (trimmedTag) {
              await setTag(trimmedTag);
              setSubmitTag(trimmedTag);
            }
            setTagInput("");
          }}
        />
        <View style={styles.buttomContainer}>
          <TouchableOpacity
            style={[styles.pickerButtom, { backgroundColor: "#ff0000ff" }]}
            onPress={() => {
              navigation.replace("Lista Tarefas");
            }}
          >
            <Text style={styles.pickerButtomText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerButtom}
            onPress={AddTaskHandler}
          >
            <Text style={styles.pickerButtomText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default TaskInput;
