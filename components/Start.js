// Required imports
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

// Predefined background colors
const backgroundColors = {
  a: "#090C08",
  b: "#474056",
  c: "#8A95A5",
  d: "#B9C6AE",
};

const Start = ({ navigation }) => {
  // State variables for the user's name and chosen color
  const [name, setName] = useState("");
  const [color, setColor] = useState(backgroundColors.d);

  // Firebase authentication
  const auth = getAuth();

  // Sign in function (anonymously) for the user
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        // Navigate to the Chat screen upon successful sign in
        navigation.navigate("Chat", {
          name: name,
          _id: result.user.uid,
          color: color,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/BGimage.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.appTitle}>EZ Chat</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#757083"
          />
          <Text style={styles.textColorSelector}>Choose background color:</Text>
          <View style={styles.colorSelector}>
            {Object.keys(backgroundColors).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.circle,
                  color === backgroundColors[key] && styles.selectedCircle,
                  { backgroundColor: backgroundColors[key] },
                ]}
                onPress={() => setColor(backgroundColors[key])}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={signInUser}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
        {/* Conditional rendering based on the OS for better UI experience */}
        {Platform.OS === "ios" ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "space-between",
    padding: "6%",
  },
  appTitle: {
    flex: 2,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    alignSelf: "center",
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "6%",
    flexBasis: 160,
  },
  textInput: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    padding: 15,
    borderWidth: 1,
    borderColor: "#757083",
    marginTop: 15,
    marginBottom: 15,
  },
  textColorSelector: {
    fontSize: 16,
    fontWeight: "300",
    color: "#8A95A5",
  },
  colorSelector: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  button: {
    alignContent: "center",
    backgroundColor: "#757083",
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Start;