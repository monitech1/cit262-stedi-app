import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = ({ loggedInState, loggedInStates, setLoggedInState }) => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oneTimePassword, setOneTimePassword] = useState("");
  const [name, setName] = useState("Monigan"); // State to store the name

  useEffect(() => {
    if (loggedInState == loggedInStates.LOGGED_IN) {
      navigation.replace('Navigation');
    }
  }, []);

  if (loggedInState == loggedInStates.NOT_LOGGED_IN) {
    return (
      <View style={styles.allBody}>
        <Text style={styles.title}>Hello</Text>

        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          backgroundColor='#e6f0d5'
          placeholderTextColor='#818181'
          placeholder='Cell Phone'
        />

        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          backgroundColor='#e6f0d5'
          placeholderTextColor='#818181'
          placeholder='Your Name'
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={async () => {
            console.log(phoneNumber + ' Button was pressed');

            const sendTextResponse = await fetch(
              'https://dev.stedi.me/twofactorlogin/' + phoneNumber,
              {
                method: 'POST',
                headers: {
                  'content-type': 'application/text',
                },
              }
            );

            const sendTextResponseData = await sendTextResponse.text();

            if (sendTextResponse.status != 200) {
              await Alert.alert("Did you type your number correctly? " + phoneNumber);
            } else {
              setLoggedInState(loggedInStates.LOGGING_IN);
              Alert.alert('Hello ' + name);
            }
          }}
        >
          <Text style={{ color: 'white' }}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (loggedInState == loggedInStates.LOGGING_IN) {
    return (
      <View style={styles.allBody}>
        <TextInput
          value={oneTimePassword}
          onChangeText={setOneTimePassword}
          style={styles.input}
          placeholderTextColor='#818181'
          backgroundColor='#e6f0d5'
          placeholder='One Time Password'
          keyboardType='numeric'
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={async () => {
            console.log(phoneNumber + ' Button was pressed');

            const loginResponse = await fetch(
              'https://dev.stedi.me/twofactorlogin',
              {
                method: 'POST',
                headers: {
                  'content-type': 'application/text',
                },
                body: JSON.stringify({
                  phoneNumber,
                  oneTimePassword,
                }),
              }
            );

            if (loginResponse.status == 200) {
              const sessionToken = await loginResponse.text();
              console.log('sessionToken in Login Button', sessionToken);
              await AsyncStorage.setItem('sessionToken', sessionToken);
              navigation.replace('Navigation');
            } else {
              console.log('response status', loginResponse.status);
              Alert.alert('Invalid', 'Invalid Login information');
              setLoggedInState(loggedInStates.NOT_LOGGED_IN);
            }
          }}
        >
          <Text style={{ color: 'white' }}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  allBody: {
    marginTop: 150,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    height: 45,
    marginTop: 25,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#A0CE4E',
    padding: 10,
    marginTop: 8,
    borderRadius: 10,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#A0CE4E',
    padding: 10,
    marginTop: 8,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    color: '#A0CE4E',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 35,
  },
});

export default Login;