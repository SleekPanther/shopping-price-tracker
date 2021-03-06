import {StyleSheet, Platform} from 'react-native'
import Expo from 'expo'

const constants = {
	mainBackground: '#fff'
}

const styles = StyleSheet.create({
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
		justifyContent: 'flex-start',
	},
	row:{
		flexDirection: 'row', 
	}, 
	column:{
		flexDirection: 'column', 
	}, 
	relative:{
		position: 'relative', 
	}, 

	largeText:{
		fontSize: 45,
	},
	thinBorder:{
		borderWidth: StyleSheet.hairlineWidth, 
	}, 
	icon:{
		fontSize: 19, 
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