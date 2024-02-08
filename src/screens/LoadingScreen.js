import { StyleSheet, Image } from "react-native";
import { Text, View } from "react-native-ui-lib";


export default function LoadingScreen() {


	return (
		<View style={styles.root}>
			<Image style={{ width: 300, height: 300, marginBottom: 2, paddingRight: 10 }}
				source={require('../../assets/splash.png')}
			/>
		</View>
	)
}


const styles = StyleSheet.create({

	root: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
		alignItems: 'center'
	},
});
