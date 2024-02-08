import React, { useEffect } from 'react';
import { StyleSheet, Image, Platform } from 'react-native'; // import Text
import { View, Text } from 'react-native-ui-lib';
import { labelBillType } from '../constants';
import moment from 'moment';
import { billTypeImagePath } from '../constants';


export default function ExpenseList({ id, bill_type, description, amount, date, month }) {

    const imagePath = billTypeImagePath[bill_type];

    useEffect(() => {
        //console.log(require(billTypeImagePath["food"]));
    }, []);

    return (
        <View style={styles.listItemContainer}>
            <View style={styles.innerContainer}>
                <View style={styles.categoryImage}>
                    <Image style={styles.categoryImages}
                        source={imagePath} />
                </View>
                <View style={styles.innerContainer2}>
                    <View>
                        <Text style={styles.category} >
                            {labelBillType[bill_type]}
                        </Text>
                        <Text style={styles.description} >
                            {description}
                        </Text>
                    </View>
                    <View style={styles.moneyList}>
                        <Text style={styles.category} >
                            {(bill_type == "Savings"? "+" : "-" )+`₹${amount}`}
                        </Text>
                        <Text style={styles.description} >
                            {date+'/'}
                            {month ? moment(month).format('MM/YY'): "Invalid Date"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',

	},
	innerContainer2: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'center',
		width: '79%',
		paddingLeft: 10,
	},
	moneyList: {
		alignItems: 'flex-end',
	},
	categoryImage: {
		backgroundColor: "#7E0BFD",
		padding: 10,
		borderRadius: 16,
		...Platform.select({
			android: {
				padding: 10 // Adjust the padding value for Android
			},
		}),
	},
	categoryImages: {
		height: 32,
		width: 32,
		...Platform.select({
			android: {
				height: 25,
				width: 25,
				// Adjust the padding value for Android
			},
		}),
	},
	listItemContainer: {
		width: '90%',
		flexShrink: 0,
		borderRadius: 20,
		padding: 8,
		backgroundColor: 'rgba(243, 243, 243, 1)',
        marginBottom:10,
	},
	category: {
		fontWeight: '600',
		fontSize: 20,
		...Platform.select({
			android: {
				fontSize: 16 // Adjust the padding value for Android
			},
		}),

	},
	description: {
		color: 'gray',
		...Platform.select({
			android: {
				fontSize: 11 // Adjust the padding value for Android
			},
		}),
	},
});

