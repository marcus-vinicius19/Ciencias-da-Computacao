import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, Modal, View, FlatList } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { GlobalContext } from "../components/GlobalContext";

import TaskList from "../components/TaskList";
import TagItem from "../components/TagItem";

import styles from "../styles";
import TaskInput from "../components/TaskInput";
import TaskEdit from "../components/TaskEdit";

const Stack = createNativeStackNavigator();

const TaskScreen = ({ navigation }) => {

  const { getTarefa, getTags } = useContext(GlobalContext);

  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [taskSubmitted, setTaskSubmitted] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const response = await getTarefa();
          setAllTasks(response);
          setTasks(response);
          
          const tagsResponse = await getTags();
          setTags(tagsResponse);
        } catch (e) {
          console.error("Error focus effect: ", e);
        }
      };
      fetchUser();

    }, [])
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getTarefa();
        setAllTasks(response);
        setTasks(response);
      } catch (e) {
        console.error("Error use effect: ", e);
      }
    };

    fetchUser();
  }, [taskSubmitted]);

  useEffect(() => {
    if (selectedTag) {
      // Filter tasks by selected tag
      console.log("Filtering by tag:", selectedTag.id);
      console.log("All tasks:", allTasks);
      
      const filtered = allTasks.filter(task => {
        // Check if task has idTag field and it includes the selected tag
        const hasTag = task.idTag && (
          Array.isArray(task.idTag) 
            ? task.idTag.includes(selectedTag.id)
            : task.idTag === selectedTag.id
        );
        console.log(`Task ${task.id} (${task.descricao}) - idTag:`, task.idTag, "hasTag:", hasTag);
        return hasTag;
      });
      
      console.log("Filtered tasks:", filtered);
      setTasks(filtered);
    } else {
      // Show all tasks
      setTasks(allTasks);
    }
  }, [selectedTag, allTasks]);

  const handleTagSelect = (tag) => {
    if (selectedTag && selectedTag.id === tag.id) {
      // Deselect if same tag is clicked
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
    setFilterModalVisible(false);
  };

  const clearFilter = () => {
    setSelectedTag(null);
    setFilterModalVisible(false);
  };



  const onTaskLongPress = (id) => {
    console.log(`Task long-pressed: id=${id}`);
    navigation.navigate("Editar Tarefa", { taskId: id, backScreen: "Lista Tarefas" });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>
            {selectedTag ? `🏷️ ${selectedTag.descricao}` : "🔍 Filtrar"}
          </Text>
        </TouchableOpacity>
      </View>

      <TaskList tasks={tasks} updateState={setTaskSubmitted} onTaskLongPress={onTaskLongPress} />
      
      <TouchableOpacity
        style={styles.addBottomButtom}
        onPress={() => {
          navigation.navigate("Criar Tarefa");
        }}
      >
        <Text style={[styles.buttomText, { fontSize: 18 }]}>
          Adicionar Tarefa
        </Text>
      </TouchableOpacity>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Tag</Text>
            
            <FlatList
              data={tags}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TagItem 
                  item={item} 
                  onSelect={handleTagSelect}
                  onLongPress={() => {}}
                  updateState={() => {}}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma tag disponível</Text>
              }
            />

            {selectedTag && (
              <TouchableOpacity
                style={[styles.modalButton, styles.clearButton]}
                onPress={clearFilter}
              >
                <Text style={styles.modalButtonText}>Limpar Filtro</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const LoginStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Lista Tarefas"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Lista Tarefas" component={TaskScreen} />
      <Stack.Screen name="Criar Tarefa" component={TaskInput} />
      <Stack.Screen name="Editar Tarefa" component={TaskEdit} />
    </Stack.Navigator>
  );
};

export default LoginStack;
