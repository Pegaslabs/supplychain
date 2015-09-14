import sqlite3
from scglobals import settings
import simplejson as json
from reporting_utils import issafenumber

def isSafeDate(d):
    date_nums = d.split("-")
    if len(date_nums) is not 3:
        raise SuspiciousOperation('Non-date sent to reports query.')
    for val in date_nums:
        issafenumber(val)
    return d

def get_stockchanges(requestGet):
    limit = 30
    startdate = isSafeDate(requestGet["startdate"])
    enddate = isSafeDate(requestGet["enddate"])
    if "limit" in requestGet:
        limit = float(issafenumber(requestGet["limit"]))
    conn = sqlite3.connect(settings.DATABASES['default']['NAME'])
    c = conn.cursor()
    q = """select 
    s.date,s.id,sc_location.name,from_location.name,from_location.location_type,to_location.name,to_location.location_type,i.name,c.name,il.expiration,il.lot_num,il.unit_price,sc.qty,u.username,sc.modified,(il.unit_price*sc.qty)
    from inventory_stockchange sc
    join inventory_shipment s on sc.shipment_id=s.id
    join inventory_location sc_location on sc_location.id=sc.location_id
    join inventory_location from_location on s.from_location_id=from_location.id
    join inventory_location to_location on s.to_location_id=to_location.id
    join inventory_itemlot il on il.id=sc.itemlot_id
    join inventory_item i on i.id=il.item_id
    join inventory_itemcategory c on c.id=i.category_id
    join auth_user u on u.id=sc.user_id where s.active=1 
    and s.date >= "%s" and s.date <= "%s"
    order by s.date limit %d;""" % (startdate, enddate, limit)
    c.execute(q)
    data = c.fetchall()
    conn.commit()
    conn.close()
    return data
