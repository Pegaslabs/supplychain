## dev

## 2.1.2 -- 2014 Oct 10

#### improvements
- patients now have names stored on location table only, identifier is not mandatory, search searches both
- patients can be edited from "shipments" page

#### housekeeping
- renamed InventoryApp to SupplyChainApp, changed the whole project to just "supplychain" 
- removed all sorts of unused folders, unused files

#### bug
 - patient location was getting added twice
 - expiration reports have this challenge where in the future, you can search for item lots that have qty at a location at the end of the date query range, and that have an expiration in the range. But in the past, they all return zero at the end, because they've all been moved to "expired". So to remedy, the expirations query now searches for items moved to the expired location (27 id, hard coded) and "adds" them to the regular quantities.
 - locations=blank is now locations=1 hardcoded for now (no one else is supposed to be using this other than CP)
 - switched order of delete & submit buttons on shipments for khauhelo's "delete on enter" bug 

## 2.1.1 -- 2014 July 10

#### bug
 - windows freaks on .csv or tsv, changing to "xls" so I don't have to go to bots to show how to change default program for opening... 
 - never updated download button on item page with new chrome 'download' filename fix  [issue on chromium](https://code.google.com/p/chromium/issues/detail?id=373182)

## v2.1.0 - 2014 july 9

####Improvements
 - receive shipments can be done mostly mouseless
 - gzip middleware speeds up most requests
 - "/" keyboard moves cursor to seach bar
 - started [changelogs](http://www.mehdi-khalili.com/better-git-release-notes) and [semantic versioning](http://semver.org/) and really trying to start following [tagging git release](http://nvie.com/posts/a-successful-git-branching-model/)

####New Features
 - search bar searches shipments, patients, locations in addition to items
 - dashboard loads much faster w/ raw sql queries

####Bugs
 - fixed download button on reports
 - moved off RIMU server and back to meditech IBM rack server in lab, as DNS went down for several days...

[Commits](https://github.com/kdoran/botsinven/compare/master...dev)



