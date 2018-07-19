import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { onSignOut  } from "../auth";

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
		return (
			<View style={{ flex: 1 }}>
				<Text>Page: Help</Text>
				<Text>-</Text>
				<Text onPress={() => {
					// this.test()
					onSignOut().then(() => {
						let obj = {name: 'from help'}
						// navigate("SignedOut", obj)
						this.props.navigation.navigate('SignedOut', {name: 'OUT'})
					})}
					}>
					Log Out
				</Text>
				<Text>-</Text>
				<Text onPress={()=>this.test()}>Click me</Text>
				<Text>-</Text>
				<Text onPress={()=>this.navState()}>Nav state</Text>
			</View>
		)
	}
}