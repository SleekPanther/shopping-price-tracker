import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";


export default class Home extends React.Component {
	constructor(props){
		super(props)
		this.state={
			home: 'yo home', 
		}
	}

	test(){
		console.log(this.props)
		console.log(this.state)
	}

	navState(){
		console.log(this.props.navigation.state.params)
	}

	render(){
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text>Page: Home</Text>
				<Text>-</Text>
				<Text onPress={() => this.props.navigation.navigate("SignedOut",{from:'home'})} >Go to Login</Text>
				<Text>-</Text>
				<Text onPress={()=>this.test()}>Click me</Text>
				<Text>-</Text>
				<Text onPress={()=>this.navState()}>Nav state</Text>
			</View>
		)
	}
}