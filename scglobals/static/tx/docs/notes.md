## Migration from django to couch notes

* doing away with pending shipments (they're not exported & add useless complexity)

## couchdb on ubuntu 12.04
Ran the following:

    sudo apt-get install couchdb-bin
    sudo apt-get install erlang
    sudo apt-get install couchdb

* May not have had to run couchdb-bin
* had to edit `/etc/couchdb/default.ini`
* and changed: `bind_address = 127.0.0.1` to `bind_address = 0.0.0.0`
* then had to reboot the server: `sudo reboot`
