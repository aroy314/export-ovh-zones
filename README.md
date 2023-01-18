# Export OVH Zones
## Description
This script will fetch all your OVH DNS Zones and export them in a TXT file

- Made in Node.js, inspired from [this repository in ruby](https://github.com/Jolg42/ovh-export-dns)
- We use [OVH Node.js wrapper](https://github.com/ovh/node-ovh) for their API

## Usage
1. Make sure [node.js and npm](https://nodejs.org/) are installed on your computer `node -v && npm -v`.
   This script has been developed with node v16.15.1 and npm 8.13.2
2. Install packages `npm i`
3. Get your [OVH Keys](https://www.ovh.com/auth/api/createApp) and fill `config.json`
4. Run your export with `npm run export`
5. You will have to validate a token for the execution, your default browser should open, login and authorize your app within the next 10 seconds
5. Your export will be available in the directory `export/YYYY-MM-DD` with one TXT file per zone
6. The script might return a list of errors if you have expired domains

## More config
Depending the API you want to use, you need to specify the API END_POINT in `config.json` :
- OVH Europe: ovh-eu (default)
- OVH North-America: ovh-ca
- RunAbove: runabove-ca
- SoYouStart Europe: soyoustart-eu
- SoYouStart North-America: soyoustart-ca
- Kimsufi Europe: kimsufi-eu
- Kimsufi North-America: kimsufi-ca

## Changelog
v1.0 - 2023-01-18
- Working export of all OVH DNS Zones

# Feedback
You found a bug? You need a new feature? You can [create an issue](https://github.com/aroy314/export-ovh-zones/issues) if needed or contact me on [Twitter](https://twitter.com/aroy314).

# Documentation for OVH API
- [OVH API Documentation](https://api.ovh.com/)
- [How to use Node + OVH](https://ovh.github.io/node-ovh)
- [First Steps](https://docs.ovh.com/gb/en/api/first-steps-with-ovh-api/)
- [Create API App](https://www.ovh.com/auth/api/createApp)
