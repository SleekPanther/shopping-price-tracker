import React from "react"
import { View, Text } from "react-native"
// import { onSignIn } from "../auth"
import Expo, {Constants, Facebook} from 'expo'
import * as firebase from 'firebase'
import firebaseConnection from '../admin/firebaseSetup'
import facebookAppId from '../admin/facebookAppSetup'

export default class SignIn extends React.Component {
	constructor(props){
		super(props)

		this.state={
			uid: 'none'
		}
	}

	test(){
		console.log(this.props)
		console.log(this.state)
	}

	navState(){
		console.log(this.props.navigation.state.params)
	}

	async loginWithFacebook() {
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
			facebookAppId,
			{ permissions: ['public_profile'] }
		)

		if (type === 'success') {
			const credential = firebase.auth.FacebookAuthProvider.credential(token)
			console.log('fb credential', credential)

			// Sign in with credential from the Facebook user.
			firebase.auth().signInAndRetrieveDataWithCredential(credential)
				.then((userCredential)=> {
					console.log(userCredential.additionalUserInfo.username)
					firebase.auth().onAuthStateChanged(user => {
						if (user) {
							console.log('fb logged in uid', user.uid)
							this.props.navigation.navigate('Home', {user: user, source: 'Sign In'});
						} else {
							console.log('failed to log in')
							this.props.navigation.navigate('SignIn', {source: 'Sign In (fail)'});
						}
					})
				})
				.catch((error) => {
					console.log(error)
					// this.setState(prevState=>({messages: [this.state.messages, error]}))
				})
		}
	}

	render(){
		return (
			<View style={{ flex: 1 }}>
				<Text>-</Text>
				<Text>--</Text>
				<Text>Page: Sign in</Text>
				<Text>--</Text>
				<Text onPress={()=>{this.loginWithFacebook()}}>Facebook Login</Text>
				<Text>-</Text>
				<Text onPress={()=>this.test()}>Click me</Text>
				<Text>-</Text>
				<Text onPress={()=>this.navState()}>Nav state</Text>
				<Text>-</Text>
			</View>
		)
	}
}