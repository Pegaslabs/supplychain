import sqlite3
from scglobals import settings
import simplejson as json
from django.core.exceptions import SuspiciousOperation
from reporting_utils import issafenumber,get_native_dates
from django.db import connection

def isSafeDate(d):
    date_nums = d.split("-")
    if len(date_nums) is not 3:
        raise SuspiciousOperation('Non-date sent to reports query.')
    for val in date_nums:
        issafenumber(val)
    return d

def isSafeList(l):
    for val in l:
        issafenumber(val)

def get_stockchanges(requestGet):
    if "ascordesc" in requestGet:
        ascordesc = requestGet["ascordesc"]
        if ((ascordesc != "asc") and (ascordesc != "desc")):
            raise SuspiciousOperation('non valid text sent to reports query.')
    else:
        ascordesc = "ASC"
    # if "startdate" in requestGet:
    #     startdate = ('and s.date >= "%s"') % isSafeDate(requestGet["startdate"])
    # else:
    #     startdate = ""
    # if "enddate" in requestGet:
    #     enddate = ('and s.date < "%s"') % isSafeDate(requestGet["enddate"])
    # else:
    #     enddate = ""
    # if "modified" in requestGet:
    #     orderBy = "order by sc.modified"
    #     modified = ('and sc.modified > "%s"') % isSafeDate(requestGet["modified"])
    # else:
    #     orderBy = "order by s.date"
    #     modified = ""
    if "id" in requestGet:
        orderBy = "order by sc.id"
        # modified = ('and sc.id > "%s"') % issafenumber(requestGet["id"])
    else:
        orderBy = "order by s.date"
        # modified = ""
    if "limit" in requestGet:
        limit = "limit " + issafenumber(requestGet["limit"])
    else:
        limit = ""
    if "offset" in requestGet:
        offset = "offset " + issafenumber(requestGet["offset"])
    else:
        offset = ""
    if "count" in requestGet:
        selectOrCount = "select count(sc.id)"
    else:
        selectOrCount = "select s.date,sc_location.name,from_location.name,\
        from_location.location_type,to_location.name,to_location.location_type, \
        i.name,c.name,il.expiration,il.lot_num,il.unit_price,sc.qty,u.username,\
        sc.modified,(il.unit_price*sc.qty), sc.id, s.id, il.id, i.id, i.dispense_size"
    if "idsBetween" in requestGet:
        isSafeList(requestGet['idsBetween'].split(','))
        shipmentIdsBetween = " and s.id in (" + str(requestGet['idsBetween']) + ")"
    else:
        shipmentIdsBetween = ""
    c = connection.cursor()
    q = selectOrCount + """
    from inventory_stockchange sc
    join inventory_shipment s on sc.shipment_id=s.id
    join inventory_location sc_location on sc_location.id=sc.location_id
    join inventory_location from_location on s.from_location_id=from_location.id
    join inventory_location to_location on s.to_location_id=to_location.id
    join inventory_itemlot il on il.id=sc.itemlot_id
    join inventory_item i on i.id=il.item_id
    join inventory_itemcategory c on c.id=i.category_id
    join auth_user u on u.id=sc.user_id where s.active=1 and sc.qty > 0
    %s %s %s %s %s;""" % (shipmentIdsBetween,orderBy, ascordesc, limit, offset)
    c.execute(q)
    data = c.fetchall()
    connection.commit()
    connection.close()
    if "count" in requestGet:
        return data
    else:
        data = get_native_dates(data,0)
        data = get_native_dates(data,8)
        return get_native_dates(data,13)
    # return data
