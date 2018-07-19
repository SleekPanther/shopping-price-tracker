import React from "react"
import { createRootNavigator } from "./router"
// import { isSignedIn } from "./auth"

import { View, Text } from "react-native";

import * as firebase from 'firebase'
import firebaseConnection from './admin/firebaseSetup'		//get credentials file & connect
import facebookAppId from './admin/facebookAppSetup'

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			signedIn: false,
			checkedSignIn: false
		}
		// console.log('constructor')
		// result = isSignedIn()
		// if(isSignedIn()){
		// 	console.log('YAY IN')
		// 	this.state = {
		// 		signedIn: true,
		// 		checkedSignIn: true
		// 	}
		// }
		// else{
		// 	console.log('false state')
		// 	this.state = {
		// 		signedIn: false,
		// 		checkedSignIn: false
		// 	}
		// }
	}

	isSignedIn(){
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({signedIn: true, checkedSignIn: true, user: user})
				console.log('logged in')
				return true
			}
			return false
		})
	}

	componentDidMount() {
		console.log('mount')
		if(this.isSignedIn()){
			// this.setState({signedIn: true, checkedSignIn: true})
		}
		console.log('done mounting')
		// .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
		// .catch(err => alert("An error occurred"))
	}

	render() {
		const { checkedSignIn, signedIn, user } = this.state
		// return (
		// 		<View><Text>-</Text><Text>-</Text>
		// 		<Text>{signedIn ? "true": "false"}</Text></View>
		// 	)

		// if(signedIn){
		// 	return (
		// 		<View><Text>-</Text><Text>-</Text>
		// 		<Text>SIGNED IN</Text></View>
		// 	)
		// }
		// else{
		// 	return (
		// 		<View><Text>-</Text><Text>-</Text>
		// 		<Text>NOT</Text></View>
		// 	)
		// }
		

		// If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
		if (!checkedSignIn) {
			return null
		}

		const Layout = createRootNavigator(false)
		return <Layout />
	}
}