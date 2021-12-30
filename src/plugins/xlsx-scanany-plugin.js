const { extend } = require("lodash")
const path = require("path")
const xlsx = require('node-xlsx').default

let scraperInstance

const _xlsx = async (command, context) => {
	
	let _path = path.resolve(scraperInstance.resolveValue(command.path, context))

	const jsonOpts = {
	  header: 1,
	  defval: '',
	  blankrows: true,
	  raw: false,
	  dateNF: 'd"/"m"/"yyyy' // <--- need dateNF in sheet_to_json options (note the escape chars)
	}

	let content =  xlsx.parse(_path, jsonOpts)

	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$content"
	context = await scraperInstance.executeOnce({into}, context, content)	
	return context

}

const xlsx2js = async (command, context, value) => {
	const jsonOpts = {
	  header: 1,
	  defval: '',
	  blankrows: true,
	  raw: false,
	  dateNF: 'd"/"m"/"yyyy' // <--- need dateNF in sheet_to_json options (note the escape chars)
	}
	
	let result = xlsx.parse(value, jsonOpts) 
	return result
}	

		


module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["xlsx"],
			_execute: _xlsx
		},
		{
			name:["xlsx->js","transform.xlsx->js"],
			_execute: xlsx2js 
		}
	]

}

