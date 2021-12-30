const { extend } = require("lodash")
const fs = require("fs")
const path = require("path")

let scraperInstance

const file = async (command, context) => {
	
	let _path = path.resolve(scraperInstance.resolveValue(command.path, context))

	let content =  fs.readFileSync(_path)

	let transform = scraperInstance.resolveValue(command.transform, context)
	let result = content
	
	if(transform) {
		result = await scraperInstance.executeOnce({transform}, context, result)
	}
	

	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$content"
	context = await scraperInstance.executeOnce({into}, context, result)	
	return context

}


module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["file"],
			_execute: file
		}
	]

}

