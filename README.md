# chat_app

This is mobile chatting app that you can use with friends in real time, it offers image sharing as well as location sharing.

![Chat App Image](./assets/images/chat_app.png)

## Technology Utilized

- React Native
- Expo
- React Native Gifted Chat library
- Firebase Cloud Storage (images)
- Google Firebase Authentication
- Google Firestore Database
- AsyncStorage caching (offline usage)
- Expo ImagePicker and Medialibary

## Features

- Background Color Personalization
- Chat in real time
- Offline access (view your chat history while disconnected from network)
- Image Sharing
- Location sharing

## Getting Started

Create a new project with React Native:

```shell
npx create-expo-app chat_app --template
```

Install Expo Globally:

```shell
npm install - expo-cli
```

To startup Expo:

```shell
expo start
```

### Database Setup

To set up a database for this project:

1. Create and sign-up for a database on https://firebase.google.com/
2. install firebase in your project directory: npm install firebase
3. import personal firebase config from project settings tab in firebase console into App.js (replace existing code)
4. within firebase database rules adjust "allow read, wreite: if false;" to "allow read, write: if true;", then publish

### Android Studio

To utilize features of the app within the android studio emulator install these libraries in your project directory:

```shell
expo install expo-image-picker
expo install react-native-maps
expo install expo-location
expo install expo-media-library
```

## GitHub Repository

Feel free to check out this projects [Repository](https://github.com/Christian-Horban/Chat)
