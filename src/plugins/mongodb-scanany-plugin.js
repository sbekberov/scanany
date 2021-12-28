const { extend } = require("lodash")
const mongo = require('mongodb').MongoClient

let scraperInstance

const engineMongo = async (command, context) => {
	
	let options = 	scraperInstance.resolveValue(command.options, context) || {}
	let uri = options.uri

	options = extend({
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, options
    )

    delete options.uri 
	
	let client  = await mongo.connect(uri, options)
	
	context.$client = client

	let apply = scraperInstance.resolveValue(command.apply, context)
	if(apply){
		context = await scraperInstance.executeOnce({apply}, context)
	}

	await client.close()

	delete context.$client

	return context

}

const listCollections = async (command, context) => {
	
	let db = scraperInstance.resolveValue(command.db, context)
	
	let response = await context.$client.db(db).listCollections().toArray()
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$response"
	context = await scraperInstance.executeOnce({into}, context, response)	
	return context

}

const aggregate = async (command, context) => {
	
	let _db = scraperInstance.resolveValue(command.db, context)
	let _collection = scraperInstance.resolveValue(command.collection, context)
	let _query = scraperInstance.resolveValue(command.query, context)
	
	let db = await context.$client.db(_db)
    let collection = await db.collection(_collection)
  	
	let response = await collection.aggregate(_query).toArray() 
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$response"
	context = await scraperInstance.executeOnce({into}, context, response)	
	return context

}

const find = async (command, context) => {
	
	let _db = scraperInstance.resolveValue(command.db, context)
	let _collection = scraperInstance.resolveValue(command.collection, context)
	let _query = scraperInstance.resolveValue(command.query, context)
	let _project = scraperInstance.resolveValue(command.project, context)
	console.log(_project)
	let db = await context.$client.db(_db)
    let collection = await db.collection(_collection)
  	
	let response = await collection.find(_query, {projection: _project}).toArray() 
	
	let into = scraperInstance.resolveValue(command.into || command.as, context) || "$response"
	context = await scraperInstance.executeOnce({into}, context, response)	
	return context

}




module.exports = {
	
	register: scraper => {
		scraperInstance = scraper
	},

	rules:[
		{
			name: ["mongo"],
			_execute: engineMongo
		},
		{
			name: ["collections","mongo.collections"],
			_execute: listCollections
		},
		{
			name: ["aggregate","mongo.aggregate"],
			_execute: aggregate
		},
		{
			name: ["find","mongo.find"],
			_execute: find
		}

	]

}

