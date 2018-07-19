import React from "react"
import { View, Text, ActivityIndicator } from "react-native"
import * as firebase from 'firebase'
import firebaseConnection from '../admin/firebaseSetup'

import styles from '../style/styles'

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
			<View style={styles.spinnerStyle}>
				<Text>-</Text>
				<Text>-</Text>
				<Text>Page: Loading</Text>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		)
	}
}