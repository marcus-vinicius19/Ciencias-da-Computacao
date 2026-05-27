import { useState } from "react"
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Picker } from "@react-native-picker/picker"
import { useContext } from "react"
import { GlobalContext } from "../components/GlobalContext"
import { CommonActions } from '@react-navigation/native'

import styles from "../styles"

const QuestionnaireScreen = ({navigation}) => {
    const {updtUsuario} = useContext(GlobalContext)

    const [answers, setAnswers] = useState(new Array(30).fill(1))

    const calculateResult = () => {
        let auditory = 0
        let visual = 0
        let kinesthetic = 0

        for (let i = 0; i < answers.length; i++) {
            if (i < 10) {
                auditory += answers[i]
            } else if (i < 20) {
                visual += answers[i]
            } else {
                kinesthetic += answers[i]
            }
        }

        if (auditory >= visual && auditory >= kinesthetic) {
            return "Auditivo"
        }
        if (visual >= auditory && visual >= kinesthetic) {
            return "Visual"
        }
        return "Cinestesico"
    }

    const submitQuestionnaire = async () => {
        console.log(answers)
        const result = calculateResult()
        console.log("Result: " + result)
        //await updtUsuario({estiloAprendizagem: result)
        await updtUsuario(result)

        // Reset root navigation to Drawer and open IA screen inside the drawer
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Drawer', params: { screen: 'IA' } }],
            })
        )
    }

    const QuestionnairePicker = ({index}) => {
        return (
            <View style={styles.priorityInput}>
                <Picker
                    selectedValue={answers[index]}
                    onValueChange={(answer) => {
                        let newAnswers = answers
                        newAnswers[index] = answer
                        setAnswers(newAnswers)
                        console.log(answers)
                    }}
                    style={{ color: "#0088ffff" }}
                >
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                </Picker>
            </View>
        )
    }



    return (
        <SafeAreaView style={localStyles.questionnaireView}>
            <ScrollView>
                <Text style={[localStyles.text, localStyles.title]}>Instruções: Responda o questionario de acordo com as opcoes abaixo: </Text>
                <Text style={[localStyles.text, localStyles.title]}>1 - Não me representa; - 0%</Text>
                <Text style={[localStyles.text, localStyles.title]}>2 - Me representa um pouco; 33%</Text>
                <Text style={[localStyles.text, localStyles.title]}>3 - Me representa bastante; 75%</Text>
                <Text style={[localStyles.text, localStyles.title]}>4 - Me representa completamente. 100%</Text>


                <Text style={[localStyles.text, localStyles.title]}>{"\n"}1- Auditivo:</Text>
                <Text  style={[localStyles.text]}>1.1- Estudo para um teste lendo minhas próprias anotações em voz alta ou estudando com outras pessoas;</Text>
                    <QuestionnairePicker index={0} />
                <Text style={[localStyles.text]}>1.2- Prefiro que alguém me explique algo oralmente a explicar por escrito;</Text>
                    <QuestionnairePicker index={1} />
                <Text style={[localStyles.text]}>1.3- Falo bastante sozinho;</Text>
                    <QuestionnairePicker index={2} />
                <Text style={[localStyles.text]}>1.4- converso com meu cão, gato, anjo da guarda, estátua, foto, etc;</Text>
                    <QuestionnairePicker index={3} />
                <Text style={[localStyles.text]}>1.5- Eu presto bastante atenção ao que os outros dizem;</Text>
                    <QuestionnairePicker index={4} />
                <Text style={[localStyles.text]}>1.6- As pessoas, às vezes, dizem que eu falo demais;</Text>
                    <QuestionnairePicker index={5} />
                <Text style={[localStyles.text]}>1.7- Posso dizer muito sobre alguém somente pelo tom da voz;</Text>
                    <QuestionnairePicker index={6} />
                <Text style={[localStyles.text]}>1.8- Gosto de ouvir música quando não tenho nada para fazer;</Text>
                    <QuestionnairePicker index={7} />
                <Text style={[localStyles.text]}>1.9- Prefiro ouvir podcasts ao invés de ler sobre um assunto;</Text>
                    <QuestionnairePicker index={8} />
                <Text style={[localStyles.text]}>1.10- Quando estou em lugares que não conheço, gosto de pedir informação.</Text>
                    <QuestionnairePicker index={9} />
                

                <Text style={[localStyles.text, localStyles.title]}>{"\n"}2- Visual:</Text>
                <Text style={[localStyles.text]}>2.1- Gosto de ler livros e revistas;</Text>
                    <QuestionnairePicker index={10} />
                <Text style={[localStyles.text]}>2.2- Prefiro receber instruções por escrito a receber oralmente;</Text>
                    <QuestionnairePicker index={11} />
                <Text style={[localStyles.text]}>2.3- Em geral, gosto de pontos pertinentes para fazer uma prova;</Text>
                    <QuestionnairePicker index={12} />
                <Text style={[localStyles.text]}>2.4- Gosto de ir à exposições artísticas e feiras comerciais;</Text>
                    <QuestionnairePicker index={13} />
                <Text style={[localStyles.text]}>2.5- Gosto de me manter planejado com as coisas que tenho que fazer, através de listas e agendas;</Text>
                    <QuestionnairePicker index={14} />
                <Text style={[localStyles.text]}>2.6- Tenho uma boa primeira impressão de uma pessoa bem vestida;</Text>
                    <QuestionnairePicker index={15} />
                <Text style={[localStyles.text]}>2.7- Uso imagens e anotações para lembrar-me de coisas importantes;</Text>
                    <QuestionnairePicker index={16} />
                <Text style={[localStyles.text]}>2.8- Gosto de manter contato visual quando estou conversando com pessoas;</Text>
                    <QuestionnairePicker index={17} />
                <Text style={[localStyles.text]}>2.9- Sempre gosto de manter minha casa limpa e organizada;</Text>
                    <QuestionnairePicker index={18} />
                <Text style={[localStyles.text]}>2.10- Gosto de assistir filmes, séries e vídeos no meu tempo livre.</Text>
                    <QuestionnairePicker index={19} />


                <Text style={[localStyles.text, localStyles.title]}>{"\n"}3- Cinestesico:</Text>
                <Text style={[localStyles.text]}>3.1- Quando ouço música do meu gosto, acompanho batendo os pés;</Text>
                    <QuestionnairePicker index={20} />
                <Text style={[localStyles.text]}>3.2- Gosto de estar ao ar livre, solto, caminhar em liberdade;</Text>
                    <QuestionnairePicker index={21} />
                <Text style={[localStyles.text]}>3.3- Tenho boa coordenação motora para fazer muitas coisas;</Text>
                    <QuestionnairePicker index={22} />
                <Text style={[localStyles.text]}>3.4- Toco nas pessoas quando estou conversando com elas;</Text>
                    <QuestionnairePicker index={23} />
                <Text style={[localStyles.text]}>3.5- Quando aprendi a digitar no computador, tive facilidade com o sistema de toques no teclado;</Text>
                    <QuestionnairePicker index={24} />
                <Text style={[localStyles.text]}>3.6- Aprecio mais praticar do que assistir esportes;</Text>
                    <QuestionnairePicker index={25} />
                <Text style={[localStyles.text]}>3.7- Gosto de levantar-me e fazer um alongamento nas pernas e braços;</Text>
                    <QuestionnairePicker index={26} />
                <Text style={[localStyles.text]}>3.8- Tenho facilidade em reconhecer objetos e compartimentos pelo tato;</Text>
                    <QuestionnairePicker index={27} />
                <Text style={[localStyles.text]}>3.9- Posso dizer muito de uma pessoa simplesmente pelo modo com que ela aperta minhas mãos;</Text>
                    <QuestionnairePicker index={28} />
                <Text style={[localStyles.text]}>3.10- Prefiro aprender as coisas na prática ao invés de ficar apenas na teoria.</Text>
                    <QuestionnairePicker index={29} />
                
                <View style={localStyles.submitView}>
                    <TouchableOpacity style={styles.pickerButtom} onPress={submitQuestionnaire} >
                        <Text style={styles.pickerButtomText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default QuestionnaireScreen

const localStyles = StyleSheet.create({
    questionnaireView: {
        flex: 1,
        paddingHorizontal: 10,
    },
    submitView: {
      justifyContent: "center"  
    },
    text: {
        color: "#0088ffff",
        fontSize: 18,
        marginTop: 20,
    },
    title: {
        fontWeight: "bold",
        fontSize: 22,
    },
})