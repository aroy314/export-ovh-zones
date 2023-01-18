const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

/**
 * writeData
 * writes the string on a file on disk
 * @param dataString
 * @param filename
 */
const writeData = (dataString, filename) => {
	const fileUrl = path.join(process.cwd(), filename) //Current Working Directory + filename
	return new Promise((resolve, reject) => {
		fs.writeFile(fileUrl, dataString, (err) => {
			if (err) {
				console.error('Error writing file ' + fileUrl, err.toString())
				return reject('Error writing file ' + fileUrl + ' ' + err.toString())
			}
			//console.log('The file was saved as ' + fileUrl)
			return resolve(true)
		})
	})
}

const checkAccess = name =>
	new Promise((resolve, reject) => {
		try {
			fs.access(name, fs.constants.F_OK, function (err) {
				if (err) reject(err)
				else resolve()
			})
		} catch (err) {
			reject(err)
		}
	})

const pad2 = (n) => n.toString().padStart(2, '0')

const writeExport = zones => {
	//format [{domaine, zoneData}]

	// write each board in a JSON file in the folder /export/YYYY-MM-DD/zone.name.json
	//create folders if no exists
	const today = new Date(),
		YYYY = today.getFullYear(),
		MM = pad2(today.getMonth() + 1),
		DD = pad2(today.getDate()),
		todayRelativePath = path.join('export', `${YYYY}-${MM}-${DD}`)

	return checkAccess(todayRelativePath)
		.catch(err => {
			//if no directory, we create it
			if (err && err.code === 'ENOENT') {
				console.log('Creating ' + todayRelativePath)
				return mkdirp(todayRelativePath)
			}
		})
		.then(() => {
			//write files
			console.log('Writing files...')
			return Promise.all(zones.map(zone => {
				const nameCleaned = zone.domaine,
					filename = path.join(todayRelativePath, nameCleaned + '.txt')
				//console.log('Writing file ' + filename)
				return writeData(zone.zoneData, filename)
			}))
		})
}

module.exports = {
	writeExport
}
