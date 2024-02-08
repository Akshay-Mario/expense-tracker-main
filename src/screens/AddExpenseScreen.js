import { StatusBar } from 'expo-status-bar'
import React, { useLayoutEffect, useState, TouchableOpacity } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Button, TextField } from 'react-native-ui-lib';
import DateTimePicker from '@react-native-community/datetimepicker'
import format from 'date-fns/format'
import { Picker } from '@react-native-picker/picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set } from "firebase/database";


//import {db} from '../firebase'
//import firebase from 'firebase'

export default function AddExpenseScreen() {

  const [submitLoading, setSubmitLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  // const formatDate = (dateString) => {
  //   const options = { month: 'long', year: 'numeric' };
  //   const formattedDate = `${new Date(dateString)
  //     .toLocaleDateString('en-US', options)
  //     .replace(/ /g, '_')}`;

  //   return formattedDate;
  // };

  const createExpense = async () => {
    try {
      if (description && amount && selDate && expenseType) {
        setSubmitLoading(true);
        const randomUUID = uuidv4().slice(-8);
        const formattedDate = selDate.getMonth() + 1 + '_' + selDate.getFullYear();
        //get username and check if logged in or not
        const value = await AsyncStorage.getItem('@isloggedIn_key');
        const username = await AsyncStorage.getItem('@username_key');
        if (value === 'true' && username) {
            const db = getDatabase();
            set(ref(db, 'expense/' + username + '/' + formattedDate + '/' + randomUUID), {
              amount: amount,
              bill_type: expenseType,
              date: selDate.getDate(),
              description: description
            });

            console.log('Expense added successfully');

            setAmount('');
            setDescription('');
            setSubmitLoading(false);
        }
        else {
          alert('Invalid Login');
          //setLoggedIn(false);
        }
        // Assuming 'expenses' is your Firebase Realtime Database node

      } else {
        alert('All fields are mandatory');
        setSubmitLoading(false);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('An error occurred while adding the expense.');
      setSubmitLoading(false);
    }
  };


  const clearInputFields = () => {
    alert('Created Successfully')
    setInput('')
    setAmount('')
    setSelDate(new Date())
    setExpenseType('expense')
    navigation.navigate('Home')
    setSubmitLoading(false)
  }
  // Date Picker
  const [selDate, setSelDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState('date')
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setSelDate(currentDate)
  }
  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }
  const showDatepicker = () => {
    showMode('date')
  }
  const result = format(selDate, 'dd/MM/yyyy')

  // Select Dropdown
  const [expenseType, setExpenseType] = useState('food')


  const renderPickerItem = (label, value) => (
    <Picker.Item
      label={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          <Text>{label}</Text>
        </View>
      )}
      value={value}
      key={value}
    />
  );


  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.inputContainer}>
        {/* <TextInput
          style={styles.input}
          placeholder='Add Text'
          value={input}
          onChangeText={(text) => setInput(text)}
        /> */}
        <TextField
          style={styles.input2}
          onChangeText={(text) => setDescription(text)}
          placeholder='Description*'
          value={description}
        />
        <TextField
          style={styles.input2}
          keyboardType='numeric'
          placeholder='Add Amount*'
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <Text
          style={styles.input2}
          placeholder='Select Date'
          value={result}
          onPress={showDatepicker}
        // editable={false}
        >
          {result ? result : new Date()}
        </Text>
        {show && (
          <DateTimePicker style={styles.datepicker}
            testID='dateTimePicker'
            value={selDate}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />
        )}
        <Picker
          selectedValue={expenseType}
          onValueChange={(itemValue, itemIndex) =>
            setExpenseType(itemValue)
          }
        >
          <Picker.Item label='🍕 Food & Drinks' value='food' />
          <Picker.Item label='⛽ Fuel' value='fuel' />
          <Picker.Item label='📶 Data' value='data' />
          <Picker.Item label='💳 Housing & Bills' value='rent' />
          <Picker.Item label='🥑 Groceries' value='groceries' />
          <Picker.Item label='🚑 Personal Care' value='personalcare' />
          <Picker.Item label='🎬 Subscription' value='subscription' />
          <Picker.Item label='💰 Savings' value='Savings' />
          <Picker.Item label='🚊 Commute' value='commute' />
          <Picker.Item label='🎒 Travel & Vacation' value='travel' />
          <Picker.Item label='🛒 Shopping' value='shopping' />
          <Picker.Item label='👀 Others' value='other' />
          <Picker.Item label='🤑 Salary' value='income' />

        </Picker>

        <Button
          style={(!description || !amount) ? styles.buttonDisabled : styles.button}
          label={submitLoading ? 'Adding Expense...' : 'Add Expense'}
          title='Add'
          onPress={createExpense}
          loading={submitLoading}
          disabled={!description || !amount}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  input2: {
    width: '100%',
    justifyContent: 'center',
    fontSize: 15,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    height: 40,
  },

  button: {
    width: 200,
    marginTop: 40,
    marginHorizontal: 40,
    backgroundColor: '#7E0BFD',
  },
  buttonDisabled: {
    width: 200,
    marginTop: 40,
    marginHorizontal: 40,
    backgroundColor: '#b3b1b1',
  },
  datepicker: {
    marginTop: 10,
  },
})