import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens import
import QuestionnaireScreen from "./QuestionnaireScreen";
import TutorialVideoScreen from "../components/TutorialVideoScreen";

const firstLoginStack = createNativeStackNavigator();

const FirstLoginScreen = () => {
  return (
    <firstLoginStack.Navigator initialRouteName="Questions" screenOptions={{headerShown:false}}>
        <firstLoginStack.Screen name="Questions" component={QuestionnaireScreen} />
        <firstLoginStack.Screen name="Tutorial" component={TutorialVideoScreen} />
    </firstLoginStack.Navigator>)
};

export default FirstLoginScreen;