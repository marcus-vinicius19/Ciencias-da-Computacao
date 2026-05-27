import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiInstructions } from "./GeminiInstructions";
import Markdown from "react-native-markdown-display";
import { GlobalContext } from "./GlobalContext";
import * as Speech from "expo-speech";
import { useIsFocused } from "@react-navigation/native";

// Initialize Google Gemini API
const GEMINI_API_KEY = "AIzaSyDU4T0Fyps3YcA1ZCHCBZVEu6T1cykf9pM";
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// We'll call the models API directly via genAI.models.generateContent().
// Some SDK versions don't expose `getGenerativeModel`, so avoid calling it.

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

// Batch creation: allows the model to create several tasks in a single function call
const createTasksFunctionDeclaration = {
  name: "create_tasks",
  description:
    "Cria múltiplas tarefas de uma só vez. Use quando o usuário descrever várias tarefas no mesmo pedido.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      tasks: {
        type: Type.ARRAY,
        description: "Lista de tarefas a serem criadas",
        items: {
          type: Type.OBJECT,
          properties: {
            taskName: { type: Type.STRING, description: "Nome da tarefa" },
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
                  title: { type: Type.STRING, description: "Nome da etapa" },
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
      },
    },
    required: ["tasks"],
  },
};

const SimpleGeminiChat = () => {
  const { setTarefa, aiVoice, getNType } = useContext(GlobalContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const isFocused = useIsFocused();

  const flatListRef = useRef()

  // scroll to end when keyboard opens so latest messages are visible
  useEffect(() => {
    const onKeyboardShow = () => {
      setTimeout(() => {
        try {
          if (flatListRef.current) {
            if (typeof flatListRef.current.scrollToEnd === "function") {
              flatListRef.current.scrollToEnd({ animated: true });
            } else if (
              typeof flatListRef.current.scrollToOffset === "function"
            ) {
              flatListRef.current.scrollToOffset({
                offset: 999999,
                animated: true,
              });
            }
          }
        } catch (e) {
          // ignore
        }
      }, 50);
    };

    const sub = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    return () => {
      try {
        sub.remove();
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const startChat = async () => {
      try {
        setLoading(true);

        const learnType = await getNType();

        const response = await genAI.models.generateContent({
          model: "gemini-2.5-flash",
          contents: "Olá! meu estilo de aprendizado é " + learnType,
          config: {
            systemInstruction: GeminiInstructions,
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
          },
        });

        let responseText = response.text;

        // Add AI response to messages
        const aiMessage = {
          role: "assistant",
          content: responseText,
        };
        setMessages((prev) => [...prev, aiMessage]);

        setLoading(false);

        // Update chat history
        const updatedHistory = [
          ...chatHistory,
          {
            role: "user",
            parts: [{ text: inputText }],
          },
        ];

        // Update chat history with AI's response
        setChatHistory([
          ...updatedHistory,
          {
            role: "model",
            parts: [{ text: responseText }],
          },
        ]);

        // TTS speak if enbaled
        if (aiVoice == true) {
          // Remove emotes from text
          const audioResponse = responseText.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF])/g,
            ""
          );
          // Call TTs api
          Speech.speak(audioResponse, { language: "pt" });
        }
      } catch (error) {
        console.error("Error starting chat:", error);
        setLoading(false);
      }
    };
    startChat();

    // cleanup on unmount
    return () => {
      try {
        Speech.stop();
      } catch (e) {}
    };
  }, []);

  // stop speech when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      try {
        Speech.stop();
      } catch (e) {}
    }
  }, [isFocused]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Scroll to end to show latest message
    setTimeout(() => {
            try {
              if (flatListRef.current) {
                if (typeof flatListRef.current.scrollToEnd === "function") {
                  flatListRef.current.scrollToEnd({ animated: true });
                } else if (
                  typeof flatListRef.current.scrollToOffset === "function"
                ) {
                  flatListRef.current.scrollToOffset({
                    offset: 999999,
                    animated: true,
                  });
                }
              }
            } catch (e) {
              // ignore
            }
          }, 50);

    // Add user message to UI
    const userMessage = {
      role: "user",
      content: inputText,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Update chat history
    const updatedHistory = [
      ...chatHistory,
      {
        role: "user",
        parts: [{ text: inputText }],
      },
    ];

    setLoading(true);
    setInputText("");

    try {
      // Build a single prompt string from the history so we can support SDKs
      // that accept a single text "contents" input. We include a system
      // instruction at the start when starting a fresh conversation.
      let promptString = "";
      if (!chatHistory || chatHistory.length === 0) {
        promptString += (GeminiInstructions || "") + "\n\n";
      }
      // append previous messages
      (updatedHistory || []).forEach((m) => {
        const role = m.role || "user";
        const text = (m.parts && m.parts[0] && m.parts[0].text) || "";
        promptString += `${role.toUpperCase()}: ${text}\n`;
      });

      // Ask model using the concatenated prompt
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptString,
        config: {
          systemInstruction: GeminiInstructions,
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          tools: [
            {
              functionDeclarations: [
                createTaskFunctionDeclaration,
                createTasksFunctionDeclaration,
              ],
            },
          ],
        },
      });

      // Extract text from several possible response shapes
      let responseText = "";
      if (response == null) {
        responseText = "";
      } else if (typeof response.text === "string") {
        responseText = response.text;

        // TTS speak if enbaled
        if (aiVoice == true) {
          // Remove emotes from text
          const audioResponse = responseText.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF])/g,
            ""
          );
          // Call TTs api
          Speech.speak(audioResponse, { language: "pt" });
        }
      } else if (
        response.response &&
        typeof response.response.text === "function"
      ) {
        try {
          responseText = response.response.text();
        } catch (e) {
          responseText = "";
        }
      } else if (
        response.output &&
        response.output[0] &&
        response.output[0].content &&
        response.output[0].content[0] &&
        typeof response.output[0].content[0].text === "string"
      ) {
        responseText = response.output[0].content[0].text;
      } else {
        // fallback to JSON
        try {
          responseText = JSON.stringify(response);
        } catch (e) {
          responseText = "";
        }
      }

      if (response.functionCalls && response.functionCalls.length > 0) {
        // Process all function calls returned by the model
        for (const functionCall of response.functionCalls) {
          try {
            console.log(`Function to call: ${functionCall.name}`);
            console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);

            if (functionCall.name === "create_task") {
              const a = functionCall.args || {};
              await setTarefa(
                a.taskName,
                a.startDate || null,
                a.dueDate || null,
                Array.isArray(a.steps) ? a.steps : [],
                typeof a.priority === "number" ? a.priority : 0
              );
            } else if (functionCall.name === "create_tasks") {
              const tasks = (functionCall.args && functionCall.args.tasks) || [];
              if (Array.isArray(tasks)) {
                for (const t of tasks) {
                  const task = t || {};
                  await setTarefa(
                    task.taskName,
                    task.startDate || null,
                    task.dueDate || null,
                    Array.isArray(task.steps) ? task.steps : [],
                    typeof task.priority === "number" ? task.priority : 0
                  );
                }
              }
            }
          } catch (fcErr) {
            console.warn("Error handling function call:", fcErr);
          }
        }
      } else {
        console.log("No function call found in the response.");
      }

      // Add AI response to messages
      const aiMessage = {
        role: "assistant",
        content: responseText,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Update chat history with AI's response
      setChatHistory([
        ...updatedHistory,
        {
          role: "model",
          parts: [{ text: responseText }],
        },
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    // Scroll to end to show latest message
    setTimeout(() => {
            try {
              if (flatListRef.current) {
                if (typeof flatListRef.current.scrollToEnd === "function") {
                  flatListRef.current.scrollToEnd({ animated: true });
                } else if (
                  typeof flatListRef.current.scrollToOffset === "function"
                ) {
                  flatListRef.current.scrollToOffset({
                    offset: 999999,
                    animated: true,
                  });
                }
              }
            } catch (e) {
              // ignore
            }
          }, 50);

    setLoading(false);
  };

  const renderMessage = ({ item }) => (
    <View style={item.role === "user" ? styles.userMessage : styles.aiMessage}>
      <Markdown style={markdownStyles}>{item.content}</Markdown>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        //behavior={Platform.OS === "ios" ? "padding" : "height"}
        behavior={"padding"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messageList}
          inverted={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            //placeholder="Digite sua mensagem..."
            placeholderTextColor="#666"
            multiline
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={loading || !inputText.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Enviar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  userMessage: {
    backgroundColor: "#ffffffff",
    alignSelf: "flex-end",
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "80%",
    borderWidth: 2,
    borderColor: "#c7c7c7ff",
  },
  aiMessage: {
    backgroundColor: "#0088FF",
    alignSelf: "flex-start",
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "80%",
    borderWidth: 2,
    borderColor: "#006dcdff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    //backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#0088FF",
    alignItems: "center",
  },
  input: {
    flex: 1,
    //backgroundColor: "#F0F0F0",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#0088FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    color: "#0088FF",
  },
  sendButton: {
    backgroundColor: "#0088FF",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  sendButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

const markdownStyles = {
  body: {
    color: "#000",
  },
  code_inline: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 2,
  },
  code_block: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 8,
  },
  link: {
    color: "#0088FF",
  },
};

export default SimpleGeminiChat;
