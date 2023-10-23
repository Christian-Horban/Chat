import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";

const Chat = ({ db, route }) => {
  const { name, _id } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubMessages = onSnapshot(
      collection(db, "messages"),
      (querySnapshot) => {
        const newMessages = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.user._id,
              name: data.user.name,
              avatar: data.user.avatar,
            },
          };
        });

        // Sort messages by createdAt in descending order
        newMessages.sort((a, b) => b.createdAt - a.createdAt);
        setMessages(newMessages);
      }
    );

    // Clean up function
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [db]);

  // Function to handle sending of new messages
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Custom rendering function for message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };
  
  // Render the chat UI
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: _id,
          name: name,
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
