import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useContext, useRef } from "react";

import { GlobalContext } from "./GlobalContext";
import styles from "../styles";
import { FlatList, View, Text, useColorScheme } from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";

function TaskItem({
  id,
  title,
  steps,
  startDate,
  dueDate,
  priority,
  completed,
  idTag,
  updateState,
  onTaskLongPress,
}) {
  const scheme = useColorScheme();
  const { updateTarefa, updateSubtarefa, delTarefa, getTags } = useContext(GlobalContext);
  const longPressRef = useRef(false);

  // format date to Brazilian format DD/MM/YYYY
  const formatDateBR = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value; // fallback to original if invalid
    return d.toLocaleDateString('pt-BR');
  }

  function stepItem(itemData) {
    return (
      <BouncyCheckbox
        size={25}
        text={itemData.item.nomeSubtarefa}
        fillColor="#909090ff"
        unFillColor={scheme === "dark" ? "#000000ff" : "#fff"}
        style={[styles.taskItem, { marginVertical: 2 }]}
        onPress={(isChecked) => {
          updateSubtarefa(itemData.item.id, isChecked);
        }}
        isChecked={itemData.item.concluido}
      />
    );
  }

  // Tag item component
  const TagItem = ({ item }) => {
    return (
      <View style={styles.tagContainer}>
        <Text style={styles.pickerButtomText}>{item.descricao}</Text>
      </View>
    );
  };

  return (
    <View>
      <View>
        <LongPressGestureHandler
          minDurationMs={350}
          onActivated={() => {
            longPressRef.current = true;
            console.log("Long pressed task id: " + id);
            if (typeof onTaskLongPress === 'function') onTaskLongPress(id);
          }}
          onEnded={() => { longPressRef.current = false; }}
          onCancelled={() => { longPressRef.current = false; }}
          onFailed={() => { longPressRef.current = false; }}
        >
          <View>
            <BouncyCheckbox
              style={styles.taskItem}
              size={25}
              text={startDate ? title + " - " + formatDateBR(startDate) + "  -->  " + formatDateBR(dueDate) : title + " - " + formatDateBR(dueDate)}
              fillColor={
                priority === 2 ? "red" : priority === 1 ? "orange" : "green"
              }
              unFillColor={scheme === "dark" ? "#000000ff" : "#fff"}
              disableBuiltInState
              onPress={async (isChecked) => {
                if (longPressRef.current) {
                  longPressRef.current = false;
                  return;
                }
                await updateTarefa(id, isChecked);
                updateState(Math.random());
              }}
              isChecked={completed}
            />
          </View>
        </LongPressGestureHandler>
      </View>
      <FlatList
        style={{ marginStart: 30 }}
        data={steps}
        renderItem={stepItem}
      />
    </View>
  );
}

export default TaskItem;
