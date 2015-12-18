# Tickets
Tasks - high
User
* sees the total number of shipments, their total value, and their total number of items | Sm
* sees pagination | Sm
* can paginate through shipments | M
* sees a date filter | Sm
* can filter on a range of dates | L
* can filter on a specific location | L

* When they create a patient, they don't store it on their name, it's on their ID

Django
* fix shipment values on dispensing
* clean up pre-initial shipments

Low
* id on shipment is date_from_to_rand
* think through security around patient names
* When couch is offline, user sees error message
* loading start better on migration | xSm

# Stories
## Sync
	## One-time in session
		* Sync API allows getting transactions by shipment
		* Sync saves shipments as documents
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