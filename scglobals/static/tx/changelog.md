# TX System Changelog

### 2016-04-07
* feature: stock cards now have sum by expiration table | Sm
* bug: nav buttons on mobile not opening

### 2016-04-04
* feature: data quality report | XL
* feature: future expirations report | M
* feature: inventory report at item level | Sm
* bug: nkau dispensary & locations with trailing spaces
* bug: Loading missing from item, shipments
* bug: pagination broken on items

### 2016-04-02
* code: deploy strategy | XL
* bug: Pagination urls on prod

### 2016-03-28
* bug: clean up dates to be correct day  | Sm
* bug: auth & create db
* feature: user sees the current stock on hand | need to do qty dispense size translation | M
* bug: fix shipment values on dispensing | add item dispense size to export query, add logic to django-migration on front end | L
* bug: fix $$ values

### 2016-03-28
* code: auth: port auth code & proper CORS setup | M
* feature: user sees a header of the item
* feature: user sees loading http://localhost:8080/#/item/ARV'S%20PREPARATIONS/ABC%2F3TC%20600%2F300%20mg | Sm
* feature: the user can paginate through transactions | present but BUG on http://localhost:8080/#/item/TB%20Medication/Pyridoxine%2025mg%201000 |   M

### 2016-03-21
* feature: user can filter on location
* feature: user sees stock card filtered to a location | M

### 2016-03-20
* bug: names need to be url escaped
* feature: user sees drop down of items in the search bar | new reduce query on shipments | M
* feature: user can select an item and go to its stock card | Sm
* feature: on the stock card, the user sees a of transactions for that item with the fields date, shipmentid, from, to,expiration, lot num, qty, user | new item specific map query | M
* feature: user can click on the shipment link of a transaction and go to the shipment page | Sm

### 2015-12-21
* feature: user sees a date filter | Sm | 2.25h
* feature: user can filter on last six months, last year | M
* feature: user sees link to old system | Sm | 10m
* feature: user sees parity between full compare of first, last, random shipments with old system | Sm
* feature: user can filter on last week | Sm
* bug: last year isn't "2014" and is on the wrong days, & YTD | Sm

### 2015-12-20
* feature: user can paginate through shipments | M | 2.5h

### 2015-12-19
* feature: user sees pagination | Sm | 45m

### 2015-12-1 - 2015-12-18
* code: docs stored in couchdb
* feature: user sees 1000 shipments as date, from, to, total items, total value | Sm | 2h
* feature: user can click a shipment and see the shipment's transactions | already have the shipment loaded on list view, so this could be one less hit to the DB... | sm | 1h
* feature: user sees the total number of shipments, their total value, and their total number of items | Sm | 2h

### 2015-11-22
* bug: couldn't use webpack + handlebars + chrome devtools, some error with 4.0. https://github.com/altano/handlebars-loader/issues/67
* code: everything in tx is still broken.
* code: karma+mocha tests now work :)
