import { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import TaskDatePicker from "./TaskDatePicker";
import styles from "../styles";
import { GlobalContext } from "./GlobalContext";
import { useFocusEffect } from "@react-navigation/core";
import TagItem from "./TagItem";
import StepItem from "./StepItem";

function TaskEdit({ navigation, route }) {

  const { taskId, backScreen } = route.params;

  const { getTags, setTag, getTarefa, updateTarefaCompleta, delTarefa, delTags } = useContext(GlobalContext);
  const [updateState, setUpdateState] = useState("");

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

  async function UpdateTask() {
    //await setTarefa(taskName, startDate, dueDate, steps, priority, selectedTag);
    await updateTarefaCompleta(
      taskId,
      taskName, 
      startDate,
      dueDate,
      priority,
      selectedTag.id,
      steps
    );
    
    // Reset states
    setTaskName("");
    setDueDate(new Date());
    setStartDate(new Date());
    setTags([]);
    setSteps([]);
    setSelectedTag(undefined);
    setPriority("");

    navigation.goBack();
  }

  function AddStep(title) {
    setSteps([...steps, { key: Math.random(), id: Math.random(), nomeSubtarefa: title }]);
  }

  function RemoveStep(id) {
    const newSteps = steps.filter((step) => step.id !== id);
    setSteps(newSteps);
  }

  useEffect(() => {
    // Fetch task details using taskId
    async function fetchTaskDetails() {
      const taskDetails = await getTarefa(undefined, taskId);
      console.log("Fetched task details:", taskDetails);

      // Populate states with fetched details
      setTaskName(taskDetails.descricao);
      setStartDate(new Date(taskDetails.dataInicio));  
      setSteps(taskDetails.steps || []);
      setDueDate(new Date(taskDetails.dataConclusao));
      setPriority(taskDetails.prioridade);

      const taskTags = await getTags(taskDetails.idTag);
      setSelectedTag(taskTags);
    }
    fetchTaskDetails();
  }, [taskId]);

  // Get tags on focus
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
          Editar Tarefa
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
          renderItem={({ item }) => <StepItem item={item} onRemove={RemoveStep} /> }
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
            onPress={ async () => {
              await delTarefa(taskId);
              navigation.replace(backScreen);
            }}
          >
            <Text style={styles.pickerButtomText}>Apagar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerButtom}
            onPress={UpdateTask}
          >
            <Text style={styles.pickerButtomText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default TaskEdit;
