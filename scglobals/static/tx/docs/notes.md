## Migration from django to couch notes

* doing away with pending shipments (they're not exported & add useless complexity)

## couchdb on ubuntu 12.04
* lots of issues, main two:
** ubuntu 12 comes with couch 1.01 installed, which doesn't support https (and was never tested with this app)
** ubuntu 12 also comes with erlang 1.15.x, which doesn't handle latest encryption on ssl
** work around, after apt-get purging out couchdb & reinstalling from source with the below steps, was to use nginx to ssl proxy couchd :)
* nginx also needs a higher max body size `client_max_body_size 50M`

## building couch from source on ubuntu 12
(from https://github.com/pixelpark/ppnet/wiki/Install-CouchDB-1.6.1-on-Ubuntu-14.04)

# via http://wiki.apache.org/couchdb/Installing_on_Ubuntu

sudo apt-get install --yes build-essential curl git
sudo apt-get install --yes python-software-properties python g++ make

sudo apt-get install -y erlang-dev erlang-manpages erlang-base-hipe erlang-eunit erlang-nox erlang-xmerl erlang-inets
sudo apt-get install -y libmozjs185-dev libicu-dev libcurl4-gnutls-dev libtool

# via http://ftp.fau.de/apache/couchdb/source/1.6.1/
cd /tmp
wget http://ftp.fau.de/apache/couchdb/source/1.6.1/apache-couchdb-1.6.1.tar.gz
tar xvzf apache-couchdb-*

cd apache-couchdb-*
./configure && make

sudo make install



useradd -d /var/lib/couchdb couchdb
chown -R couchdb: /var/lib/couchdb /var/log/couchdb

# vi /etc/passwd here and change home directory to /usr/local/var/lib/couchdb/


chown -R couchdb: /usr/local/var/{lib,log,run}/couchdb /usr/local/etc/couchdb
chmod 0770 /usr/local/var/{lib,log,run}/couchdb/
chmod 664 /usr/local/etc/couchdb/*.ini
chmod 775 /usr/local/etc/couchdb/*.d

cd /etc/init.d
ln -s /usr/local/etc/init.d/couchdb couchdb
/etc/init.d/couchdb start
update-rc.d couchdb defaults

curl http://127.0.0.1:5984/

# vi /usr/local/etc/couchdb/default.ini
#  change bind_adress to 0.0.0.0

service couchdb restart


supervisorctl restart botsims
