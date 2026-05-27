import { Pressable, TextInput, View, Platform  } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";;

import styles from "../styles";

const TaskDatePicker = ({placeholder, onDateConfirm, value}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      // const currentDate = selectedDate
      // setSelectedDate(currentDate)

      if (Platform.OS === "android") {
        togglDatePickerModal();
        onDateConfirm(selectedDate);
        console.log(selectedDate)
      }
    } else {
      togglDatePickerModal()
    }
  };

  const togglDatePickerModal = () => {
    setShowDatePickerModal(!showDatePickerModal);
  };

  // const confirmIOSDate = (date) => {
  //   onDateConfirm(date);
  //   togglDatePickerModal();
  // };

  const formatDateBR = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value; // fallback to original if invalid
    return d.toLocaleDateString('pt-BR');
  }

  return (
    <>
      {!showDatePickerModal && (
        <Pressable on onPress={togglDatePickerModal}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={"#0088ffff"}
            value={formatDateBR(value)}
            editable={false}
            onPressIn={togglDatePickerModal}
          />
        </Pressable>
      )}
      {showDatePickerModal && (
        <DateTimePicker
          mode="date"
          value={value}
          display="spinner"
          onChange={onChange}
          style={styles.datePicker}
          themeVariant="light"
        />
      )}
      {/* {showDatePickerModal && Platform.OS === "ios" && (
        <View style={{ flex: 1, flexDirection: "row"}}>
          <TouchableOpacity
            style={[styles.pickerButtom, { backgroundColor: "#ff0000ff" }]}
            onPress={togglDatePickerModal}
          >
            <Text style={styles.pickerButtomText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerButtom}
            onPress={confirmIOSDate}
          >
            <Text style={styles.pickerButtomText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </>
  );
};

export default TaskDatePicker;
