import React from 'react'
import { Platform, StatusBar } from 'react-native'
import {
	createStackNavigator,
	createBottomTabNavigator,
	createSwitchNavigator, 
} from 'react-navigation'
import { FontAwesome } from 'react-native-vector-icons'

import SignIn from './screens/SignIn'
import Home from './screens/Home'
import Help from './screens/Help'
import Loading from './screens/Loading'

// export const SignedOut = createStackNavigator({
// 	// SignUp: {
// 	// 	screen: SignUp,
// 	// 	navigationOptions: {
// 	// 		title: 'Sign Up',
// 	// 		headerStyle
// 	// 	}
// 	// },
// 	SignIn: {
// 		screen: SignIn,
// 		navigationOptions: {
// 			title: 'Sign In',
// 			headerStyle
// 		}
// 	}
// })

// export const SignedIn = createBottomTabNavigator(
// 	{
// 		Home: {
// 			screen: Home,
// 			navigationOptions: {
// 				tabBarLabel: 'Home',
// 				tabBarIcon: ({ tintColor }) => (
// 					<FontAwesome name='home' size={20} color={tintColor} />
// 				)
// 			}
// 		},
// 		Help: {
// 			screen: Help,
// 			navigationOptions: {
// 				tabBarLabel: 'Help',
// 				tabBarIcon: ({ tintColor }) => (
// 					<FontAwesome name='question-circle' size={20} color={tintColor} />
// 				)
// 			}
// 		}
// 	},
// 	{
// 		tabBarOptions: {
// 			style: {
// 				paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
// 			}
// 		}
// 	}
// )

export const createRootNavigator = () => {
	return createSwitchNavigator(
		{
			Loading:{
				screen: Loading
			}, 
			SignIn: {
				screen: SignIn
			}, 
			Home: {
				screen: Home
			},
			Help: {
				screen: Help
			},
		},
		{
			initialRouteName: 'Loading'
		}
	)
}