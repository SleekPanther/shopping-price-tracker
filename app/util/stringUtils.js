//https://stackoverflow.com/a/2998822/8050097
//Or if you know you'd never be using more than X number of zeros this might be better. This assumes you'd never want more than 10 digits.
export const leftPadZeros = (num, desiredLength) => {
	var s = '000000000' + num
	return s.substr(s.length-desiredLength)
}
