import { padding } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Platform, TouchableOpacity, Modal, ScrollView, Dimensions, ImageBackground } from 'react-native'; // import Text
import { View, TextField, Button, Text } from 'react-native-ui-lib';
import MonthPicker from 'react-native-month-picker';
import moment from 'moment';
import ExpenseList from '../components/ExpenseList.js';
import { getDatabase, ref, onValue } from "firebase/database";
import app from '../../firebase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import Ionicons from '@expo/vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getDatabase, ref, onValue, set } from "firebase/database";
// import app from '../../firebase';

export default function AllExpenseScreen() {

	const [isOpen, toggleOpen] = useState(false);
	const [month, onChangeMonth] = useState(new Date());
	const [expenseData, setexpenseData] = useState([]);
	const [showTransaction, setshowTransaction] = useState(true);
	const [totalExpense, setTotalExpense] = useState('');
	const [totalSaving, setTotalSaving] = useState('');
	const [totalIncome, setTotalIncome] = useState('');
	const [currentBalance, setCurrentBalance] = useState('');
	const [userImagePath, setuserImagePath] = useState('');


	const fetchMonthWiseExpenseNIncome = async () => {
		try {
			// Check login status
			const _userImagePath = await AsyncStorage.getItem('@imagePath');
			setuserImagePath(_userImagePath)
			console.log("userimagepath:", userImagePath);
			const isLoggedIn = await AsyncStorage.getItem('@isloggedIn_key');
			const _username = await AsyncStorage.getItem('@username_key')
			const monthData = (new Date(month).getMonth() + 1) + '_' + new Date(month).getFullYear();
			if (_username && isLoggedIn) {
				const db = getDatabase(app);
				const dbRef = ref(db, 'expense/' + _username + '/' + monthData);
				await new Promise((resolve, reject) => {
					onValue(dbRef, (snapshot) => {
						const data = snapshot.val();
						if (data) {
							const sortedData = Object.entries(data).sort((a, b) => b[1].date - a[1].date);
							setexpenseData(sortedData);
							calculateExpenses(data);
						}
						else {
							setTotalExpense('0');
							setTotalSaving('0');
							setTotalIncome('0');
							setCurrentBalance('0');
							setexpenseData(data);
						}
						setshowTransaction(true);
						resolve();
					}, (error) => {
						reject(error);
					});
				});
			}
			else {
				setshowTransaction(false);
			}
		} catch (e) {
			console.error('Error msg :', e);
			setshowTransaction(false);
		}
	};

	useEffect(() => {
		fetchMonthWiseExpenseNIncome();
	}, [isOpen]);


	function formatAmount(amount) {
		// Use toLocaleString to add commas as thousand separators
		return amount.toLocaleString('en-US',  { maximumFractionDigits: 0 });
	  }


	function calculateExpenses(data) {
		let totalPrivateExpense = 0;
		let totalprivateSaving = 0
		let totalprivateIncome = 0;
		if (data) {
			Object.keys(data).forEach((key) => {
				if (data[key].bill_type != "Savings" && data[key].bill_type != "income") {
					totalPrivateExpense += Number(data[key].amount)
				}
				else if (data[key].bill_type == "Savings") {
					totalprivateSaving += Number(data[key].amount);
				}
				else {
					totalprivateIncome += Number(data[key].amount);
				}

			})
			setTotalExpense(formatAmount(totalPrivateExpense));
			setTotalSaving(formatAmount(totalprivateSaving));
			setTotalIncome(totalprivateIncome);
			setCurrentBalance(formatAmount(totalprivateIncome - totalprivateSaving - totalPrivateExpense))
		}
		else {
			setTotalExpense('0');
			setTotalSaving('0');
			setTotalIncome('0');
			setCurrentBalance('0');
		}
	}


	return (

		<View style={styles.root} >
			{showTransaction ?
				<>
					<ScrollView >
						<View style={styles.rectContainer}>
							<View style={styles.rectangle2}>
								<View style={styles.currentBalanceView} >
									<Text style={styles.rupeeCurrenBalance} >
										{`₹`}
									</Text>
									<Text style={styles.currentBalanceText} >
										{currentBalance}
									</Text>
									<Text style={styles.inr}>INR</Text>
								</View>
								<View style={styles.savingExpenseContainer}>
									<View style={styles.expsavBlock1}>
										<Image style={{ width: 13, height: 13, marginBottom: 2, paddingRight: 10 }}
											source={require('../../assets/arrow.png')}
										/>
										<Text style={styles.rupeeamount} >{`₹`}</Text><Text style={styles.headerAmount}>{totalExpense}</Text>
									</View>
									<View style={styles.expsavBlock2}>
										<Image style={{ width: 13, height: 13, marginBottom: 2, transform: [{ rotate: '180deg' }] }}
											source={require('../../assets/arrow.png')}
										/>
										<Text style={styles.rupeeamount} >{`₹`}</Text><Text style={styles.headerAmount}>{totalSaving}</Text>
									</View>

								</View>
							</View>
						</View>
						<View style={styles.mtContainer}>
							<Text style={styles.allTransaction}>All TRANSACTIONS</Text>
							<View style={styles.monthContainer}>
								<TouchableOpacity onPress={() => toggleOpen(true)} style={styles.inputMonth}>
									<Text style={styles.inputMMYYText}>
										{month ? moment(month).format('MMMM YY') : "Select Month"}
									</Text>
									<Image style={{ width: 16, height: 16, marginBottom: 2, paddingRight: 10 }}
										source={require('../../assets/downArrow.png')}
									/>
								</TouchableOpacity>

								<Modal
									transparent
									animationType="fade"
									visible={isOpen}
									onRequestClose={() => {
										Alert.alert('Modal has been closed.');
									}}>
									<View style={styles.mmyyContainer}>
										<View style={styles.mmyyContent}>
											<MonthPicker
												selectedDate={month || new Date()}
												onMonthChange={onChangeMonth}
												swipable={true}
												selectedBackgroundColor='#7E0BFD'
											/>
											<TouchableOpacity
												style={styles.confirmButton}
												onPress={() => toggleOpen(false)}>
												<Text style={styles.confirmText}>Confirm</Text>
											</TouchableOpacity>
										</View>
									</View>
								</Modal>
							</View>
						</View>
						<View style={styles.listContainer}>
							{expenseData ? (
								expenseData.map(([key, item]) => (
									item.bill_type !== "income" && (
										<ExpenseList
											key={key}
											id={key}
											bill_type={item.bill_type}
											description={item.description}
											amount={item.amount}
											date={item.date}
											month={month}
										/>
									)
								))
							) : (
								<Text>No Expense available</Text>
							)}
						</View>


					</ScrollView>
				</> : <Text>error connecting to database</Text>}
		</View>

	);
}



const styles = StyleSheet.create({
	root: {
		backgroundColor: 'white',
		flex: 1,
		alignItems: 'center',
	},
	rectContainer: {
		alignItems: 'center',
	},
	rectangle2: {
		width: Dimensions.get('window').width * 0.9,
		aspectRatio: 1.819,
		marginTop: 25,
		marginHorizontal: '5%',
		flexShrink: 0,
		borderRadius: Math.round(Dimensions.get('window').width * 0.9 * 0.28),
		elevation: 15,
		backgroundColor: 'rgba(24, 22, 22, 1)',
		zIndex: 1000,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.25,
		shadowRadius: 15,
	},
	rupeeCurrenBalance: {
		color: 'rgba(255, 255, 255, 0.7)',
		fontSize: 30,
		fontStyle: 'normal',
		fontWeight: '400',
		paddingRight: 5,
	},
	currentBalanceView: {
		marginTop: '18%',
		flexDirection: 'row',
		alignItems: 'flex-end',
		paddingLeft: '10%',
	},
	currentBalanceText: {
		flexShrink: 0,
		color: 'rgba(255, 255, 255, 1)',
		//fontFamily: 'MontserratBold',
		fontSize: 40,
		fontStyle: 'normal',
		fontWeight: "bold",
	},
	inr: {
		color: 'rgba(255, 255, 255, 0.7)',
		//fontFamily: 'MontserratMedium',
		fontSize: 16,
		fontWeight: '400',
		paddingBottom: 15,
		paddingLeft: '16%'

	},
	savingExpenseContainer: {
		paddingLeft: '10%',
		flexDirection: 'row',
		paddingTop: '1%'
	},
	expsavBlock1: {
		flexDirection: 'row',
		alignItems: 'flex-end',

	},
	expsavBlock2: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		paddingLeft: 10
	},
	headerAmount: {
		color: 'white',
		//fontFamily: 'MontserratMedium',
		fontWeight: '400',
	},
	rupeeamount: {
		color: 'white',
		fontSize: 10,
		paddingRight: 3
	},
	allTransaction: {
		color: 'rgba(0, 0, 0, 1)',
		fontSize: 16,
		fontStyle: 'normal',
		fontWeight: '700',
		marginRight: 60,
	},
	mtContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		marginHorizontal: 30,
	},
	inputMonth: {
		backgroundColor: 'rgba(0,0,0,0)',
		paddingVertical: 12,
		marginVertical: 6,
		flexDirection: 'row',

	},
	inputMMYYText: {
		color: 'black',
		fontWeight: '400'

	},
	mmyyContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	mmyyContent: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginVertical: 70,
	},
	confirmButton: {
		padding: 14,
		marginTop: 10,
		marginBottom: 15,
		marginHorizontal: 60,
		borderRadius: 56,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	confirmText: {
		color: 'white',
	},
	listContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},

	////////////////////////////////////

});
