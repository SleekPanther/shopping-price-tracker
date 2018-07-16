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
} from 'react-native';
import {SelectPicker, DatePicker} from 'react-native-select-picker';

import * as firebase from 'firebase'
import firebaseConnection from './admin/firebaseSetup.js'		//get credentials file & connect

import CONSTANTS from './constants/constants.js'


export default class App extends React.Component {
	constructor(props){
		super(props)

		let now = new Date()
		this.buildTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

		this.databse = firebase.database()

		this.databse.ref().set({
			time: this.buildTime,
		})

		this.state = {
			text: 'initial', 
			currency: '--', 
			messages: [1, 2], 
		}

	}

	buttonPress(){
		this.databse.ref().set({
			text: this.state.text,
		})
	}


	render() {
		return (
			<View style={styles.container}>
				<View style={[styles.addNewContainer]}>
				<TextInput 
					style={[styles.inputBox, styles.thinBorder]}
					onChangeText = {(text)=> this.setState({text})}
					onSubmitEditing={(event)=>this.setState({text: event.nativeEvent.text})}
					value={this.state.text} />

				<SelectPicker 
					data={CONSTANTS.CURRENCIES}
					wrapHeight={100}
					wrapWidth={25}
					itemHeight={19}	//must match font size

					onValueChange={(currency, selectedIndex)=>this.setState({currency: currency})}
				/>
				<Text>{this.state.currency}</Text>
				
				</View>
				<TouchableHighlight underlayColor='yellow' style={[styles.button ]} onPress={() => this.buttonPress()}>
					<Text style={[styles.buttonText]}>Submit</Text>
				</TouchableHighlight>

				<Text>{this.state.text}</Text>
				{this.state.messages.map((message, index)=>{
					return <Text key={index}>{message}</Text>
				})}
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
	thinBorder:{
		borderWidth: StyleSheet.hairlineWidth, 
	}, 

	addNewContainer:{
		// flexDirection: 'row', 
		// justifyContent: 'center', 
	}, 

	inputBox:{
		fontSize: 19, 
		padding: 4, 
		paddingTop: 0, 
		paddingBottom: 0, 
	}, 

	button:{
		margin: 1, 
		padding: 3, 
		paddingTop: 0, 
		paddingBottom: 0, 
		alignItems: 'center', 
		borderWidth: 2, 
		borderRadius: 5, 
		backgroundColor: 'lightgray', 
	}, 
	buttonText:{
		fontSize: 15, 
		fontWeight: 'bold', 
	},
})