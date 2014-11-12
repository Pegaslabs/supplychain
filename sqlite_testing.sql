.headers ON
.output C:/supplychain/sqlite_testing_out.txt
-- .output /Users/kevin/software/testing/sqlite_testing_out.txt
.mode column 

          select i.id, i.name,c.name,sum(sc.qty),avg(il.unit_price)
          from inventory_shipment ship 
            join inventory_stockchange sc on sc.shipment_id=ship.id and sc.location_id=%s
            join inventory_itemlot il on sc.itemlot_id=il.id
            join inventory_item i on i.id=il.item_id
            join inventory_itemcategory c on c.id=i.category_id
            where (ship.from_location_id=%s or ship.to_location_id=%s ) and ship.active=1 and ship.date <="%s"
            group by i.id
                order by i.name_lower ASC




;
