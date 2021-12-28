const _ = require("lodash")
const moment = require("moment")
// const md5 = require("md5")
const uuid = require("uuid").v4

module.exports = {
	
	rules: [

		{
			name:["uuid"],
			_execute: async (command, context, value) => uuid()
		},
		
		// {
		// 	name:["md5"],
		// 	_execute: async (command, context, value) => md5(value)
		// },

		{
			name:["toString"],
			_execute: async (command, context, value) => value.toString()
		},

		{
			name:["json.parse"],
			_execute: async (command, context, value) => JSON.parse(value)
		},

		{
			name:["json.stringify"],
			_execute: async (command, context, value) => JSON.stringify(value, null, " ")
		},

		{
			name:["float"],
			_execute: async (command, context, value) => Number.parseFloat(value)
		},

		{
			name:["int"],
			_execute: async (command, context, value) => Number.parseInt(value)
		},

		{
			name:["date"],
			_execute: async (command, context, value) => {
				if(_.isString(command)) return new Date(value)
				if( command.now ) return new Date() 
			}
		},

		{
			name:["boolean"],
			_execute: async (command, context, value) => /^true$/.test(value)
		},

		{
			name:["moment.format"],
			_execute: async (command, context, value) => moment(new Date(value)).format(command)
		},

		{
			name:["moment.date"],
			_execute: async (command, context, value) => moment(value, command.format).toDate()
		},


		{
			name:[
				"lodash.camelCase",
				"lodash.capitalize",
				"lodash.escape",
				"lodash.kebabCase",
				"lodash.lowerCase",
				"lodash.lowerFirst",
				"lodash.snakeCase",
				"lodash.startCase",
				"lodash.toLower",
				"lodash.toUpper",
				"lodash.trim",
				"lodash.trimEnd",
				"lodash.trimStart",
				"lodash.truncate",
				"lodash.unescape",
				"lodash.upperCase",
				"lodash.upperFirst",
				"lodash.words",

				"lodash.entries",
				"lodash.invert",
				"lodash.keys",
				"lodash.values",
				"lodash.toPairs",
				"lodash.size"
			],
			
			_execute: async (command, context, value) => {
				let method = command.split(".")[1]
				return _[method](value)
			}
		}

	]
}