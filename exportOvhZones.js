const open = require('open')
const config = require('./config.json')
const OvhCredentials = require('ovh')({
	endpoint: config.END_POINT,
	appKey: config.APP_KEY,
	appSecret: config.APP_SECRET
	// consumerKey: config.CONSUMER_KEY
})
const {writeExport} = require('./diskUtils')
const dev = false // set to true if you want to try the script on only AMOUNT_OF_DOMAINS domains instead of all zones
const AMOUNT_OF_DOMAINS = 3

let OvhApi // will be set once consumerKey has been fetched
const zones = [],
	errors = []

//request credentials for the app
OvhCredentials.requestPromised('POST', '/auth/credential', {
	'accessRules': [
		{'method': 'GET', 'path': '/domain/*'}
	]
})
	.then(credential => {
		console.log('Opening your default browser...')
		console.log('Please login/authorize within the 10 next seconds :', credential.validationUrl)

		//open in default browser
		open(credential.validationUrl)

		OvhApi = require('ovh')({
			endpoint: config.END_POINT,
			appKey: config.APP_KEY,
			appSecret: config.APP_SECRET,
			consumerKey: credential.consumerKey
		})
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				//get all zones
				return resolve(OvhApi.requestPromised('GET', '/domain/zone'))
			}, 10000)
		})
	})
	.catch((err) => {
		//Return an error object like this {error: statusCode, message: message}
		console.error('Error getting credentials', err.message)
		// throw new Error('Error getting credentials' + err.message)
		process.exit(1)
	})
	.then(domains => {
		const amount = domains.length
		console.log('Retreived ' + amount + ' domains')

		if (dev) {
			domains.splice(AMOUNT_OF_DOMAINS, domains.length - AMOUNT_OF_DOMAINS) //keep only one domain during dev
			console.log('Working with ' + domains.length + ' domains', domains)
		}

		//reduce calls
		let counter = 0
		return domains.reduce((prevP, currentDomain) => {
			return prevP.then(([domaine, zoneData]) => {
				if (zoneData) {
					counter++
					console.log(`${counter}/${amount} - Zone fetched for ${domaine}`)
					zones.push({domaine, zoneData})
				}
				//fetch new stuff for currentDomain
				return Promise.all([Promise.resolve(currentDomain), fetchZoneForDomain(currentDomain)])
			})
		}, Promise.resolve([]))
			.then(([domaine, zoneData]) => {
				//last one
				if (zoneData) {
					if (dev)
						console.log('Zone fetched for ' + domaine)
					zones.push({domaine, zoneData})
					return zones
				}
			})
	})
	.catch((err) => {
		//Return an error object like this {error: statusCode, message: message}
		console.error('Error fetching zones ', err.message)
		// throw new Error('Error fetching zones' + err.message)
		process.exit(1)
	})
	.then(() => {
		return writeExport(zones)
	})
	.catch((err) => {
		console.error('Error writeExport ', err.toString())
		// throw new Error('Error writeExport ' + err.toString())
		process.exit(1)
	})
	.then(() => {
		console.log('Done')
		if (errors.length) {
			console.log(errors.length + ' errors : ')
			errors.forEach(error => console.log(' - ' + error))
		}
	})

const fetchZoneForDomain = zoneName => {
	return OvhApi.requestPromised('GET', `/domain/zone/${zoneName}/export`)
		.then((zoneData) => {
			return zoneData
		})
		.catch((err) => {
			//Return an error object like this {error: statusCode, message: message}
			console.error('Error fetching zone for domain ' + zoneName, err.message)
			errors.push('Error fetching zone for domain ' + zoneName + ' : ' + err.message)
			return null
		})
}
