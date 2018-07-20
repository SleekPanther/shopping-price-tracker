import React from "react"
import { View, Text, ActivityIndicator } from "react-native"

import styles from '../style/styles'
import loadingStyles from '../style/loadingStyles'

import * as firebase from 'firebase'
import firebaseConnection from '../admin/firebaseSetup'


export default class SignIn extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount(){
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				console.log('uid', user.uid)
				this.props.navigation.navigate('Home', {user: user, source: 'Loading'});
			} else {
				this.props.navigation.navigate('SignIn', {source: 'Loading'});
			}
		});
	}

	render(){
		return (
			<View style={[styles.appContainer]}>
				<View style={[styles.statusBar]}></View>
				<View style={[styles.container]}>

					<Text>-</Text>
					<Text>-</Text>
					<Text>Page: Loading</Text>
					<ActivityIndicator style={styles.spinner} size="large" color="#00f" />

				</View>
			</View>
		)
	}
}