import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native-ui-lib';
import { ImageBackground, Platform, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AddExpenseScreen from './AddExpenseScreen';
import AllExpenseScreen from './AllExpenseScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Analytics from './ReportsScreen';


//import AddScreen from './src/screens/CreateTransactionScreen';


const Tab = createBottomTabNavigator();



function Tab3Screen() {
	return (
		<View flex center>
			<Text>Analytics</Text>
		</View>
	);
}

export default function MainNavigator({ isLoggedIn, setLoggedIn }) {

	const [userImagePath, setuserImagePath] = useState('https://instagram.fcok4-1.fna.fbcdn.net/v/t51.2885-19/275914063_383631216583617_196229648398256700_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fcok4-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=7SIC1eDsgYcAX_aR9cR&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfB1EIZSUFvVBU-3_SUXrTKMwybatZkjo5u_3DeJHjC4CA&oe=65BCDF48&_nc_sid=8b3546');
	const [username, setUsername] = useState('');



	const TabScreenWrapper = ({ children, route }) => {
		const isHomeScreen = route.name === 'Home';

		return (
			<View style={styles.userInfoRoot}>
				{isHomeScreen && (
					<View style={styles.userInfo}>
						{/* Your existing user information section */}
						<ImageBackground
							style={styles.rectangle14}
							source={{ uri: userImagePath }}
							imageStyle={{ borderRadius: 8 }}
						/>
						<View style={styles.usernsignout}>
							<View style={styles.userDetails}>
								<Text style={styles.userDetailsText}>{`Hello ${username}`}</Text>
								<Text style={styles.welcomeBack}>{`Welcome Back!`}</Text>
							</View>
							<TouchableOpacity
								style={styles.signOutButton}
								onPress={handleSignOut}>
								<Text style={styles.signoutText}>Sign Out</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
				{/* Render the actual screen */}
				{children}
			</View>
		);
	};


	const fetchAsyncPath = async () => {
		try {
			const _userImagePath = await AsyncStorage.getItem('@imagePath');
			setuserImagePath(_userImagePath)
			const _username = await AsyncStorage.getItem('@username_key')
			setUsername(_username);
		}
		catch (e) {
			console.log(e)
		}

	}

	const handleSignOut = () => {


		const logOut = async () => {

			try {
				setLoggedIn(false);
				await AsyncStorage.setItem('@username_key', '');
				await AsyncStorage.setItem('@password_key', '');
				await AsyncStorage.setItem('@isloggedIn_key', 'false');
			} catch (e) {
				console.log("error", e)
			}
		}
		logOut();

	};


	useEffect(() => {
		fetchAsyncPath();
	});

	return (
		<SafeAreaView style={styles.root}>
			<StatusBar />
			<NavigationContainer  >
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarActiveTintColor: "#7E0BFD",
						tabBarInactiveTintColor: "gray",
						headerShown: false,
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === 'Home') {
								iconName = focused ? 'ios-home' : 'ios-home-outline';
							} else if (route.name === 'Add Expense') {
								iconName = focused ? 'add-circle' : 'add-circle-outline';
							} else if (route.name === 'Analytics') {
								iconName = focused ? 'trending-up' : 'trending-up';
							}

							// You can return any component that you like here!
							return <Ionicons name={iconName} size={size} color={color} />;
						},
					})}

				>
					<Tab.Screen name="Home" options={({ route }) => ({ title: route.name })}>
						{(props) => (
							<TabScreenWrapper {...props} route={props.route}>
								<AllExpenseScreen />
							</TabScreenWrapper>
						)}
					</Tab.Screen>
					<Tab.Screen name="Add Expense" component={AddExpenseScreen} />
					<Tab.Screen name="Analytics" component={Analytics} />
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaView>
	);
}


const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: 'center',
		...Platform.select({
			android: {
				paddingTop: 20 // Adjust the padding value for Android
			},
		}),
	},
	userInfoRoot: {
		flex: 1,
		backgroundColor: "white",
	},

	signOutButton: {
		color: 'red',
	},
	signoutText: {
		color: '#7E0BFD',
	},
	rectangle14: {
		width: 40,
		height: 40,
		flexShrink: 0,
		borderRadius: 15,
		backgroundColor: 'rgba(217, 217, 217, 1)',
	},
	userInfo: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 30,
		marginTop: 10,
		marginBottom: 10,
	},
	usernsignout: {
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-between',
	},
	userDetails: {
		width: '50%',
		flexDirection: 'column',
		paddingLeft: 8
	},
	userDetailsText: {
		color: 'rgba(0, 0, 0, 1)',
		fontSize: 13,
		fontStyle: 'normal',
		fontWeight: '700',
	},
	userDetailsText: {
		color: 'rgba(0, 0, 0, 1)',
		//fontFamily: 'MontserratBold',
		fontSize: 13,
		fontStyle: 'normal',
		fontWeight: '700',
	},
	welcomeBack: {
		color: 'rgba(0, 0, 0, 1)',
		//fontFamily: 'MontserratLight',
		fontSize: 10,
		fontStyle: 'normal',
	},


});
