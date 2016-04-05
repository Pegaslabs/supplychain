# Tickets

## general
* move config obj to json file & inject env specific obj to a config model defaults
* skip should be removed on page change
* BUG: skip hard-coded to 1000

## Django Migration
* any error on migrate needs to alert user there was a failure
--
* bring over creator, created, modified stamps | Sm
* clean up pre july 2013 shipments | Sm

## Dashboard
* sees date filtering
* when filtering, sees URL updated and can revisit URL | Sm
* When couch is offline, user sees error message

## Stock Cards
* on each transaction, the user sees a resulting balance | M
* link back to old system
* user sees a monthly consumption | Sm
--
* user can filter on an expiration | M
* qty by lot, at inventories, at dispensaries | M

## Reporting
* add price to inventory report | L
* expiration report (from last month) | M
* consumption report at lot level | XL
* download reports | M
--
* inventory report at all locations -- lot level | L

## Backends * Permissions & Auth
* works offline @ sites
* Permissions code & sync strategy | XL

## Dev
* karma tests
* refactor DB to be actual singleton
* rip out bootstrap modal js

# Editing
## CRUD models
* Item, Item Category, Location, Location Category, User, Patient, Shipment
## Edit shipment: receive
## Edit shipment: transfer
## Edit shipment: dispense
