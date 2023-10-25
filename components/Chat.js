// Required imports
import { useState, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions"; // Custom actions component (e.g., send image, location, etc.)
import MapView from "react-native-maps";

const Chat = ({ db, route, navigation, isConnected, storage }) => {
  // Extracting parameters passed via navigation
  const { name, color, _id } = route.params;
  const [messages, setMessages] = useState([]); // State to store chat messages

  // Function to load messages from local storage
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || "[]";
    setMessages(JSON.parse(cachedMessages));
  };

  // Function to save messages to local storage
  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to send a new message
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Render the input toolbar only if connected
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Customize chat bubble appearance
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#fff",
          },
        }}
      />
    );
  };

  // Set navigation title to user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // Initialize default messages (can be removed if not needed)
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://picsum.photos/140",
        },
      },
      {
        _id: 2,
        text: "This is a system message",
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // Fetch messages from Firestore or load from cache if not connected
  useEffect(() => {
    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (querySnapshot) => {
        let newMessages = [];
        querySnapshot.forEach((doc) => {
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        setMessages(newMessages);
        cachedMessages(newMessages); // Cache the new messages
      });
    } else {
      loadCachedMessages();
    }

    // Cleanup function
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [db, isConnected]);

  // Render custom actions like sending images or locations
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  // Render custom map view if location is shared in the message
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // Render the main chat UI
  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: route.params._id,
          name: route.params.name,
        }}
      />
      {/* Keyboard adjustments for Android & iOS */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
