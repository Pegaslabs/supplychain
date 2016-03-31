# Supply Chain
Simple web based app for clinical supply chain management

In process of converting to Cloudand/Couchdb/PouchDB, app's intended use case are low uptime environments, need availability over accuracy/relations/consistancy, as low availability leads to greater inaccuracies.

## Setup
  npm i -g gulp karma-cli
  npm i
  add-cors-to-couchdb
  bower i

## deploy
create a json file in the root dir of your project:
couchdb_credentials.json
containing:
{
  "username": "USERNAME",
  "password": "PASS",
  "url": 'COUCH_URL'
}
