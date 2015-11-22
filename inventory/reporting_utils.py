from django.core.exceptions import SuspiciousOperation
from inventory.models import Item,ItemLot,StockChange,Shipment,Location
from django.db.models import Sum
from django.db import connection
from django.utils import timezone

def get_native_dates(rows,date_row_index):
    rows = map(list, rows)
    # we need native timezones otherwise everything is UTC, 
    # i.e. our dates -2 which becomes the day before
    for row in rows:
        try:
            row[date_row_index] = timezone.localtime(row[date_row_index]).strftime('%Y-%m-%d')
        # sometimes a None 
        except AttributeError:
            pass
    return rows

def issafenumber(thing):
    try:
        float(thing)
        return thing
    except:
        raise SuspiciousOperation('Non-number sent to reports query.')

def raw_inventory_report(location_id,report_type,itemlot_level=False,category_id=None,date=None,end_date=None):
    if not date:
        date = str(timezone.localtime(timezone.now())).split(" ")[0]
    else:
        date_nums = date.split("-")
        if len(date_nums) > 3:
            raise SuspiciousOperation('Non-date sent to reports query.')
        issafenumber(date.split("-")[0])
        issafenumber(date.split("-")[1])
        issafenumber(date.split("-")[2])
    if end_date:
        end_date_nums = end_date.split("-")
        if len(end_date_nums) > 3:
            raise SuspiciousOperation('Non-end_date sent to reports query.')
        issafenumber(end_date.split("-")[0])
        issafenumber(end_date.split("-")[1])
        issafenumber(end_date.split("-")[2])
    if category_id:
        category_text = "where c.id=%s" % issafenumber(category_id)
        if report_type == "Inventory":
            category_text = "and c.id=%s" % issafenumber(category_id)
    else:
        category_text = ""

    cursor = connection.cursor()

    # cp wants zero values included at the item level but not the itemlot level
    # "having" instead of "where" allows filtering on a sum
    q_itemlot = """
        select i.id, i.name,c.name,il.id,il.expiration,il.lot_num,sum(sc.qty),il.unit_price
            from inventory_shipment ship 
            join inventory_stockchange sc on sc.shipment_id=ship.id and sc.location_id=%s
            join inventory_itemlot il on sc.itemlot_id=il.id
            join inventory_item i on i.id=il.item_id
            join inventory_itemcategory c on c.id=i.category_id
            where (ship.from_location_id=%s or ship.to_location_id=%s ) and ship.active=1 and ship.date <="%s"
            %s
            group by il.id
                having sum(sc.qty) <> 0
                order by i.name_lower ASC, il.expiration ASC;""" % (issafenumber(location_id),location_id,location_id,date,category_text)

    q_item = """
        select i.id,i.name,c.name,sum(sc.qty),avg(il.unit_price)
            from inventory_shipment ship 
            join inventory_stockchange sc on sc.shipment_id=ship.id and sc.location_id=%s
            join inventory_itemlot il on sc.itemlot_id=il.id
            join inventory_item i on i.id=il.item_id
            join inventory_itemcategory c on c.id=i.category_id
            where (ship.from_location_id=%s or ship.to_location_id=%s ) and ship.active=1 and ship.date <="%s"
            %s
            group by i.id
                order by i.name_lower ASC;""" % (issafenumber(location_id),location_id,location_id,date,category_text)
    q_consumption_itemlot = """
        select i.id, i.name,c.name,il.id,il.expiration,il.lot_num,sum(active_sc_start.qty),sum(active_sc_total_received.qty),sum(active_sc_received.qty),sum(active_sc_end.qty),-1*sum(active_sc_consumed.qty),-1*sum(active_sc_expired.qty),-1*sum(active_sc_lost_damaged.qty),-1*sum(active_sc_adjustments.qty),avg(il.unit_price)
            from inventory_item i
            join inventory_itemcategory c on c.id=i.category_id
            left join inventory_itemlot il on il.item_id=i.id 
            left join inventory_stockchange sc_end on sc_end.itemlot_id=il.id and sc_end.location_id=%s and sc_end.date<="%s"
            left join inventory_shipment active_shipment on active_shipment.id=sc_end.shipment_id and active_shipment.active=1
            left join inventory_location to_location on active_shipment.to_location_id=to_location.id
            left join inventory_location from_location on active_shipment.from_location_id=from_location.id
            left join inventory_stockchange active_sc_end on active_sc_end.id=sc_end.id and active_sc_end.shipment_id=active_shipment.id
            left join inventory_stockchange active_sc_between on active_sc_end.id=active_sc_between.id and sc_end.date>="%s"
            left join inventory_stockchange active_sc_start on active_sc_end.id=active_sc_start.id and active_sc_start.date<"%s"
            -- total received
            left join inventory_stockchange active_sc_total_received on active_sc_total_received.id=active_sc_between.id and to_location.id=%s
            -- received from external suppliers
            left join inventory_stockchange active_sc_received on active_sc_received.id=active_sc_between.id and from_location.location_type="S"
            -- consumed qty
            left join inventory_stockchange active_sc_consumed on active_sc_consumed.id=active_sc_between.id and from_location.id=%s and to_location.location_type in ("I","D","P")
            -- expired qty
            left join inventory_stockchange active_sc_expired on active_sc_expired.id=active_sc_between.id and to_location.id=27
            -- lost or damaged
            left join inventory_stockchange active_sc_lost_damaged on active_sc_lost_damaged.id=active_sc_between.id and to_location.name in ("Loss","Damaged")
            left join inventory_stockchange active_sc_adjustments on active_sc_adjustments.id=active_sc_between.id and to_location.location_type="S" and from_location.id=%s
            %s
            group by il.id
                having sum(active_sc_start.qty) > 0 or sum(active_sc_start.qty) < 0 or sum(active_sc_received.qty) > 0 or sum(active_sc_received.qty) < 0 or sum(active_sc_end.qty) > 0 or sum(active_sc_end.qty) < 0 or sum(active_sc_consumed.qty) > 0 or sum(active_sc_consumed.qty) < 0 or sum(active_sc_expired.qty) > 0 or sum(active_sc_expired.qty) < 0 or sum(active_sc_lost_damaged.qty) > 0 or sum(active_sc_lost_damaged.qty) < 0 or sum(active_sc_adjustments.qty) > 0 or sum(active_sc_adjustments.qty) < 0
            order by c.name ASC, i.name ASC;""" % (issafenumber(location_id),end_date,date,date,issafenumber(location_id),issafenumber(location_id),issafenumber(location_id),category_text)
    q_consumption_item = """
        select i.id, i.name,c.name,sum(active_sc_start.qty),sum(active_sc_total_received.qty),sum(active_sc_received.qty),sum(active_sc_end.qty),-1*sum(active_sc_consumed.qty),-1*sum(active_sc_expired.qty),-1*sum(active_sc_lost_damaged.qty),-1*sum(active_sc_adjustments.qty),avg(il.unit_price)
            from inventory_item i
            join inventory_itemcategory c on c.id=i.category_id
            left join inventory_itemlot il on il.item_id=i.id 
            left join inventory_stockchange sc_end on sc_end.itemlot_id=il.id and sc_end.location_id=%s and sc_end.date<="%s"
            left join inventory_shipment active_shipment on active_shipment.id=sc_end.shipment_id and active_shipment.active=1
            left join inventory_location to_location on active_shipment.to_location_id=to_location.id
            left join inventory_location from_location on active_shipment.from_location_id=from_location.id
            left join inventory_stockchange active_sc_end on active_sc_end.id=sc_end.id and active_sc_end.shipment_id=active_shipment.id
            left join inventory_stockchange active_sc_between on active_sc_end.id=active_sc_between.id and sc_end.date>="%s"
            left join inventory_stockchange active_sc_start on active_sc_end.id=active_sc_start.id and active_sc_start.date<"%s"
            left join inventory_stockchange active_sc_total_received on active_sc_total_received.id=active_sc_between.id and to_location.id=%s
            -- received from external suppliers
            left join inventory_stockchange active_sc_received on active_sc_received.id=active_sc_between.id and from_location.location_type="S"
            -- consumed qty
            left join inventory_stockchange active_sc_consumed on active_sc_consumed.id=active_sc_between.id and from_location.id=%s and to_location.location_type in ("I","D","P")
            -- expired qty
            left join inventory_stockchange active_sc_expired on active_sc_expired.id=active_sc_between.id and to_location.id=27
            -- lost or damaged
            left join inventory_stockchange active_sc_lost_damaged on active_sc_lost_damaged.id=active_sc_between.id and to_location.name in ("Loss","Damaged")
            left join inventory_stockchange active_sc_adjustments on active_sc_adjustments.id=active_sc_between.id and to_location.location_type="S" and from_location.id=%s
            %s
            group by i.id
                having sum(active_sc_start.qty) > 0 or sum(active_sc_start.qty) < 0 or sum(active_sc_received.qty) > 0 or sum(active_sc_received.qty) < 0 or sum(active_sc_end.qty) > 0 or sum(active_sc_end.qty) < 0 or sum(active_sc_consumed.qty) > 0 or sum(active_sc_consumed.qty) < 0 or sum(active_sc_expired.qty) > 0 or sum(active_sc_expired.qty) < 0 or sum(active_sc_lost_damaged.qty) > 0 or sum(active_sc_lost_damaged.qty) < 0 or sum(active_sc_adjustments.qty) > 0 or sum(active_sc_adjustments.qty) < 0
            order by c.name ASC, i.name ASC;""" % (issafenumber(location_id),end_date,date,date,issafenumber(location_id),issafenumber(location_id),issafenumber(location_id),category_text)
    q_expirations = """select i.id, i.name,c.name,il.id,il.expiration,il.lot_num,COALESCE(abs(sum(expired_scs.qty)),0) + COALESCE(abs(sum(active_scs.qty)),0),il.unit_price,COALESCE(sum(active_scs.qty)*il.unit_price,0) + COALESCE(abs(sum(expired_scs.qty)*il.unit_price),0)
            from inventory_item i
            join inventory_itemcategory c on c.id=i.category_id
            join inventory_itemlot il on il.item_id=i.id and il.expiration >="%s" and il.expiration <="%s"
            left join inventory_stockchange scs on scs.itemlot_id=il.id and scs.location_id=%s and scs.date<=il.expiration
            left join inventory_shipment active_shipment on active_shipment.id=scs.shipment_id and active_shipment.active=1
            left join inventory_location to_location on active_shipment.to_location_id=to_location.id
            left join inventory_stockchange active_scs on active_scs.id=scs.id and active_scs.shipment_id=active_shipment.id
            left join inventory_stockchange expired_scs on active_scs.id=expired_scs.id and to_location.id=27
            %s
            group by il.id
                having ABS(sum(active_scs.qty)) > 0 
                or ABS(sum(expired_scs.qty)) > 0
            order by il.expiration,c.name ASC, i.name ASC;""" % (date,end_date,issafenumber(location_id),category_text)
    q_dquality ="""
        select i.id, i.name,c.name,il.id,il.expiration,il.lot_num,sum(active_scs.qty),ila.value
            from inventory_item i
            join inventory_itemcategory c on c.id=i.category_id
            join inventory_itemlot il on il.item_id=i.id
            left join inventory_itemlotattribute ila on ila.itemlot_id=il.id and ila.attribute="dismisseddqualityloc" and ila.value="%s"
            left join inventory_stockchange scs on scs.itemlot_id=il.id and scs.location_id=%s and scs.date<="%s"
            left join inventory_shipment active_shipment on active_shipment.id=scs.shipment_id and active_shipment.active=1
            left join inventory_stockchange active_scs on active_scs.id=scs.id and active_scs.shipment_id=active_shipment.id
            group by il.id
              having sum(active_scs.qty) < 0
            order by c.name ASC, i.name ASC;""" % (issafenumber(location_id),location_id,date)
    all_stockchanges = """select 
        s.date,s.id,sc_location.name,from_location.name,from_location.location_type,to_location.name,to_location.location_type,i.name,c.name,il.expiration,il.lot_num,il.unit_price,sc.qty,u.username,sc.modified,(il.unit_price*sc.qty)
        from inventory_stockchange sc
        join inventory_shipment s on sc.shipment_id=s.id
        join inventory_location sc_location on sc_location.id=sc.location_id
        join inventory_location from_location on s.from_location_id=from_location.id
        join inventory_location to_location on s.to_location_id=to_location.id
        join inventory_itemlot il on il.id=sc.itemlot_id
        join inventory_item i on i.id=il.item_id
        join inventory_itemcategory c on c.id=i.category_id
        join auth_user u on u.id=sc.user_id where s.active=1;"""
    if report_type == "Inventory":
        if itemlot_level:
            cursor.execute(q_itemlot)
            rows = cursor.fetchall()
            return get_native_dates(rows,4)
        else:
            cursor.execute(q_item)
            return cursor.fetchall()
    elif report_type == "Consumption":
        if itemlot_level:
            cursor.execute(q_consumption_itemlot)
            rows = cursor.fetchall()
            return get_native_dates(rows,4)
        else:
            cursor.execute(q_consumption_item)
            return cursor.fetchall()
    elif report_type == "Expirations":
        cursor.execute(q_expirations)
        rows = cursor.fetchall()
        return get_native_dates(rows,4)
    elif report_type == "dquality":
        cursor.execute(q_dquality)
        rows = cursor.fetchall()
        return get_native_dates(rows,4)
    elif report_type == "all_stockchanges":
        print timezone.now()
        cursor.execute(all_stockchanges)
        rows = cursor.fetchall()
        rows = get_native_dates(rows,0)
        rows = get_native_dates(rows,9)
        return get_native_dates(rows,14)
