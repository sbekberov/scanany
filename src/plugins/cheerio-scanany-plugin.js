const { keys, isString, isArray, set, get, extend } = require("lodash")
const cheerio = require("cheerio")


// (data, scraper)=> {
//     $ = cheerio.load(data.html)
    
//     let title = $('div.tgme_channel_info_header_title > span').text()
//     let description = $('div.tgme_channel_info_description').html()
//     let image = $('div.tgme_channel_info > div.tgme_channel_info_header > i > img').attr("src") 
    
//     let lastMessages = []
//     $('div.tgme_widget_message_bubble').each( (index, element) => {
//         $(element).find("br").before("\n").remove()
//         let text = $(element).find("div.tgme_widget_message_text").text().replace(/[\u2000-\uffff]+/g, " ")
//         let html = $(element).find("div.tgme_widget_message_text").html()
//         let publishedAt =  moment($(element).find("time").attr("datetime")).format("YYYY-MM-DD hh:mm:ss") 
        
//         lastMessages.push({
//             type:"telegram",
//             url:data.url,
//             metadata:{
//                 scraper,
//                 channel:{
//                     name: `@${last(data.url.split("/"))}`,
//                     title,
//                     description,
//                     image
//                 },
//                 html,
//                 text,
//                 publishedAt
//             },
//             md5: md5(text),
//             createdAt: moment(new Date()).format("YYYY-MM-DD hh:mm:ss") 
//         })
//     })

//     return lastMessages
// }



let scraperInstance


const engineCheerio = async (command, context) => {
	context.$cheerio = cheerio
	
	command.apply = scraperInstance.resolveValue(command.apply, context)
	
	if(command.apply){
		context = await scraperInstance.executeOnce({apply:command.apply}, context)
	}
	delete context.$cheerio
	return context
}

const load = async (command, context) => {
	let content = scraperInstance.resolveValue(command, context) || ""

	let result = {
		$: cheerio.load(content)
	}

	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$dom"
	context = await scraperInstance.executeOnce({into}, context, result)	
	return context	
}


const once = async (command, context) => {
	
	let dom = 	scraperInstance.resolveValue(command, context) 
				|| 
				scraperInstance.resolveValue({$ref:"$dom"}, context)
	
	let selector = scraperInstance.resolveValue(command.select, context)
	
	let element = await dom.$(selector).get(0)
	element = extend({}, dom, dom.$(element))
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$selection"
	context = await scraperInstance.executeOnce({into}, context, element)	
	return context
}

const all = async (command, context) => {
	
	let dom = 	scraperInstance.resolveValue(command, context) 
				|| 
				scraperInstance.resolveValue({$ref:"$dom"}, context)
	
	let selector = scraperInstance.resolveValue(command.select, context)
	
	let result = []
	dom.$(selector).each((index, element) => {
		result.push(extend({}, dom, dom.$(element)))
	})
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$selection"
	context = await scraperInstance.executeOnce({into}, context, result)	
	return context
}


const nodeText = (command, context, value) => value.text()
const nodeHtml = (command, context, value) => {
	const outerHTML  = element => {
	    var index = element.index();
	    var parent = element.parent().clone();
	    var child = parent.children()[index];
	    parent.empty();
	    parent.append(child);
	    return parent.html();
	}
	return outerHTML(value)
}	

const nodeClasses = async (command, context, value) => {
	value = await value.attr("class")
	value = value.split(" ").filter(c => c)
	return value
}	

const nodeAttributes = async (command, context, value) => {
	
	if(isString(command)){
		command = keys(value['0'].attribs)
	} 

	command = (isArray(command)) ? command : [command]
	let result = {}
	for( let i=0; i < command.length; i++){
		result[command[i]] = value.attr(command[i]) 
	}
	
	return result
}	



module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["cheerio"],
			_execute: engineCheerio
		},
		{
			name: ["load"],
			_execute: load
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

