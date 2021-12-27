const { keys, isString, isArray, set, get } = require("lodash")
const axios = require("axios")

let scraperInstance

const engineAxios = async (command, context) => {
	let apply = scraperInstance.resolveValue(command.apply, context)
	if(apply){
		context = await scraperInstance.executeOnce({apply}, context)
	}
	return context
}

const fetch = async (command, context) => {
	
	let request = scraperInstance.resolveValue(command.request, context)
	request = await scraperInstance.executeOnce({request}, context)
	// console.log(request)
	
	let response = await axios(request)
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$response"
	context = await scraperInstance.executeOnce({into}, context, response)	
	return context
}


const request = async (command, context) => {
	let props = keys(command)
	for(let i=0; i < props.length; i++){
		// console.log(props[i])
		command[props[i]] = scraperInstance.resolveValue(command[props[i]], context)
	}
	// console.log(command)
	return command
}

module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["axios"],
			_execute: engineAxios
		},
		{
			name: ["fetch"],
			_execute: fetch
		},
		{
			name: ["request"],
			_execute: request
		},
		

	]

}

