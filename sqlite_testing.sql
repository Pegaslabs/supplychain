.headers ON
-- .output /home/james/softwares/sqlite_testing_out.txt
-- .output /Users/kdoran/Documents/tmp/sqlite_testing_out.txt
-- .mode column 

-- all stock changes
-- select s.id,count(sc.id)
--     from inventory_shipment s
--     join inventory_stockchange sc on sc.shipment_id=s.id
--     where s.active=1 
--     -- and count(sc.id) > 0
--     group by s.id
--     limit 1000000;
-- all stock changes
select s.id from inventory_shipment s 
    join inventory_stockchange sc on sc.shipment_id=s.id 
    where s.active=1 
    -- and sc.qty > 0
    group by s.id;

-- select 
--   s.date,s.id,sc_location.name,from_location.name,from_location.location_type,to_location.name,to_location.location_type,i.name,c.name,il.expiration,il.lot_num,il.unit_price,sc.qty,u.username,sc.modified,(il.unit_price*sc.qty)
--   from inventory_stockchange sc
--   join inventory_shipment s on sc.shipment_id=s.id
--   join inventory_location sc_location on sc_location.id=sc.location_id
--   join inventory_location from_location on s.from_location_id=from_location.id
--   join inventory_location to_location on s.to_location_id=to_location.id
--   join inventory_itemlot il on il.id=sc.itemlot_id
--   join inventory_item i on i.id=il.item_id
--   join inventory_itemcategory c on c.id=i.category_id
--   join auth_user u on u.id=sc.user_id where s.active=1;
-- ;

-- find corrupted shipment
-- delete from inventory_stockchange where id=261112;

