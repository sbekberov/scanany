const { extend } = require("lodash")
const path = require("path")
const fs = require('fs');
const pdf = require('pdf-parse');

let scraperInstance

const _pdf = async (command, context) => {
	
	let _path = path.resolve(scraperInstance.resolveValue(command.path, context))
	let buffer = fs.readFileSync(_path)
	
	let content =  await pdf(buffer)

	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$content"
	context = await scraperInstance.executeOnce({into}, context, content)	
	return context

}

const pdf2js = async (command, context, value) => {
	let result = await pdf(value) 
	return result
}	



module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["pdf"],
			_execute: _pdf
		},
				{
			name:["pdf->js","transform.pdf->js"],
			_execute: pdf2js 
		}

	]

}

