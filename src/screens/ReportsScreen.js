import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, ScrollView, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { getDatabase, ref, onValue } from "firebase/database";
import app from '../../firebase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ComponentsColors } from 'react-native-ui-lib';
import { billTypeColor } from '../constants';

export default function Analytics() {

	const [month, onChangeMonth] = useState(new Date());
	const [pieArray, setPieArray] = useState(Array(13).fill(1));
	const [percentileExpenditure, setpercentileExpenditure] = useState(0);
	const [incomeValue, setIncome] = useState(0);

	const fetchMonthWiseExpenseNIncome = async () => {
		try {
			//Check login status
			const isLoggedIn = await AsyncStorage.getItem('@isloggedIn_key');
			const _username = await AsyncStorage.getItem('@username_key')
			const monthData = (new Date(month).getMonth() + 1) + '_' + new Date(month).getFullYear();
			if (_username && isLoggedIn) {
				const db = getDatabase(app);
				const dbRef = ref(db, 'expense/' + _username + '/' + monthData);
				await new Promise((resolve, reject) => {
					onValue(dbRef, (snapshot) => {
						const data = snapshot.val();
						sumUpBilll_types(data);
						resolve();
					}, (error) => {
						reject(error);
					});
				});
			}
			else {
			}
		} catch (e) {
			console.error('Error msg :', e);
		}
	};

	useEffect(() => {
		fetchMonthWiseExpenseNIncome();
	}, []);

	function sumUpBilll_types(amount) {

		let arrayAmount = Array(13).fill(0);
		let income = 0;

		Object.keys(amount).forEach((key) => {

			if (amount[key].bill_type != 'income') {
				arrayAmount[12] += Number(amount[key].amount);
			}
			else if (amount[key].bill_type == 'income') {
				setIncome(Number(amount[key].amount));
				income = Number(amount[key].amount);
				arrayAmount[12] -= Number(amount[key].amount);
			}

			switch (amount[key].bill_type) {
				case "food":
					arrayAmount[0] += Number(amount[key].amount);
					break;
				case "fuel":
					arrayAmount[1] += Number(amount[key].amount);
					break;

				case "data":
					arrayAmount[2] += Number(amount[key].amount);
					break;
				case "rent":
					arrayAmount[3] += Number(amount[key].amount);

					break;
				case "groceries":
					arrayAmount[4] += Number(amount[key].amount);

					break;
				case "personalcare":
					arrayAmount[5] += Number(amount[key].amount);

					break;
				case "subscription":
					arrayAmount[6] += Number(amount[key].amount);

					break;
				case "Savings":
					arrayAmount[7] += Number(amount[key].amount);

					break;
				case "commute":
					arrayAmount[8] += Number(amount[key].amount);

					break;
				case "travel":
					arrayAmount[9] += Number(amount[key].amount);

					break;
				case "shopping":
					arrayAmount[10] += Number(amount[key].amount);
					break;
				case "other":
					arrayAmount[11] += Number(amount[key].amount);

					break;				// additional cases as needed
				default:
					console.log("default")
			}

		})
		arrayAmount[12] = arrayAmount[12] * -1
		setpercentileExpenditure(Math.floor(((income - arrayAmount[12]) / income) * 100));
		setPieArray(arrayAmount);

	}


	const ListItem = ({ customKey, item }) => (
		<View style={styles.legendContainer}>
			<View style={styles.labelPart}>
				<View style={{ backgroundColor: item.color, width: 16, height: 16 }}></View>
				<Text style={styles.lengendTxt}>{item.label}</Text>
			</View>
			<View>
				<Text style={styles.lengendTxt}>{Math.floor((pieArray[customKey] / incomeValue) * 100)}% /{pieArray[customKey]}</Text>
			</View>
		</View>
	);

	const widthAndHeight = 300;
	const series = pieArray;
	const sliceColor = [
		"#000000",
		"#6B6B6B",
		"#B4B4B4",
		"#F76B6B",
		"#986BF7",
		"#F76BE1",
		"#FF33FF",
		"#7AE59E",
		"#D2F159",
		"#F9D16A",
		"#6DB0EE",
		"#D7D7D7",
		"#ffffff",
	];

	return (
		<ScrollView style={styles.root}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headertxt}>ANALYTICS CHART</Text>

				</View>
				<View style={styles.pieContainer}>
					<PieChart
						widthAndHeight={widthAndHeight}
						series={pieArray}
						sliceColor={sliceColor}
						coverRadius={0.85}
						coverFill={'#FFF'}
					/>
				</View>
				<View style={styles.infoText}>
					<Text>Monthly Summary</Text>
					<Text>Spend: {percentileExpenditure}%</Text>
				</View>
				<View styles={styles.legendContainer}>
					<View style={styles.headerTable}>
						<Text>Category</Text>
						<Text style={styles.pecText}>Percentile/Amount</Text>
					</View>
					<View >
						{Object.values(billTypeColor).map((item, index) => (
							<ListItem key={index} customKey={index} item={item} />
						))}
					</View>
				</View>
			</View>
		</ScrollView>
	)

}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: 'white'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		marginTop: '10%',
		marginHorizontal: '5%'
	},
	title: {
		fontSize: 24,
		margin: 10,
	},
	header: {
		flex: 1,
		width: '100%',
		justifyContent: "left",

	},
	headertxt: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	pieContainer: {
		marginTop: '8%',
		transform: [{ rotate: "90deg" }]
	},
	infoText: {
		justifyContent: 'center',
		alignItems: 'center',
		transform: [
			{ translateY: -150 }
		]
	},
	headerTable: {
		width: '100%',
		height: 30,
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	legendColor: {
		height: 10,
		width: 10,
	},
	labelPart: {
		flexDirection: 'row',
	},
	lengendTxt: {
		paddingLeft: 6,
	},
	legendContainer: {
		flexDirection: 'row',
		padding: 8,
		justifyContent: 'space-between',
		marginHorizontal: 10,
	},
	pecText: {
		paddingLeft: 120
	},
})