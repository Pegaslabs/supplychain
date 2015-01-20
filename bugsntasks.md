tasks (in priority)
-patient search on dispensing does not include identifier
-merge location, merge patient
-move to real DB
-make an item 0 on an existing shipment, leaves the zero there
	https://lesothotest.pih-emr.org:8998/#/item/712?location=1, https://lesothotest.pih-emr.org:8998/#/item/242?location=1
-dates wrong on dispensing
	-transfer something to the dispensary, then despense it same day, then checkout the stock page balance...
-dates are wrong for same day inventory
-edit patient on Shipment page requires reloading to see changes
-allow virtual location on location edit
- negative 1 on reselecting a transfer out item
-pressing a button twice really screws things up
-shipment editing needs to look first at the shipment
	-e.g. transfer items out, then you look at SOH after refreshing shipment and you can't find the stock changes on that shipment
-remove physical inventory

patient tasks (in priority)
-patient search needs to show identifier, name, age, gender

general tasks
-user permisssions 
-get better copy of bootstrap ui and remove all those bootstrapui html template files

done
-download button missing on transactions
