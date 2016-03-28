## tx handelbars

# 2016-03-28
* Auth: port auth code & proper CORS setup | M
* sees a header of the item
* user sees loading http://localhost:8080/#/item/ARV'S%20PREPARATIONS/ABC%2F3TC%20600%2F300%20mg | Sm
* the user can paginate through transactions | present but BUG on http://localhost:8080/#/item/TB%20Medication/Pyridoxine%2025mg%201000 |   M

# 2016-03-21
* can filter on location
* user sees stock card filtered to a location | M

# 2016-03-20
* BUG: names need to be url escaped
* user sees drop down of items in the search bar | new reduce query on shipments | M
* user can select an item and go to its stock card | Sm
* on the stock card, the user sees a of transactions for that item with the fields date, shipmentid, from, to,expiration, lot num, qty, user | new item specific map query | M
* user can click on the shipment link of a transaction and go to the shipment page | Sm

## 2015-12-21
* sees a date filter | Sm | 2.25h
* can filter on last six months, last year | M
* Shipment -- add a link to current system | Sm | 10m
* user does full comparision of first, last, random shipments between the systems and sees parity | Sm
* can filter on last week | Sm
* BUG: last year isn't "2014" and is on the wrong days, & YTD | Sm
* can filter on a range of dates | Sm | 1h

## 2015-12-20
* can paginate through shipments | M | 2.5h

2015-12-19
* sees pagination | Sm | 45m

## 2015-12-1 - 2015-12-18
* docs stored in couchdb
User
* sees 1000 shipments as date, from, to, total items, total value | Sm | 2h
* can click a shipment and see the shipment's transactions | already have the shipment loaded on list view, so this could be one less hit to the DB... | sm | 1h
* sees the total number of shipments, their total value, and their total number of items | Sm | 2h

## 2015-11-22

#### bugs
couldn't use webpack + handlebars + chrome devtools, some error with 4.0. https://github.com/altano/handlebars-loader/issues/67

#### improvements
* Everything in tx is still broken.
* karma+mocha tests now work :)
