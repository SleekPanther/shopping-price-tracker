//https://stackoverflow.com/a/2998822/8050097
//Or if you know you'd never be using more than X number of zeros this might be better. This assumes you'd never want more than 10 digits.
export const leftPadZeros = (num, desiredLength) => {
	var s = '000000000' + num
	return s.substr(s.length-desiredLength)
}

export const compareString = (string1, string2)=>{
	string1 = string1.toLowerCase()
	string2 = string2.toLowerCase()
	if(string1 < string2){
		return -1
	}
	else if(string1 > string2){
		return 1
	}
	return 0
}

export const compareStringReverse = (string1, string2)=>{
	string1 = string1.toLowerCase()
	string2 = string2.toLowerCase()
	if(string1 < string2){
		return 1	//opposite of normal
	}
	else if(string1 > string2){
		return -1	//opposite of normal
	}
	return 0
}