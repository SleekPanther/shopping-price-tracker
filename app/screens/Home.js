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
import {adminFBUid} from '../admin/hardcoded-users'

import {leftPadZeros, compareString, compareStringReverse, capitalizeFirstLetter} from '../util/StringUtils'

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

const defaultStore = 'Uncategorized'
const defaultPrice = 0

export default class Home extends React.Component {
	constructor(props){
		super(props)

		const now = new Date()
		this.buildTime = `${leftPadZeros(now.getHours(), 2)}:${leftPadZeros(now.getMinutes(), 2)}:${leftPadZeros(now.getSeconds(), 2)}`


		this.existingItemsDataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1!==row2})

		const user = this.props.navigation.getParam('user', null)
		this.state={
			// uid: user ? user.uid : 'none', 
			uid: adminFBUid,	//skip loading page & login stage
			addItemVisible: true, 

			newItemName: 'name-'+this.buildTime, 
			newItemCurrency: CONSTANTS.CURRENCIES[0], 
			newItemPrice: '10.90', 
			newItemStore: 'Costco', 

			existingItems: existingItems, 
			stores: ['default store'], 
			filteredStores: ['filtered default'], 

			//editItemName, currency price store etc

			sortBy: 'itemName', 
			sortAscending: true, 

			showStoreSuggest: false,
		}
	}

	componentDidMount(){
		// let thisOld = this	//save current this for async?

		//change to child_added & always trust the user device instead of databse?
		//maybe have an child_added listener and then an initial once() call to populate stuff

		//items changed listener
		firebase.database().ref(`users/${this.state.uid}/items/`).on('value', (items)=>{
			let newExistingItems = []
			items.forEach(item=>{
				newExistingItems.push({
					itemName: item.key, 	//firebase stored the item name as the key
					currency: item.val().currency, 
					price: item.val().price, 
					store: item.val().store, 
				})
			})
			const {sortBy, sortAscending} = this.state
			this.setState({existingItems: this.filterGroupAndSort(newExistingItems, sortBy, sortAscending)})
		})

		//Stores listener
		firebase.database().ref(`users/${this.state.uid}/stores/`).on('value', (storesReturned)=>{
			let newStores = []
			storesReturned.forEach(store=>{
				newStores.push(store.key)
			})
			const {newItemStore} = this.state
			this.setState({
				stores: newStores, 
				filteredStores: this.getFilteredSugggestions(newStores, newItemStore), 
			})
		})
	}

	filterGroupAndSort(newExistingItems, sortBy, sortAscending){
		this.sort(newExistingItems, sortBy, sortAscending)
		return newExistingItems
	}
	
	sort(items, sortBy, sortAscending){
		if(sortBy === 'itemName'){
			if(sortAscending){
				items.sort((item1, item2)=>compareString(item1.itemName, item2.itemName))
			}
			else{
				items.sort((item1, item2)=>compareStringReverse(item1.itemName, item2.itemName))
			}
		}
		else if(sortBy === 'store'){
			if(sortAscending){
				items.sort((item1, item2)=>compareString(item1.store, item2.store))
			}
			else{
				items.sort((item1, item2)=>compareStringReverse(item1.store, item2.store))
			}
		}
		else if(sortBy === 'price'){
			if(sortAscending){
				items.sort((item1, item2)=>item1.price-item2.price)
			}
			else{
				items.sort((item1, item2)=>item2.price-item1.price)
			}
		}
		else if(sortBy === 'unit price'){
			
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
			addItemVisible: !prevState.addItemVisible
		}))
	}

	toggleSortOrder(){
		this.setState(prevState=>({
			sortAscending: !prevState.sortAscending, 
			existingItems: this.filterGroupAndSort(prevState.existingItems, prevState.sortBy, !prevState.sortAscending), 	//negated again since async might mess things up
		}))
	}

	changeSortBy(sortBy){
		this.setState(prevState=>({
			sortBy: sortBy, 
			existingItems: this.filterGroupAndSort(prevState.existingItems, sortBy, prevState.sortAscending), 	//not async this time
		}))
	}

	clearNewItemFields(){
		this.setState({
			newItemName: '', 
			newItemCurrency: CONSTANTS.CURRENCIES[0], 
			newItemPrice: '', 
			newItemStore: '', 
			filteredStores: this.state.stores,	//reset filtering so stores dropdown displays all opotions again
		})
	}

	handleStoreChange(storeText){
		const {stores} = this.state
		this.setState({
			newItemStore: storeText, 
			filteredStores: this.getFilteredSugggestions(stores, storeText), 
		})
	}

	getFilteredSugggestions(list, search){
		return list.filter(item=> {
			return item.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1
		})
	}

	saveNewItemToDb(){
		//must check null item name 1st OR ELSE IT KILLS ALL ITEMS IN FIREBASE
		//& check uid not null
		if(!this.state.newItemName){
			alert("NO ITEM NAME!")
			return
		}

		//price should be trimmed & remove non-numeric with regeex while typing

		let store = this.state.newItemStore.trim()
		if(store==''){
			store=defaultStore
		}
		store = capitalizeFirstLetter(store)

		firebase.database().ref(`users/${this.state.uid}/items/${this.state.newItemName}`).set({
			currency: this.state.newItemCurrency, 
			price: this.state.newItemPrice, 
			store: store, 
		})

		if(!this.state.stores.some(aStore => aStore.toLowerCase()===store.toLowerCase())){		//check store is new before adding
			//also add to state stores?	DB listener probably already catches it
			firebase.database().ref(`users/${this.state.uid}/stores/`).update({
				[store] : true, 
			})
		}

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

		let {stores} = this.state
		let storeIndex = -1		//initialize to not found value
		for(let i=0; i<stores.length; i++){
			if(stores[i].toLowerCase() === item.store.toLowerCase()){
				storeIndex=i
				break
			}
		}
		if(storeIndex !== -1){
			stores.splice(storeIndex, 1)	//remove 1 store at the index
			await firebase.database().ref(`users/${this.state.uid}/stores/${item.store}`).remove()
		}

		await firebase.database().ref(`users/${this.state.uid}/items/${item.itemName}`).remove()

		this.setState({
			existingItems: newExistingItems, 
			stores: stores, 
		})
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
		console.log('State\n', this.state)

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
										onChangeText={(newItemPrice)=> this.setState({newItemPrice})}
									/>
								</Item>
								<View style={[homeStyles.horizontalInput]}>
									<Item regular floatingLabel>
										<Label>Store</Label>
										<Input value={this.state.newItemStore}
											onChangeText={(newItemStore)=> this.handleStoreChange(newItemStore)}
											onFocus={()=>{this.setState({showStoreSuggest: true})}}
											onBlur={()=>{this.setState({showStoreSuggest: false})}}
										/>
									</Item>
									<View style={[styles.relative]}>
										<View style={[homeStyles.storeSuggestContainer]}>
											{this.state.showStoreSuggest && this.state.filteredStores.map((store, index)=> {
												return (
													<TouchableHighlight underlayColor='yellow' onPress={() => this.setState({newItemStore: store})}>
														<Text key={index}>{store}</Text>
													</TouchableHighlight>
												)
											})}
										</View>
									</View>
								</View>
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

	 					<Form >
		 					<View style={[styles.row]}>
		 						<Text style={[styles.horizontalInput]}>Sort by</Text>
		 						<Item picker style={[homeStyles.horizontalInput]}>
									<Picker
										mode='dropdown'
										selectedValue={this.state.sortBy}
										iosIcon={<Icon name='ios-arrow-down-outline' />}
										style={{ width: undefined }}
										onValueChange={(sortBy)=>this.changeSortBy(sortBy)}
										>
										<Picker.Item label='Item' value='itemName' />
										<Picker.Item label='$' value='price' />
										<Picker.Item label='$ unit' value='unit price' />
										<Picker.Item label='Store' value='store' />
									</Picker>
								</Item>
								<Icon  onPress={()=>this.toggleSortOrder()} 
									name={
										this.state.sortAscending ? 'md-arrow-up': 'md-arrow-down'
									}/>
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