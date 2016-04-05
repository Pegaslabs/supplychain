# Tickets

## general
* move config obj to json file & inject env specific obj to a config model defaults
* skip should be removed on page change

## Django Migration - golive
* any error on migrate needs to alert user there was a failure

## Dashboard - backlog
* sees a drop down of possible from locations for filtering | M
* sees a drop down of possible to locations for filtering | Sm
* can filter on a specific from location | M
* can filter on a specific to location | rebuild query because of couch sort order | Sm
* when filtering, sees URL updated and can revisit URL | Sm
* pagination should only load new shipments table, not summary | Sm
* backbone model works w/ created/updated timestamps
* think through security around patient names
* When couch is offline, user sees error message
* loading start better on migration | xSm
* if user is scrolled down on shipments & clicks a shipment with lots of values, they are not scrolled to the top of the page
* get seyfu's feedback on what date filters are good | Sm

## Stock Cards -- backlog
* on each transaction, the user sees a resulting balance | M
* link back to old system
* user sees a monthly consumption | Sm
* user can filter on an expiration | M
* qty by lot, at inventories, at dispensaries | M

## Reporting -- backlog
* inventory report with price | L
* future expirations report | M
* data quality | XL

* expiration report (from last month) | M
* consumption report at lot level | XL

* inventory report at all locations -- lot level | L

* download reports | M

## Django Migration - backlog
* bring over creator, created, modified stamps | Sm
* clean up pre july 2013 shipments | Sm
* When they create a patient, they don't store it on their name, it's on their ID (?)

## Permissions & Auth & Backend -- phase 2
* Permissions | XL

# Editing | XL
## CRUD models
* Item, Item Category, Location, Location Category, User, Patient, Shipment
## Edit shipment: receive
## Edit shipment: transfer
## Edit shipment: dispense
