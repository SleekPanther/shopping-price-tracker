import React from 'react'
import {
	StyleSheet,
	Text,
	View,
	AppRegistry,
	StatusBar,
	Image, 
	Dimensions, 
	TextInput, 
	TouchableHighlight, 
	TouchableOpacity, 
	Platform, 
} from 'react-native';
import {SelectPicker, DatePicker} from 'react-native-select-picker';
import {Constants, Expo} from 'expo'

import * as firebase from 'firebase'
import firebaseConnection from '../admin/firebaseSetup'		//get credentials file & connect
import facebookAppId from '../admin/facebookAppSetup'
import androidGoogleClientId from '../admin/googleAdminSetup'

import CONSTANTS from '../constants/constants'

export default class LoginScreen extends React.Component{
	static navigationOptions = {
		title: 'Login', 
	}

	 logInWithGoogle() {
		console.log('loggin in')
		// try {
		// 	const result = await Expo.Google.logInAsync({
		// 		androidClientId: androidGoogleClientId,
		// 		// iosClientId: YOUR_CLIENT_ID_HERE,
		// 		scopes: ['profile', 'email'],
		// 	});

		// 	if (result.type === 'success') {
		// 		console.log(result)
		// 		return result.accessToken;
		// 	} else {
		// 		return {cancelled: true};
		// 	}
		// } catch(e) {
		// 	console.log(e)
		// 	return {error: true};
		// }
	}

	render(){
		const {navigate} = this.props.navigation
		return (
			<View>
				<Text onPress={()=>navigate('Main')}>Go 2 Main</Text>
				<TouchableHighlight underlayColor='yellow' onPress={()=>this.loginWithGoogle.bind(this)}>
					<Text>Google Login</Text>
				</TouchableHighlight>
			</View>
		)
	}
}