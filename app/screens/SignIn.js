import React from "react";
import { View, Text } from "react-native";
import { onSignIn } from "../auth";

export default class SignIn extends React.Component {
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

	login(){
		this.props.navigation.navigate('Home', {from: 'sign in'})
	}

	render(){
		return (
			<View style={{ flex: 1 }}>
				<Text>-</Text>
				<Text>--</Text>
				<Text>Page: Sign in</Text>
				<Text>--</Text>
				<Text onPress={() => {this.login()}}>
					Facebook Login
				</Text>
				<Text>-</Text>
				<Text onPress={()=>this.test()}>Click me</Text>
				<Text>-</Text>
				<Text onPress={()=>this.navState()}>Nav state</Text>
				<Text>-</Text>
			</View>
		)
	}
}