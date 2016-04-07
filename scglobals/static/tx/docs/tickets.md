# Tickets

## general
* task: investigate why stock levels different on data quality
* code: move config obj to json file & inject env specific obj to a config model defaults
* skip should be removed on page change
* BUG: skip hard-coded to 1000
--
* css not minified on prod

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
* user sees a monthly consumption | Sm
--
* link back to old system
* user can filter on an expiration | M
* qty by lot, at inventories, at dispensaries | M

## Reporting
* add price to inventory report | L
* expiration report (from last month) | M
* consumption report at lot level | XL
  * zero item level
* download reports | M
--
* inventory report at all locations -- lot level | L
* out of stock
  * length out of stock
  * frequency out of stock

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
## shipments
  * first expire first out
  * receive
  * transfer
  * dispense
