const { extend } = require("lodash")
const path = require("path")
const fs = require("fs")
const mammoth = require('mammoth')

let scraperInstance

const docx = async (command, context) => {
	
	let _path = path.resolve(scraperInstance.resolveValue(command.path, context))
	let buffer = fs.readFileSync(_path)
	let content =  mammoth.extractRawText({ buffer })

	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$content"
	context = await scraperInstance.executeOnce({into}, context, content)	
	return context

}

const docx2js = async (command, context, value) => {
	let result = await mammoth.extractRawText({ buffer: value }) 
	return result
}	
		


module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["docx"],
			_execute: docx
		},
		{
			name:["docx->js","transform.docx->js"],
			_execute: docx2js
		}
	]

}

