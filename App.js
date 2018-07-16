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
} from 'react-native';

import * as firebase from 'firebase'
import firebaseConnection from './admin/firebaseSetup.js'		//get credentials file & connect


export default class App extends React.Component {
	constructor(props){
		super(props)

		let now = new Date()
		this.buildTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

		this.databse = firebase.database()

		this.databse.ref().set({
			time: this.buildTime,
		})

		// let oldVal = 
		this.state = {
			text: 'initial', 
		}
	}

	buttonPress(){
		this.databse.ref().set({
			text: this.state.text,
		})
	}

				// <Text>{this.state.old}</Text>
	render() {
		return (
			<View style={styles.container}>
				<TextInput 
					onChangeText = {(text)=> this.setState({text})}
					value={this.state.text} />
				<TouchableHighlight underlayColor='yellow' style={[styles.button ]} onPress={() => this.buttonPress()}>
					<Text style={[styles.buttonText]}>Submit</Text>
				</TouchableHighlight>
				<Text style={[styles.largeText]}>Built: {this.buildTime}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	largeText:{
		fontSize: 45,
	}, 
})