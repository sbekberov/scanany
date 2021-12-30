const Parser = require('rss-parser')

let scraperInstance

const rss = async (command, context) => {
	let options = scraperInstance.resolveValue(command.options, context)
	let parser = (options) ? new Parser(options) : new Parser()
	let url = scraperInstance.resolveValue(command.url, context)				
	let feed = await parser.parseURL(url)				
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$feed"
	context = await scraperInstance.executeOnce({into}, context, feed)	
	return context
}

const transform = async (command, context, value) => {
	let parser = new Parser()
	let result = await parser.parseString(value)				
	return result
}	



module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["rss"],
			_execute: rss
		},
		{
			name:["rss->js","transform.rss->js"],
			_execute: transform
		}
	]

}

