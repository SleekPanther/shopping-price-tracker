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
} from 'react-native'

import styles from '../style/styles'
import homeStyles from '../style/homeStyles'

import * as firebase from 'firebase'
import firebaseConnection from '../admin/firebaseSetup'


export default class Home extends React.Component {
	constructor(props){
		super(props)

		const user = this.props.navigation.getParam('user', null)
		this.state={
			uid: user ? user.uid : 'none', 
		}
	}

	async signOutUser(){
		console.log('signing out')
		try {
			await firebase.auth().signOut();
			this.props.navigation.navigate('SignIn', {source: 'Home'})
		} catch (e) {
			console.log('Error', e);
		}
		console.log('done signing out?')
	}

	test(){
		console.log(this.props)
		console.log(this.state)
	}

	navState(){
		console.log(this.props.navigation.state.params)
	}

	render(){
		const user = this.props.navigation.getParam('user', 'none')
		const uid = user.uid

		return (
			<View style={[styles.appContainer]}>
				<View style={[styles.statusBar]}></View>
				<View style={[styles.container]}>

					<Text style={[homeStyles.specialHome]}>Page: Home</Text>
					<Text>-</Text>
					<Text onPress={() => this.props.navigation.navigate("SignIn",{from:'home'})} >Go to Login</Text>
					<Text>-</Text>
					<Text onPress={()=>this.test()}>Click me</Text>
					<Text>-</Text>
					<Text onPress={()=>this.navState()}>Nav state</Text>
					<Text>-</Text>
					<Text onPress={()=>this.signOutUser()}>SIGN OUT</Text>
					<Text>-</Text>
					<Text>{`uid=${uid}`}</Text>
					<Text>{`uid STATE=${this.state.uid}`}</Text>

				</View>
			</View>
		)
	}
}