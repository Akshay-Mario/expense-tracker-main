import { fontSize } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StatusBar, StyleSheet } from 'react-native'; // import Text
import { View, TextField, Button, Text } from 'react-native-ui-lib';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, onValue, set } from "firebase/database";
import app from '../../firebase';

// Fetch data



export default function SignInScreen({ isLoggedIn, setLoggedIn }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true); // add this state

    const fetchDataAndCheckLogin = async () => {


        try {
            // Check login status
            const value = await AsyncStorage.getItem('@isloggedIn_key');
            const username = await AsyncStorage.getItem('@username_key');
            const password = await AsyncStorage.getItem('@password_key');

            if (username === '') {
                setLoggedIn(false);
                return;
            }
            else {

                const db = getDatabase(app);
                const dbRef = ref(db, 'users/' + username);

                let userData; // Variable to store user data once fetched

                // Fetch user data
                await new Promise((resolve, reject) => {
                    onValue(dbRef, (snapshot) => {
                        const data = snapshot.val();
                        userData = data;
                        resolve();
                    }, (error) => {
                        reject(error);
                    });
                });



                if (value === 'true' && username && password) {
                    // User is logged in, validate username and password
                    const userExists = userData && userData.password === password;
                    if (userExists) {
                        // Username and password are correct
                        await AsyncStorage.setItem('@imagePath', userData.imagepath);
                        setLoggedIn(true);
                    } else {
                        // Invalid username or password
                        setLoggedIn(false);
                    }
                } else {
                    // User is not logged in
                    await AsyncStorage.setItem('@username_key', '');
                    await AsyncStorage.setItem('@password_key', '');
                    await AsyncStorage.setItem('@isloggedIn_key', 'false');
                    setLoggedIn(false);
                }

            }

        } catch (e) {
            console.error('Error:', e);
        }
    };

    useEffect(() => {
        fetchDataAndCheckLogin();
    }, []);

    const handleSignIn = () => {
        if (username != '' & password != '') {
            const saveData = async () => {
                try {
                    await AsyncStorage.setItem('@username_key', username);
                    await AsyncStorage.setItem('@password_key', password);
                    await AsyncStorage.setItem('@isloggedIn_key', 'true');
                    fetchDataAndCheckLogin();



                } catch (e) {
                    console.log("error", e)
                }
            }

            saveData();
        }

    };

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar />
            <View style={styles.container}>
                <Text style={styles.title}>Sign In</Text>
                <TextField
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={setUsername}
                    placeholder="Username"
                    value={username}
                />
                <TextField // use TextInput from react-native-paper
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry={passwordVisible} // use passwordVisible state here
                    trailingAccessory={<View style={styles.eyeContainer}>
                        <Ionicons
                            style={styles.eye}
                            name={passwordVisible ? "eye" : "eye-off"}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        />
                    </View>}
                    value={password}
                />
                <Button style={styles.button} label={'Sign In'} onPress={handleSignIn} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    input: {
        width: 250,
        justifyContent: 'center',
        fontSize: 15,
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 10,
        height: 40,

    },
    root: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#7E0BFD',
        padding: 10,
        borderRadius: 25,
    },
    title: { // added style for the sign-in text
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    eyeContainer: {
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingRight: 10,
        paddingTop: 10,
    },
    eye: {
        color: 'gray',
    },
});

