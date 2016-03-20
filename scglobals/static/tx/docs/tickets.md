# Tickets

## Dashboard - go live
* BUG:  filter doesn't work after pagination | tied to url updating | Sm
* BUG: page numbers off on 0, 1 jan 14 - 8 jan 14
* BUG: on the fence error probably applies for input range | Sm

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

## Stock Cards -- go live
* user sees drop down of items in the search bar | new reduce query on shipments | M
* user can select an item and go to its stock card | Sm
* on the stock card, the user sees a paginated display of 1000 transactions for that item with the fields date, shipmentid, from, to,expiration, lot num, qty, user | new item specific map query | M
* user can click on the shipment link of a transaction and go to the shipment page | Sm

## Stock Cards -- phase 2
* on each transaction, the user sees a resulting balance | M
* user sees a monthly consumption tab | Sm
* when user clicks monthly consumption, they see the monthly consumption | XL

## Stock Cards -- low priority
* user can filter on an expiration | M
* qty by lot, at inventories, at dispensaries | M

## Reporting -- phase 2
* consumption report at lot level | XL
* data quality | XL
* inventory report at all locations -- lot level | L
* expiration report | M
* future expirations report | M
* download reports | M

## Reporting -- low priority
* inventory report at item level | Sm

## Django Migration
### Django Migration - go live
* bring over creator, created, modified stamps | Sm
* fix shipment values on dispensing | add item dispense size to export query, add logic to django-migration on front end | Sm
* clean up dates to be correct day  | Sm

## Django Migration - Low Priority
* clean up pre july 2013 shipments | Sm
* When they create a patient, they don't store it on their name, it's on their ID (?)

## Permissions & Auth & Backend -- go live
* Seyfu's deploy strategy | XL
* Auth: port auth code & proper CORS setup | M

## Permissions & Auth & Backend -- phase 2
* Permissions | XL

# Editing | XL
## CRUD models
* Item, Item Category, Location, Location Category, User, Patient, Shipment
## Edit shipment: receive
## Edit shipment: transfer
## Edit shipment: dispense
