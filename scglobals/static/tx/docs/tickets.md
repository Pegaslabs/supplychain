# Tickets
Tasks - high
User
* can filter on last week | Sm
* when filtering, sees URL updated and can revisit URL | Sm
* can filter on a range of dates | Sm
* can filter on a specific location | L

* When they create a patient, they don't store it on their name, it's on their ID

Django + Migration
* bring over creator, created, modified stamps
* fix shipment values on dispensing
* clean up pre-initial shipments
* clean up dates to be correct day

Low
* pagination should only load new shipments table, not summary
* id on shipment is date_from_to_rand
* backbone model works w/ created/updated timestamps
* think through security around patient names
* When couch is offline, user sees error message
* loading start better on migration | xSm
* if user is scrolled down on shipments & clicks a shipment with lots of values, they are not scrolled to the top of the page

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