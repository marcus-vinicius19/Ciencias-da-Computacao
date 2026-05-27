import { Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const HelpScreen = () => {
    return (
        <SafeAreaView style={localStyles.helpScreenView}>
            <ScrollView>
                <Text style={[localStyles.text, localStyles.title]}>1. Qual o propósito do aplicativo?</Text>
                <Text style={[localStyles.text, {}]}>R: O propósito do app AjudAI é de auxiliar universitários com TDAH a otimizar suas rotinas e maximizar suas experiência na fase mais marcante de suas vidas.</Text>

                <Text style={[localStyles.text, localStyles.title]}>2. Posso conversar com a IA sobre qualquer assunto?</Text>
                <Text style={[localStyles.text, {marginBottom: 20}]}>R: Não, a IA foi direcionada para responder questões apenas de cunho acadêmico</Text>

                <Text style={[localStyles.text, localStyles.title]}>3. A IA não quer fazer minha tarefa, o que está ocorrendo?</Text>
                <Text style={[localStyles.text, {marginBottom: 20}]}>R: O assistente é instruído apenas a auxiliar com os planos e sugerir formas de realizar, ele não pode realizar a tarefa pelo estudante.</Text>

                <Text style={[localStyles.text, localStyles.title]}>4. Não consigo criar mais que 7 tags, o que aconteceu?</Text>
                <Text style={[localStyles.text, {marginBottom: 20}]}>R: O sistema possui uma limitação de 7 tags para que não haja um excesso denteo da organização. Lembre-se, quando mais simples, melhor irá funcionar</Text>

                <Text style={[localStyles.text, localStyles.title]}>5. Acredito que o questionário está com meu perfil cognitivo errado, posso refazer?</Text>
                <Text style={[localStyles.text, {marginBottom: 20}]}>R: Sim, acesse as configurações e entre na aba “Refazer Questionário”, lá você poderá refazer o teste e definir um novo perfil cognitivo.</Text>

                <Text style={[localStyles.text, localStyles.title]}>6. Não entendi muito bem algumas coisas sobre o app. Posso rever o tutorial?</Text>
                <Text style={[localStyles.text, {marginBottom: 20}]}>R: Sim, acesse as configurações e entre na aba “Tutorial”. Nessa área será possível realizar novamente o Tutorial. </Text>
                
                <Text style={[localStyles.text, localStyles.title]}>7. Para onde vai os planos de ações e as sugestões geradas pela IA?</Text>
                <Text style={[localStyles.text, {marginBottom: 20}]}>R: As ideias criadas pela IA, são colocadas automaticamente dentro de suas listas de tarefas com as mesmas especificações definidas por ela. Caso deseje visualizar, acesse o menu lateral e clique em “Tarefas”.</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HelpScreen

const localStyles = StyleSheet.create({
    helpScreenView: {
        flex: 1,
        paddingTop: 6,
        marginHorizontal: 10,
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
    },

    text: {
        color: "#0088ffff",
        fontSize: 16
    },
})