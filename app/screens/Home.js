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
	ListView, 
} from 'react-native'
import { Container, Header, Content, Button, Form, Item, Picker, Input, Label, Icon, List, ListItem } from 'native-base'

import Collapsible from 'react-native-collapsible'	//probably unused

import styles from '../style/styles'
import homeStyles from '../style/homeStyles'

import * as firebase from 'firebase'
import firebaseConnection from '../admin/firebaseSetup'

import {leftPadZeros} from '../util/stringUtils'

import CONSTANTS from '../constants/constants'

let existingItems = [
	{
		"itemName": "DEFAULT Item",
		"currency": "$",
		"price": "00",
		"store": "dollar",
	}, 
	{
		"itemName": "two",
		"currency": "$",
		"price": "00",
		"store": "dd",
	}, 
	{
		"itemName": "THREE",
		"currency": "$",
		"price": "00",
		"store": "b",
	}
]

export default class Home extends React.Component {
	constructor(props){
		super(props)

		const now = new Date()
		this.buildTime = `${leftPadZeros(now.getHours(), 2)}:${leftPadZeros(now.getMinutes(), 2)}:${leftPadZeros(now.getSeconds(), 2)}`


		this.existingItemsDataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1!==row2})

		const user = this.props.navigation.getParam('user', null)
		this.state={
			uid: user ? user.uid : 'none', 
			addItemVisible: true, 

			newItemName: 'name-'+this.buildTime, 
			newItemCurrency: CONSTANTS.CURRENCIES[0], 
			newItemPrice: '10.90', 
			newItemStore: 'costco', 

			existingItems: existingItems, 

			//editItemName, currency price store etc
		}
	}

	componentDidMount(){
		// let thisOld = this	//save current this for async?

		//items changed listener
		firebase.database().ref(`users/${this.state.uid}/items/`).on('value', (items)=>{
			let newExistingItems = []
			items.forEach((item)=>{
				newExistingItems.push({
						itemName: item.key, 	//firebase stored the item name as the key
						currency: item.val().currency, 
						price: item.val().price, 
						store: item.val().store, 
				})
			})
			this.setState({existingItems: newExistingItems})
		})
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
	}

	clearNewItemFields(){
		this.setState({
			newItemName: '', 
			newItemCurrency: CONSTANTS.CURRENCIES[0], 
			newItemPrice: '', 
			newItemStore: '', 
		})
	}

	saveNewItemToDb(){
		//must check null item name 1st OR ELSE IT KILLS ALL ITEMS IN FIREBASE
		//& check uid not null

		firebase.database().ref(`users/${this.state.uid}/items/${this.state.newItemName}`).set({
			currency: this.state.newItemCurrency, 
			price: this.state.newItemPrice, 
			store: this.state.newItemStore, 
		})

		this.clearNewItemFields()		//clear fields once added
	}

	_renderRow(item){
		return(
			<ListItem >
		 		<Text>{item.itemName}</Text>
		 		<Text>{` (${item.currency}${item.price}) `}</Text>
		 		<Text>{`from ${item.store}`}</Text>
		 	</ListItem>
		)
	}

	_renderLeftHiddenRow(item){
		return(
			<Button full onPress={() => this.edit(item)}>
				<Icon type='Entypo' name='edit' style={[styles.icon]} />
			</Button>
		)
	}

	_renderRightHiddenRow(item, secId, rowId, rowMap){
		return(
			<Button full danger >
				<Icon name="md-trash" onPress={() => this.deleteRow(secId, rowId, rowMap, item)}/>
			</Button>
		)
	}

	edit(item){
		alert('implement edit', item.name)
	}

	async deleteRow(secId, rowId, rowMap, item) {
		//Remove from UI before database call, otherwise async messes things up
		rowMap[`${secId}${rowId}`].props.closeRow()
		let newExistingItems = [...this.state.existingItems]
		newExistingItems.splice(rowId, 1)	//start at specific row & remove 1 element
		this.setState({existingItems: newExistingItems})

		await firebase.database().ref(`users/${this.state.uid}/items/${item.itemName}`).remove()
	}

	logMe(thing){
		console.log(thing)
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
		// console.log('State\n', this.state)

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
								<Item regular floatingLabel style={[homeStyles.horizontalInput, styles.margin0]}>
									<Label >Item</Label>
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
								<Button iconLeft danger onPress={()=>this.clearNewItemFields()}>
									<Icon name='md-close' />
									<Text>Clear</Text>
								</Button>
							</View>
	 					</Form>

	 					<List
		 					enableEmptySections
		 					dataSource={this.existingItemsDataSource.cloneWithRows(this.state.existingItems)}
		 					renderRow={item => this._renderRow(item)}
		 					renderLeftHiddenRow={item => this._renderLeftHiddenRow(item)}
		 					renderRightHiddenRow={(item, secId, rowId, rowMap) => this._renderRightHiddenRow(item, secId, rowId, rowMap)}
		 					leftOpenValue={50}
		 					rightOpenValue={-50}
	 					/>

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