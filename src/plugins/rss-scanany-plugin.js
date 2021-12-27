const Parser = require('rss-parser')

let scraperInstance

const engineRss = async (command, context) => {

	let apply = scraperInstance.resolveValue(command.apply, context)
	if(apply){
		context = await scraperInstance.executeOnce({apply}, context)
	}
	return context
}

const init = async (command, context) => {
	let options = scraperInstance.resolveValue(command.options, context)
	let result = (options) ? new Parser(options) : new Parser()
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$parser"
	context = await scraperInstance.executeOnce({into}, context, result)	
	return context
}


const load = async (command, context) => {
	let parser = 	scraperInstance.resolveValue(command, context) 
					|| 
					scraperInstance.resolveValue({$ref:"$parser"}, context)
	let url = scraperInstance.resolveValue(command.url, context)				
	let feed = await parser.parseURL(url)				
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$feed"
	context = await scraperInstance.executeOnce({into}, context, feed)	
	return context	
}	


module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["rss"],
			_execute: engineRss
		},
		{
			name: ["load","rss.load"],
			_execute: load
		},
		{
			name: ["init","rss.init"],
			_execute: init
		}

	]

}

