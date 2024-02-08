import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import MainNavigator from './src/screens/mainNavigator';
import SignInScreen from './src/screens/SignInScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './src/screens/LoadingScreen';



export default function App() {
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [isLoading, setLoading] = useState(true);


	const checkIsLoggedIn = async () => {

		try {
			const isLoggedIn = await AsyncStorage.getItem("@isloggedIn_key");
			if (isLoggedIn) {
				setLoggedIn(true);
			}
			else {
				setLoggedIn(false);
			}
		}
		catch (e) {
			console.log(e);
		}
		finally {
			setLoading(false);
		}
	}


	useEffect(() => {
		checkIsLoggedIn();
	}, []);



	if (isLoading) {
		return <LoadingScreen />;
	}
	else
		return (
			<SafeAreaView style={styles.root}>
				<StatusBar />
				{isLoggedIn ? (
					// User is logged in, show MainNavigator
					<MainNavigator isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
				) : (
					// User is not logged in, show SignInScreen
					<SignInScreen isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
				)}
			</SafeAreaView>
		);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
	},
});
