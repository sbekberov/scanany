const { keys, isString, isArray, set, get } = require("lodash")
const _ = require("lodash")
const moment = require("moment")

let scraperInstance


// var vm = require("vm");
// let _ = require("lodash");
// let moment = require("moment")


// var execute = function(scraperInstance, js, context, value){
//             const sandbox = {}
//             sandbox.$context = context
//             sandbox._ = _;
//             sandbox.moment = moment
//             sandbox.Buffer = Buffer
//             sandbox.atob = require("atob")
//             sandbox.btoa = require("btoa")
//             sandbox.decodeURIComponent = decodeURIComponent
//             sandbox.encodeURIComponent = encodeURIComponent
//             sandbox.Promise = Promise
//          	sandbox.$scraperInstance = scraperInstance
//          	sandbox.$value = value
         	   
//             const script = new vm.Script(js);
//             const context = new vm.createContext(sandbox);
//             script.runInContext(context);
// }




const engineJs = async (command, context, value) => {
	let script = scraperInstance.resolveValue(command, context)
	
	if(script){
		let rule = eval (`(${script})`)
		context = await rule(command, context, value)
	}
	return context
}



module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["js"],
			_execute: engineJs
		}
	]

}

