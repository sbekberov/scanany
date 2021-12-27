const { extend } = require("lodash")
const mysql = require('mysql2/promise')

let scraperInstance

const engineMysql = async (command, context) => {
	
	let options = scraperInstance.resolveValue(command.options, context)
	let pool  = await mysql.createPool(options)
	
	context.$pool = pool

	let apply = scraperInstance.resolveValue(command.apply, context)
	if(apply){
		context = await scraperInstance.executeOnce({apply}, context)
	}
	pool.end()

	delete context.$pool
	return context

}

const execute = async (command, context) => {
	
	let sql = scraperInstance.resolveValue(command.sql, context)
	let options = scraperInstance.resolveValue(command.options, context)
	
	let [response] = await context.$pool.execute(extend({sql}, options))
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$response"
	context = await scraperInstance.executeOnce({into}, context, response)	
	return context
}

module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["mysql"],
			_execute: engineMysql
		},
		{
			name: ["execute"],
			_execute: execute
		}

	]

}

