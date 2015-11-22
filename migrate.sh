# sql on sqlite:
# delete from inventory_stockchange where id=261112;

python manage.py dumpdata --natural accounts > ~/data/bots-accounts.json 
python manage.py dumpdata --natural --exclude auth.permission --exclude contenttypes auth.User > ~/data/bots-auth.json
python manage.py dumpdata inventory > ~/data/bots-inventory.json 

# mysql: 
CREATE DATABASE supplychain CHARACTER SET utf8  collate utf8_general_ci;

# here, change settings file to point to mysqldb
python manage.py syncdb --noinput
python manage.py loaddata ~/data/bots-auth.json
python manage.py loaddata ~/data/bots-inventory.json
python manage.py loaddata ~/data/bots-accounts.json

# shouldn't need but for reference:
# alter table inventory_item convert to character set utf8 collate utf8_unicode_ci;
# alter table inventory_item convert to character set utf8 collate utf8_unicode_ci;
