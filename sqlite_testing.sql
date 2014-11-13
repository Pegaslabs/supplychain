.headers ON
.output C:/supplychain/sqlite_testing_out.txt
-- .output /Users/kevin/software/testing/sqlite_testing_out.txt
.mode column 

          select ship.id,ship.date,i.id, i.name,c.name,il.expiration,sc.qty
          from inventory_shipment ship
            join inventory_stockchange sc on sc.shipment_id=ship.id and sc.location_id=5
            join inventory_itemlot il on sc.itemlot_id=il.id
            join inventory_item i on i.id=il.item_id
            join inventory_itemcategory c on c.id=i.category_id
            where (ship.from_location_id=5 or ship.to_location_id=5 ) and ship.active=1 and ship.date <="2014-10-26"
            -- group by il.id
                -- order by i.name_lower ASC




;
