const { keys, isString, isArray, set, get } = require("lodash")


let scraperInstance


const puppeteer = async (command, context) => {
	context.$puppeteer = require("puppeteer")
	
	command.apply = scraperInstance.resolveValue(command.apply, context)
	
	if(command.apply){
		context = await scraperInstance.executeOnce({apply:command.apply}, context)
	}
	delete context.$puppeter
	return context
}

const launch = async (command, context) => {
	
	command._as = scraperInstance.resolveValue(command.as, context) || "$browser"
	let options = scraperInstance.resolveValue(command.options, context) || "$browser"
	
	let browser = await context.$puppeteer.launch(options)

	context = await scraperInstance.executeOnce({as:command._as}, context, browser)	
	return context
}


const newPage =  async (command, context) => {
	
	
	let browser = 	scraperInstance.resolveValue(command, context) 
					|| 
					scraperInstance.resolveValue({$ref:"$browser"}, context)
	
	let page = await browser.newPage(context.options)
	
	command._as = scraperInstance.resolveValue(command.as, context) || "$page"
	context = await scraperInstance.executeOnce({as:command._as}, context, page)	
	
	return context
}


const _goto = async (command, context) => {
	
	let page = 	scraperInstance.resolveValue(command, context) 
				|| 
				scraperInstance.resolveValue({$ref:"$page"}, context)
	
	let options = scraperInstance.resolveValue(command.options, context)
	let url = scraperInstance.resolveValue(command.url, context)
	await page.goto(url, options)
	return context

} 

const once = async (command, context) => {
	
	let page = 	scraperInstance.resolveValue(command, context) 
				|| 
				scraperInstance.resolveValue({$ref:"$page"}, context)
	
	let selector = scraperInstance.resolveValue(command.select, context)
	await page.waitForSelector(selector)
	let selection = await page.$(selector)

	let apply = scraperInstance.resolveValue(command.apply)
	
	if(apply){
		await scraperInstance.executeOnce({map: apply}, context, selection)
	}
		
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$selection"
	context = await scraperInstance.executeOnce({into}, context, selection)	
	return context
}


const all = async (command, context) => {
	
	let page = 	scraperInstance.resolveValue(command, context) 
				|| 
				scraperInstance.resolveValue({$ref:"$page"}, context)

	let selector = scraperInstance.resolveValue(command.select, context)
	await page.waitForSelector(selector)
	let selection = await page.$$(selector)	
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$selection"
	context = await scraperInstance.executeOnce({into}, context, selection)	
	
	return context
}



const close = async (command, context) => {
	
	let instance = 	scraperInstance.resolveValue(command, context)
	// console.log(instance)
	await instance.close()
	// if(instance) {
	// 	await instance.close()
	// } else {
	// 	if(context.$page && !context.$page.isClosed()){
	// 		await context.$page.close()
	// 	}
	// 	await context.$browser.close()
	// }

	return context
}


const pageUrl = async (command, context, value) => await value.url()
const pageTitle = async (command, context, value) => await value.title()
const pageContent = async (command, context, value) => await value.content()
const pageMetrics = async (command, context, value) => await value.metrics()
const pageCookies = async (command, context, value) => await value.cookies()


const nodeText = async (command, context, value) => await value.evaluate(n => n.textContent)
const nodeHtml = async (command, context, value) => await value.evaluate(n => n.outerHTML)

const nodeClasses = async (command, context, value) => {
	value = await value.evaluate( n => n.className)
	value = value.split(" ").filter(c => c)
	return value
}	

const nodeAttributes = async (command, context, value) => {
	
	if(isString(command)){
		command = await value.evaluate( e => e.getAttributeNames())
	} 

	command = (isArray(command)) ? command : [command]
	let result = {}
	for( let i=0; i < command.length; i++){
		result[command[i]] = await value.evaluate( (n, name) => n.getAttribute(name), command[i] )
	}
	
	return result
}	



module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["page.url"],
			_execute: pageUrl
		},
		{
			name: ["page.title"],
			_execute: pageTitle
		},
		{
			name: ["page.content"],
			_execute: pageContent
		},
		{
			name: ["page.metrics"],
			_execute: pageMetrics
		},
		{
			name: ["page.cookies"],
			_execute: pageCookies
		},
		{
			name: ["puppeteer"],
			_execute: puppeteer
		},
		{
			name: ["launch"],
			_execute: launch
		},
		{
			name: ["new-page"],
			_execute: newPage
		},
		{
			name: ["goto"],
			_execute: _goto
		},
		{
			name: ["once"],
			_execute: once
		},
		{
			name: ["all"],
			_execute: all
		},
		
		{
			name: ["close", "puppeteer.close"],
			_execute: close
		},

				{
			name:[
				"text",
				"node.text"
			],
			_execute: nodeText
		},

		{
			name:[
				"html",
				"node.html"
			],
			_execute: nodeHtml
		},

		{
			name:[
				"class","classes",
				"node.class", "node.classes"
			],
			_execute: nodeClasses
		},

		{
			name:[
				"attributes",
				"node.attributes"
			],
			_execute: nodeAttributes
		}

	]

}

