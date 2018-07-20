import React from "react"
import { ScrollView, Text, Linking, View } from "react-native"
// import { onSignOut  } from "../auth";

import styles from '../style/styles'
import helpStyles from '../style/helpStyles'


export default class Help extends React.Component {
	constructor(props){
		super(props)
	}

	test(){
		console.log(this.props)
		console.log(this.state)
	}

	navState(){
		console.log(this.props.navigation.state.params)
	}

	render(){
		const {navigate} = this.props.navigation
				// <Text onPress={() => onSignOut().then(() => this.props.navigation.navigate("SignedOut"))}>

				// <Text onPress={() => {
				// 	onSignOut().then(() => {
				// 		this.props.navigation.navigate('SignIn', {name: 'OUT'})
				// 	})}
				// 	}>
				// 	Log Out
				// </Text>
		return (
			<View style={[styles.appContainer]}>
				<View style={[styles.statusBar]}></View>
				<View style={[styles.container]}>

					<Text>Page: Help</Text>
					<Text>-</Text>
					<Text onPress={()=>this.test()}>Click me</Text>
					<Text>-</Text>
					<Text onPress={()=>this.navState()}>Nav state</Text>

				</View>
			</View>
		)
	}
}