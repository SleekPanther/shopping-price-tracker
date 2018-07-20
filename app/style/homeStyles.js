import {StyleSheet} from 'react-native'



const homeStyles = StyleSheet.create({
	specialHome:{
		fontSize: 20, 
	}, 

	addNewItemContainer:{
		flexDirection: 'row', 
		// justifyContent: 'space-between', 
		// alignItems: 'center', 

		// borderWidth: 1, 
		// borderColor: '#f00',  
	}, 
	//left padding/margin on floating inputs
	horizontalInput:{
		flex: 1, 
	}, 
	currencyPicker:{
		flex: .4, 
	}, 
	newPriceInput:{
		flex: .6, 
	}, 


	box:{
		flex: 1, 
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
})
export default homeStyles