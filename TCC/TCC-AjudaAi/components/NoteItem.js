import { StyleSheet, Text, Pressable, View } from "react-native";

function NoteItem({id, title, text, onDeleteItem, onLongNotePress}) {
    return (
        <Pressable 
            android_ripple={{color: '#cbd26bff'}}
            style={({pressed}) => pressed && styles.pressedItem}
            onPress={onDeleteItem.bind(this, id)}
            onLongPress={() => {onLongNotePress(id)} }
            accessibilityHint="Long press to log note info"
            delayLongPress={500}
        >
            <View style={styles.goalItem} >
                <Text style={styles.noteTitle}>{title}</Text>
                <Text>{text}</Text>
            </View>
        </Pressable>
    );
};

export default NoteItem;

const styles = StyleSheet.create({
    goalItem: {
        margin: 8,
        padding: 8,
        borderRadius: 6,
        backgroundColor: "#f7ff84ff",
        color: "white",
        overflow: "hidden",
    },

    noteTitle: {
        marginBottom: 6,
        fontWeight: "bold",
    },

    pressedItem: 
    {
        opacity: 0.5
    },
});