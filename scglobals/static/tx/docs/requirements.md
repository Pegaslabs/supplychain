# Requirements

# Tests
## Sync
	## One-time in session
		* Sync API allows getting transactions by shipment
		* Sync saves shipments as documents
	## Ongoing Sync: view & filter only
	## Ongoing sync: editing
## Shipments
	### View all
		* Dashboard displays all shipments
			* User sees full count of shipments, value (items a nice to have)
			* User sees pagination
	### Sort on location
	### Sort on dates
## Stock cards
## Shipment
## Reports
## CRUD models
	## Item, Item Category, Location, Location Category, User, Patient
## Crud shipments 
## Edit shipment: receive
## Edit shipment: transfer
## Edit shipment: dispense
## User permissions
## User preferences

## Launch plan 1 -- can we do this in 2015?
* Sync: first views shipments & stock cards 
* Sync 2: doesn't have to refresh 
* Sync 3: All views including reports
* Sync 4: Edits
# Migration: full user permissions, roll out to all clinics & dispensaries

## New launch plan 2 2015: sync is too ambitious
* Migration button: Seyfu can migrate to a couch read-only instance for the time being
* We build out views on it
* We build out update
* Permissions, couch workflow, deploy strategies
* Launch full migration