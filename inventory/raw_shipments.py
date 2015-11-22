import sqlite3
from scglobals import settings
import simplejson as json
from django.core.exceptions import SuspiciousOperation
from reporting_utils import issafenumber

def isSafeDate(d):
    date_nums = d.split("-")
    if len(date_nums) is not 3:
        raise SuspiciousOperation('Non-date sent to reports query.')
    for val in date_nums:
        issafenumber(val)
    return d

def get_shipment_stockchanges(shipStartId,shipEndId):
    conn = sqlite3.connect(settings.DATABASES['default']['NAME'])
    c = conn.cursor()
    q = """
    select sc.id,sc.qty,(il.unit_price*sc.qty),sc.created,sc.modified,sc.shipment_id,
    i.name,i.id,c.name,c.id,il.expiration,il.lot_num,il.unit_price,il.id,u.username
    from inventory_stockchange sc
    join inventory_shipment s on sc.shipment_id=s.id
    join inventory_itemlot il on il.id=sc.itemlot_id
    join inventory_item i on i.id=il.item_id
    join inventory_itemcategory c on c.id=i.category_id
    join auth_user u on u.id=sc.user_id where s.active=1 
    and s.id >= %d and s.id =<%d;""" % (shipStartId, shipEndId)
    c.execute(q)
    data = c.fetchall()
    conn.commit()
    conn.close()
    return data

def get_shipments(requestGet):
    if "ascordesc" in requestGet: 
        ascordesc = requestGet["ascordesc"]
        if ((ascordesc != "asc") and (ascordesc != "desc")):
            raise SuspiciousOperation('non valid text sent to reports query.')
    else:
        ascordesc = "ASC"
    if "startdate" in requestGet:
        startdate = ('and s.date >= "%s"') % isSafeDate(requestGet["startdate"])
    else:
        startdate = ""
    if "enddate" in requestGet:
        enddate = ('and s.date < "%s"') % isSafeDate(requestGet["enddate"])
    else:
        enddate = ""
    if "modified" in requestGet:
        orderBy = "order by sc.modified"
        modified = ('and sc.modified > "%s"') % isSafeDate(requestGet["modified"])
    else:
        orderBy = "order by s.date"
        modified = ""
    if "id" in requestGet:
        orderBy = "order by sc.id"
        modified = ('and sc.id > "%s"') % issafenumber(requestGet["id"])
    else:
        orderBy = "order by s.date"
        modified = ""
    if "limit" in requestGet:
        limit = "limit " + issafenumber(requestGet["limit"])
    else:
        limit = ""
    if "offset" in requestGet:
        offset = "offset " + issafenumber(requestGet["offset"])
    else:
        offset = ""
    conn = sqlite3.connect(settings.DATABASES['default']['NAME'])
    c = conn.cursor()
    q = """
    select s.id,s.date,s.name,from_location.name,from_location.location_type,
        from_location.id,to_location.name,to_location.location_type,to_location.id,u.username
    from inventory_shipment s
    join inventory_location from_location on s.from_location_id=from_location.id
    join inventory_location to_location on s.to_location_id=to_location.id
    join auth_user u on u.id=s.user_id where s.active=1 
    %s %s %s
    %s %s %s %s;""" % (startdate, enddate, modified, orderBy, ascordesc, limit, offset)
    c.execute(q)
    data = c.fetchall()
    conn.commit()
    conn.close()
    # map(data)
    return data
