import { View, TouchableOpacity, Text, Alert } from "react-native";

import styles from "../styles";

const TagItem = ({ item, onSelect, onLongPress, updateState }) => {
  return (
    <View style={styles.tagContainer}>
      <TouchableOpacity
        onPress={() => {
          onSelect(item);
        }}
        onLongPress={() => {
          Alert.alert(
            "Excluir Tag",
            `Tem certeza que deseja excluir a tag "${item.descricao}"?`,
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                  try {
                    console.log("Deleting tag:", item.id);
                    await onLongPress(item.id);
                    updateState(Math.random().toString());
                  } catch (error) {
                    console.error("Error deleting tag:", error);
                  }
                }
              }
            ]
          );
        }}
      >
        <Text style={styles.pickerButtomText}>{item.descricao}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TagItem;
