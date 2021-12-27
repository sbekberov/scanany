
const xml2js = require('xml2js');
const YAML = require("js-yaml")
const csvjson = require("csvjson")
const json2csv = require("json2csv")
const { toPairs, extend } = require("lodash")
const pdf = require('pdf-parse')
const xlsx = require('node-xlsx').default
const mammoth = require('mammoth')



module.exports = {
	
	rules: [

		{
			name:["docx->js","transform.docx->js"],
			_execute: async (command, context, value) => {
				let result = await mammoth.extractRawText({ buffer: value }) 
				return result
			}	
		},

		{
			name:["xlsx->js","transform.xlsx->js"],
			_execute: async (command, context, value) => {
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
		},

		{
			name:["pdf->js","transform.pdf->js"],
			_execute: async (command, context, value) => {
				let result = await pdf(value) 
				return result
			}	
		},

		{
			name:["xml->js","transform.xml->js"],
			_execute: async (command, context, value) => {
				let options = command.options
				let result = await xml2js.parseStringPromise(value, options) 
				return result
			}	
		},

		{
			name:["js->xml","transform.js->xml"],
			_execute: async (command, context, value) => {
				let builder = new xml2js.Builder();
				return builder.buildObject(value);
			}	
		},

		{
			name:["yaml->js","transform.yaml->js"],
			_execute: async (command, context, value) => {
				return YAML.load(value)
			}	
		},

		{
			name:["js->yaml","transform.js->yaml"],
			_execute: async (command, context, value) => {
				return YAML.dump(value)		
			}	
		},


		{
			name:["csv->js", "transform.csv->js"],
			_execute: async (command, context, value) => {

				let options = command.options || {}
			
				let csvOptions = {
		          delimiter: options.delimiter || ";",
		          quote: options.quote || null
		        }
		        
			    let encode = options.encode || "utf8";

		        let data = new Buffer(value, encode).toString().trim();
			    data = csvjson.toObject(data, csvOptions);
			    return data
			}	
		},

		{
			name:["js->csv", "transform.js->csv"],
			_execute: async (command, context, value) => {

				let options = command.options || {}

				let csvOptions = {
		          delimiter: options.delimiter || ";"
		        }
		        
			    let encode = options.encode || "utf8";
			    
			    let fields = toPairs(value[0]).map(item => item[0])

        		// let data  = new Buffer( json2csv(extend({ data: value, fields: fields}, csvOptions)), encode)
		        const parser = new json2csv.Parser(extend({ fields: fields},csvOptions));
  
  		        let data  = parser.parse(value)
		        
			    return data
			}	
		}

	]
}