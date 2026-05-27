import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalContext } from "../components/GlobalContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TaskInput from "../components/TaskInput";
import TaskEdit from "../components/TaskEdit";

import { useFocusEffect } from "@react-navigation/core";
import { ptBR } from "../components/utils/localeCalendarConfig";
import styles from "../styles";
import TaskList from "../components/TaskList";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

const calendarStack = createNativeStackNavigator();

const CalendarStackScreen = () => {
  return (
    <calendarStack.Navigator initialRouteName="TelaCalendario" screenOptions={{headerShown: false}}>
      <calendarStack.Screen name="TelaCalendario" component={CalendarScreen} />
      <calendarStack.Screen name="Criar Tarefa" component={TaskInput} />
      <calendarStack.Screen name="Editar Tarefa" component={TaskEdit} />
    </calendarStack.Navigator>
  );
};

const CalendarScreen = ({navigation}) => {
  const [tasks, setTasks] = useState(getTarefa);

  const { getTarefa } = useContext(GlobalContext);
  const [day, setDay] = useState();
  const [submitUpdate, setSubmitUpdate] = useState("");

  const scheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
         setTasks(await getTarefa(day));
      };

      fetchUser();
    }, [])
  );

  useEffect(() => {
      const fetchUser = async () => {
        setTasks(await getTarefa(day));
      };
      fetchUser();
    }, [day, submitUpdate]);

  const onTaskLongPress = (id) => {
    console.log(`Task long-pressed: id=${id}`);
    navigation.navigate("Editar Tarefa", { taskId: id, backScreen: "TelaCalendario" });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Calendar
          style={localStyles.calendar}
          headerStyle={localStyles.header}
          theme={scheme === "dark" ? localStyles.themeDark : localStyles.themeLight}
          onDayPress={setDay}
          markedDates={day && { [day.dateString]: { selected: true } }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {/*<TaskListCalendar tasks={tasks} updateState={setSubmitUpdate} /> */}
        <TaskList tasks={tasks} updateState={setSubmitUpdate} onTaskLongPress={onTaskLongPress}/>
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
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  calendar: {
    backgroundColor: "transparent",
  },

  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#0088ffff",
  },

  themeLight: {
    textMonthFontSize: 18,
    arrowColor: "#0088ffff",
    monthTextColor: "#0088ffff",
    todayTextColor: "#0088ffff",
    selectedDayBackgroundColor: "#0088ffff",
    selectedDayTextColor: "#fff",
    calendarBackground: "#ffffffff",
  },

  themeDark: {
    textMonthFontSize: 18,
    arrowColor: "#0088ffff",
    monthTextColor: "#0088ffff",
    todayTextColor: "#0088ffff",
    selectedDayBackgroundColor: "#0088ffff",
    selectedDayTextColor: "#fff",
    calendarBackground: "#000000ff",
  },

  selected: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default CalendarStackScreen;
