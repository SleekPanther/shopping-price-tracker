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
} from 'react-native';
import {SelectPicker, DatePicker} from 'react-native-select-picker';
import {Constants} from 'expo'

import * as firebase from 'firebase'
import firebaseConnection from './admin/firebaseSetup'		//get credentials file & connect
import facebookAppId from './admin/facebookAppSetup'

import CONSTANTS from './constants/constants'


export default class App extends React.Component {
	constructor(props){
		super(props)

		let now = new Date()
		this.buildTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`


		this.databse = firebaseConnection.database()
		// this.databse.ref().set({
		// 	time: this.buildTime,
		// })

		this.focusNextField = this.focusNextField.bind(this);
		this.textInputs = {}

		this.state = {
			text: facebookAppId, 
			currency: '$$', 
			messages: ['msg1'], 
		}

	}

	componentDidMount(){
		firebaseConnection.auth().onAuthStateChanged((user)=>{
			if(user){
				this.messages.push(user.uid)
			}
		})
	}

	focusNextField(id) {
		this.textInputs[id].focus();
	}

	buttonPress(){
		this.saveSomethingToDb()
	}

	// Listen for authentication state to change.
	//Created when mounting, not updated later?
	componentDidMount(){
		this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (user!=null) {
				console.log('not logged in')
				//navigate somewhere
			}
			else{
				console.log(user)
				saveSomethingToDb()
			}
		});
	}

	saveSomethingToDb(){
		this.databse.ref('users/'+'noah').set({
			time: this.buildTime,
		})
		// this.databse.ref('users/'+user.uid).set({
		// 	time: this.buildTime,
		// })
	}

	async loginWithFacebook() {
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
			facebookAppId,
			{ permissions: ['public_profile'] }
		);

		if (type === 'success') {
			const credential = firebase.auth.FacebookAuthProvider.credential(token);
			console.log('firebasse credential=', credential)

			// Sign in with credential from the Facebook user.
			firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => {
				console.log(error)
			});
		}
	}

	// loginWithGoogle

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

						<TouchableHighlight underlayColor='yellow' style={[styles.button]} onPress={()=>this.loginWithGoogle()}>
							<Text style={[styles.buttonText]}>Google Login</Text>
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

//export styles to another file
const styles = StyleSheet.create({
	appContainer:{
		flex: 1, 
	}, 
	statusBar: {
		backgroundColor: "#000",
		height: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight, 
	}, 
	container: {
		backgroundColor: '#fff',
		flex: 1,
		flexDirection: 'column', 
		justifyContent: 'center',
	},

	largeText:{
		fontSize: 45,
	},
	thinBorder:{
		borderWidth: StyleSheet.hairlineWidth, 
	}, 

	addNewContainer:{
		flex: 1/2, 
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center', 

		borderWidth: 1, 
		borderColor: '#f00',  
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
		// flex: .5, 
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