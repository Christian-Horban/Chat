import { useState, useEffect } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  // Destructure the name and color from the passed route parameters
  const { name, color } = route.params;

  // State for holding chat messages
  const [messages, setMessages] = useState([]);

  // Function to handle sending of new messages
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  // Custom rendering function for message bubbles
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // useEffect to set the navigation title to the user's name when the component mounts
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // useEffect to initialize the messages state with a couple of default messages when the component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // Render the chat UI
  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Chat;