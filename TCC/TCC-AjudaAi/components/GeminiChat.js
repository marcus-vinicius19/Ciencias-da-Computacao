import { useState, useEffect, useContext, createRef, useRef } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import * as Speech from "expo-speech";
import { useIsFocused } from '@react-navigation/native';

import styles from "../styles";
import { GlobalContext } from "./GlobalContext";
import { GeminiInstructions } from "./GeminiInstructions";

const GEMINI_API_KEY = "AIzaSyDU4T0Fyps3YcA1ZCHCBZVEu6T1cykf9pM";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const createTaskFunctionDeclaration = {
  name: "create_task",
  description:
    "Cria uma tarefa com data de inicio e data de conculusao, com etapas, prioridade e tags",
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskName: {
        type: Type.STRING,
        description: "Nome da tarefa",
      },
      startDate: {
        type: Type.STRING,
        description: 'Data do inicio da tarefa (e.g., "2024-07-29")',
      },
      dueDate: {
        type: Type.STRING,
        description: 'Data do fim da tarefa (e.g., "2024-07-29")',
      },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Nome da etapa",
            },
          },
          required: ["title"],
        },
        description: "Etapas da tarefa",
      },
      priority: {
        type: Type.INTEGER,
        description:
          "A prioridade da tarefa, podendo ser: alta, media ou baixa, sendo alta = 2, media = 1 e baixa = 0",
      },
    },
    required: ["taskName", "dueDate", "priority"],
  },
};

const renderMessage = ({ item }) => {
  return (
    <View
      key={item.text}
      style={
        item.user ? styles.userMessageContainer : styles.iaMessageContainer
      }
    >
      <Markdown>{item.text}</Markdown>
    </View>
  );
};

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { setTarefa, aiVoice } = useContext(GlobalContext);

  const flatListRef = useRef()

  const isFocused = useIsFocused();

  useEffect(() => {
    const startChat = async () => {
      await receiveAIMessage("Olá");
    };
    startChat();

    // cleanup on unmount
    return () => {
      try { Speech.stop(); } catch (e) {}
    };
  }, []);

  // stop speech when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      try { Speech.stop(); } catch (e) {}
    }
  }, [isFocused]);

  // scroll to end when keyboard opens so latest messages are visible
  useEffect(() => {
    const onKeyboardShow = () => {
      setTimeout(() => {
        try {
          if (flatListRef.current) {
            if (typeof flatListRef.current.scrollToEnd === 'function') {
              flatListRef.current.scrollToEnd({ animated: true });
            } else if (typeof flatListRef.current.scrollToOffset === 'function') {
              flatListRef.current.scrollToOffset({ offset: 999999, animated: true });
            }
          }
        } catch (e) {
          // ignore
        }
      }, 50);
    };

    const sub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    return () => {
      try { sub.remove(); } catch (e) {}
    };
  }, []);

  function addMessage(text, user) {
    if (!text || text.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        key: Math.random(),
        text: text,
        user: user,
      },
    ]);
    console.log(messages);
    flatListRef.current.scrollToEnd();
  }

  const receiveAIMessage = async (prompt) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: GeminiInstructions,
          tools: [
            {
              functionDeclarations: [createTaskFunctionDeclaration],
            },
          ],
        },
      });

      console.log(response.text);

      // Check for function calls in the response
      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]; // Assuming one function call
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
        // In a real app, you would call your actual function here:
        // const result = await scheduleMeeting(functionCall.args);

        await setTarefa(
          functionCall.args.taskName,
          functionCall.args.startDate,
          functionCall.args.dueDate,
          functionCall.args.steps,
          functionCall.args.priority
        );
      } else {
        console.log("No function call found in the response.");
      }

      // TTS speak if enbaled
      if (aiVoice == true) {

        // Remove emotes from text
        const audioResponse = response.text.replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF])/g,
          ""
        );

        // Call TTs api
        Speech.speak(audioResponse, { language: "pt" });
      }

      // Add IA message to messages
      addMessage(response.text, false);
    } catch (error) {

      console.error("Gemini chat input error,", error);
      addMessage(error.toString(), false);
      setLoading(false);
    }

    setLoading(false);
  };

  const sendMessage = async () => {
    // Add user message to messages
    addMessage(userInput, true);
    const prompt = userInput;
    setUserInput("");
    await receiveAIMessage(prompt);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 80}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 10, marginBottom: 5, marginHorizontal: 7 }}>
            <FlatList
              ref={flatListRef}
              style={{ flex: 1 }}
              data={messages}
              renderItem={renderMessage}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholderTextColor={"#0088ffff"}
              onChangeText={setUserInput}
              onSubmitEditing={sendMessage}
              value={userInput}
              style={styles.aiChatInputText}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            {loading && (
              <ActivityIndicator
                size={"small"}
                color={"#0088ffff"}
                style={{ margin: 10 }}
              />
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default GeminiChat;
