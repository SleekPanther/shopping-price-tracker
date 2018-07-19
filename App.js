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
import {SelectPicker, DatePicker} from 'react-native-select-picker'
import Expo, {Constants, Facebook} from 'expo'

import * as firebase from 'firebase'
import firebaseConnection from './admin/firebaseSetup'		//get credentials file & connect
import facebookAppId from './admin/facebookAppSetup'

import CONSTANTS from './constants/constants'

import styles from './style/styles'


export default class App extends React.Component {
	constructor(props){
		super(props)

		let now = new Date()
		this.buildTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`


		this.databse = firebaseConnection.database()

		this.focusNextField = this.focusNextField.bind(this)
		this.textInputs = {}

		this.state = {
			text: 'text1', 
			currency: '$$', 
			messages: ['msg1'], 
		}

		firebase.auth().onAuthStateChanged(user => {
			if (user != null) {
				console.log(user)
				this.setState(prevState =>({
					messages: [prevState.messages, 'logged in'], 
					loggedIn: true, 
					user: user, 
				}))
			} else {
				this.setState(prevState =>({
					messages: [prevState.messages, 'NOT in'], 
					loggedIn: false, 
				}))
			}
		})
	}

	focusNextField(id) {
		this.textInputs[id].focus()
	}

	buttonPress(){
		this.saveSomethingToDb()
	}

	saveSomethingToDb(){
		this.databse.ref('users/'+this.state.user.uid).set({
			time: this.buildTime,
		})
	}

	async loginWithFacebook() {
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
			facebookAppId,
			{ permissions: ['public_profile'] }
		)

		if (type === 'success') {
			const credential = firebase.auth.FacebookAuthProvider.credential(token)

			// Sign in with credential from the Facebook user.
			firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => {
				console.log(error)
				this.setState(prevState=>({messages: [this.state.messages, error]}))
			})
		}
	}

	loginWithEmail(){
		alert('Not implemented yet')
	}

	render() {
		return (
			<View style={[styles.appContainer]}>
				<View style={[styles.statusBar]}></View>
				<View style={[styles.container]}>
					<View style={[styles.addNewContainer]}>
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
									styles={[styles.pricePicker]}
									data={CONSTANTS.CURRENCIES}
									wrapHeight={80}
									wrapWidth={25}
									itemHeight={19}	//must match font size css

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
						<View style={[styles.box, styles.thinBorder]}>
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

					<View style={{flex:2}}>
						<TouchableHighlight underlayColor='yellow' style={[styles.button ]} onPress={() => this.buttonPress()}>
							<Text style={[styles.buttonText]}>Submit</Text>
						</TouchableHighlight>

						<TouchableHighlight underlayColor='yellow' style={[styles.button]} onPress={()=>this.loginWithFacebook()}>
							<Text style={[styles.buttonText]}>Facebook Login</Text>
						</TouchableHighlight>

						<TouchableHighlight underlayColor='yellow' style={[styles.button]} onPress={()=>this.loginWithEmail()}>
							<Text style={[styles.buttonText]}>Email Login</Text>
						</TouchableHighlight>

						<Text>{this.state.text}</Text>
						{this.state.messages.map((message, index)=>{
							return <Text key={index}>{message}</Text>
						})}
						<Text style={[styles.largeText]}>Built: {this.buildTime}</Text>
					</View>

				</View>
			</View>
		)
	}
}