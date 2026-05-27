import { FlatList } from "react-native";
import TaskItem from "./TaskItem";
import { Text } from "react-native";

const TaskList = ({ tasks, updateState, onTaskLongPress}) => {

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => {
        return (
          <TaskItem
            id={item.id}
            title={item.descricao}
            startDate={item.dataInicio}
            dueDate={item.dataConclusao}
            priority={item.prioridade}
            steps={item.steps}
            completed={item.concluida}
            idTag={item.idTag}
            updateState={updateState}
            onTaskLongPress={onTaskLongPress}
          />
        );
      }}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => {
        return <Text style={{flex: 1, fontSize:18, fontWeight:"bold", color:"#0088ffff", margin: 15, justifyContent: "center", alignSelf:"center", alignItems: "center"}}>Tudo Feito :)</Text>;
      }}
    />
  );
};

export default TaskList;
