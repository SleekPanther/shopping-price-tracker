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

		this.focusNextField = this.focusNextField.bind(this);
		this.textInputs = {}

		this.state = {
			text: 'initial', 
			currency: '$$', 
			messages: [1, 2], 
		}

	}

	focusNextField(id) {
		this.textInputs[id].focus();
	}

	buttonPress(){
		this.databse.ref().set({
			text: this.state.text,
		})
	}


	render() {
		return (
			<View style={[styles.container]}>
				<View style={[styles.addNewContainer, styles.thinBorder]}>
					<View style={[styles.thinBorder, styles.box]}>
						<Text>Item</Text>
						<TextInput 
							style={[styles.inputBox, styles.thinBorder]}
							onChangeText = {(text)=> this.setState({text})}
							ref={input=>{this.textInputs['itemName']=input}}
							onSubmitEditing={(event)=>{
								this.setState({text: event.nativeEvent.text})
								this.focusNextField('price')
							}}
							blurOnSubmit={false}
							returnLeyLabel='Next'
							returnKeyType='next'
							value={this.state.text} />
					</View>

					<View style={[styles.thinBorder, styles.box, styles.priceContainer]}>
						<Text style={[styles.priceLabel]}>Price</Text>
						<View style={[styles.row, styles.priceInnerContainer]}>
							<SelectPicker 
								styles={[styles.addNewComponent, styles.pricePicker]}
								data={CONSTANTS.CURRENCIES}
								wrapHeight={80}
								wrapWidth={25}
								itemHeight={19}	//must match font size

								onValueChange={(currency, selectedIndex)=>this.setState({currency: currency})}
							/>
							<TextInput 
								style={[styles.inputBox, styles.thinBorder, styles.priceInput]}
								onChangeText = {(price)=> this.setState({price})}
								keyboardType = 'numeric'
								ref={input=>{this.textInputs['price']=input}}
								onSubmitEditing={(event)=>{
									this.setState({price: event.nativeEvent.price})
									this.focusNextField('store')
								}}
								blurOnSubmit={false}
								returnLeyLabel='Next'
								returnKeyType='next'
								value={this.state.price} />
						</View>
					</View>
					<View style={[styles.box]}>
						<Text>Store</Text>
						<TextInput 
								style={[styles.inputBox, styles.thinBorder]}
								onChangeText = {(store)=> this.setState({store})}
								ref={input=>{this.textInputs['store']=input}}
								onSubmitEditing={(event)=>{
									this.setState({store: event.nativeEvent.store})
								}}
								value={this.state.store} />
					</View>

				</View>

				<View>
					<TouchableHighlight underlayColor='yellow' style={[styles.button ]} onPress={() => this.buttonPress()}>
						<Text style={[styles.buttonText]}>Submit</Text>
					</TouchableHighlight>

					<Text>{this.state.text}</Text>
					{this.state.messages.map((message, index)=>{
						return <Text key={index}>{message}</Text>
					})}
					<Text style={[styles.largeText]}>Built: {this.buildTime}</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1,
		flexDirection: 'column', 
		justifyContent: 'center',
		alignItems: 'center',
	},
	largeText:{
		fontSize: 45,
	},
	thinBorder:{
		borderWidth: StyleSheet.hairlineWidth, 
	}, 

	addNewContainer:{
		flex: 1/5, 
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		// alignItems: 'center', 
	}, 
	box:{
		flex: 1, 
		flexDirection: 'column', 
	}, 
	row:{
		flexDirection: 'row', 
	}, 
	column:{
		flexDirection: 'column', 
	}, 
	priceContainer:{
		flex: .5, 
	}, 
	priceInnerContainer:{
		alignItems: 'center', 
		marginTop: -27, 
	}, 
	priceLabel:{
		marginLeft: 26, 
	}, 
	pricePicker:{
		flex: 1, 
	}, 
	priceInput:{
		flex:1, 
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