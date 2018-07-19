import { AsyncStorage } from "react-native"


import * as firebase from 'firebase'
import firebaseConnection from './admin/firebaseSetup'		//get credentials file & connect
import facebookAppId from './admin/facebookAppSetup'


export const USER_KEY = "auth-demo-key"

export const onSignIn = () => AsyncStorage.setItem(USER_KEY, "true")

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY)

export const isSignedIn = ()=>{
	firebase.auth().onAuthStateChanged((user) => {
		// console.log('user', user)
		if (user) {
			console.log('logged in auth file')
			return true
		}
		return false
	})

	// return new Promise((resolve, reject) => {
	// 	AsyncStorage.getItem(USER_KEY)
	// 	.then(res => {
	// 		if (res !== null) {
	// 			resolve(true)
	// 		} else {
	// 			resolve(false)
	// 		}
	// 	})
	// 	.catch(err => reject(err))
	// })
}