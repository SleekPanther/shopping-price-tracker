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
import { Container, Header, Content, Button, Form, Item, Picker, Input, Label, Icon } from 'native-base'
import Collapsible from 'react-native-collapsible'

import styles from '../style/styles'
import homeStyles from '../style/homeStyles'

import * as firebase from 'firebase'
import firebaseConnection from '../admin/firebaseSetup'

import {leftPadZeros} from '../util/stringUtils'

import CONSTANTS from '../constants/constants'


export default class Home extends React.Component {
	constructor(props){
		super(props)

		const now = new Date()
		this.buildTime = `${leftPadZeros(now.getHours(), 2)}:${leftPadZeros(now.getMinutes(), 2)}:${leftPadZeros(now.getSeconds(), 2)}`


		this.databse = firebase.database()

		const user = this.props.navigation.getParam('user', null)
		this.state={
			uid: user ? user.uid : 'none', 
			addItemVisible: true, 

			newItemName: 'name-'+this.buildTime, 
			newItemCurrency: CONSTANTS.CURRENCIES[0], 
			newItemPrice: '10.90', 
			newItemStore: 'costco', 

			//editItemName, currency price store etc
		}
	}

	async signOutUser(){
		console.log('signing out')
		try {
			await firebase.auth().signOut();
			this.props.navigation.navigate('SignIn', {source: 'Home'})
		} catch (e) {
			console.log('Error', e);
		}
		console.log('done signing out?')
	}

	toggleAddItemVisiblity(){
		this.setState(prevState=>({
			addItemVisible : !prevState.addItemVisible
		}))
		console.log('toggling')
	}

	clearNewItem(){
		this.setState({
			newItemName: '', 
			newItemCurrency: CONSTANTS.CURRENCIES[0], 
			newItemPrice: '', 
			newItemStore: '', 
		})
	}

	saveNewItemToDb(){
		//must check null item name 1st OR ELSE IT KILLS ALL ITEMS IN FIREBASE

		this.databse.ref(`users/${this.state.uid}/items/${this.state.newItemName}`).set({
			itemName: this.state.newItemName, 
			currency: this.state.newItemCurrency, 
			price: this.state.newItemPrice, 
			store: this.state.newItemStore, 
		})
	}


	test(){
		console.log(this.props)
		console.log(this.state)
	}

	navState(){
		console.log(this.props.navigation.state.params)
	}

	render(){
		const user = this.props.navigation.getParam('user', 'none')
		const uid = user.uid
		console.log(this.state)

		return (
			<View style={[styles.appContainer]}>
				<View style={[styles.statusBar]}></View>
				<Container style={[styles.container]}>
					<Content>

						<Button success onPress={()=>this.toggleAddItemVisiblity()}>
	 						<Text>Add Item Toggle</Text>
	 					</Button>

	 					<Form style={[!this.state.addItemVisible && {display: 'none'}]}>
	 						<View style={[styles.row]}>
								<Item regular floatingLabel style={[homeStyles.horizontalInput]}>
									<Label>Item</Label>
									<Input value={this.state.newItemName}
										onChangeText={(newItemName)=> this.setState({newItemName})} />
								</Item>
								<Item picker style={[homeStyles.currencyPicker]}>
									<Picker
										mode='dropdown'		//dialogs are stupid
										selectedValue={this.state.newItemCurrency}
										iosIcon={<Icon name='ios-arrow-down-outline' />}
										style={{ width: undefined }}
										onValueChange={(newItemCurrency)=>this.setState({newItemCurrency})}
										>
										{
											CONSTANTS.CURRENCIES.map((currency, index)=>{
												return <Picker.Item label={currency} value={currency} key={index} />
											})
										}
									</Picker>
								</Item>
								<Item success floatingLabel style={[homeStyles.newPriceInput]}>
									<Label>Price</Label>
									<Input keyboardType='numeric'
										value={this.state.newItemPrice}
										onChangeText={(newItemPrice)=> this.setState({newItemPrice})} />
								</Item>
								<Item regular floatingLabel last style={[homeStyles.horizontalInput]}>
									<Label>Store</Label>
									<Input value={this.state.newItemStore}
										onChangeText={(newItemStore)=> this.setState({newItemStore})} />
								</Item>
							</View>

							<View style={[styles.row]}>
								<Button iconLeft primary onPress={()=>this.saveNewItemToDb()}>
									<Icon name='md-add' />
									<Text>Add</Text>
								</Button>
								<Button iconLeft danger onPress={()=>this.clearNewItem()}>
									<Icon name='md-close' />
									<Text>Clear</Text>
								</Button>
							</View>
	 					</Form>

						<Text style={[homeStyles.specialHome]}>Page: Home</Text>
						<Text>{`Built ${this.buildTime}`}</Text>
						<Text>-</Text>
						<Text onPress={() => this.props.navigation.navigate('SignIn',{from:'home'})} >Go to Login</Text>
						<Text>-</Text>
						<Text onPress={()=>this.test()}>Click me</Text>
						<Text>-</Text>
						<Text onPress={()=>this.navState()}>Nav state</Text>
						<Text>-</Text>
						<Text onPress={()=>this.signOutUser()}>SIGN OUT</Text>
						<Text>-</Text>
						<Text>{`uid=${uid}`}</Text>
						<Text>{`uid STATE=${this.state.uid}`}</Text>

					</Content>
				</Container>
			</View>
		)
	}
}