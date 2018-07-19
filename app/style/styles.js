import {StyleSheet, Platform} from 'react-native'
import Expo from 'expo'

const constants = {
	mainBackground: '#fff'
}

const styles = StyleSheet.create({
	spinnerStyle:{
		// flex: 1, 
	}, 
	appContainer:{
		flex: 1, 
	}, 
	statusBar: {
		backgroundColor: '#000',
		height: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight, 
	}, 
	container: {
		backgroundColor: constants.mainBackground,
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

export default styles