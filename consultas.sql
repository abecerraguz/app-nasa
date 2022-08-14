select st.store_name, p.product_id, p.product_name , s.quantity from categories c 
inner join products p on (p.category_id = c.category_id) 
inner join stocks s on (s.product_id = p.product_id) 
inner join stores st on (st.store_id = s.store_id) 
where c.category_id = 5 and s.store_id = 1 
order by p.product_name asc;

select p.product_id, p.product_name  from categories c 

inner join products p on (p.category_id = c.category_id) 
-- inner join stocks s on ( s.product_id = p.product_id ) 

order by p.product_name asc;

-- Por tienda
-- Por categoria
-- Por marca

select st.store_name, p.product_id, p.product_name , s.quantity from categories c 
inner join products p on (p.category_id = c.category_id) 
inner join stocks s on (s.product_id = p.product_id) 
inner join stores st on (st.store_id = s.store_id) 
where c.category_id = 5 and s.store_id = 1 and p.product_name like '%Electra%'
order by p.product_name asc;

select st.store_name, p.product_id, p.product_name , s.quantity from categories c 
inner join products p on (p.category_id = c.category_id) 
inner join stocks s on (s.product_id = p.product_id) 
inner join stores st on (st.store_id = s.store_id) 
where c.category_id = 5 and s.store_id = 3 and p.product_name like '%Haro%'
order by p.product_name asc;

-- Categories
SELECT * FROM categories;

-- Tiendas
SELECT stores.store_id, stores.store_name FROM stores order by store_id ASC;

-- Brands
SELECT * FROM brands;

select st.store_name, p.product_id, p.product_name , s.quantity from categories c 
inner join products p on (p.category_id = c.category_id) 
inner join stocks s on (s.product_id = p.product_id) 
inner join stores st on (st.store_id = s.store_id) 
order by p.product_name asc;

select br.brand_name, st.store_name, p.product_id, p.product_name , s.quantity from categories c 
inner join products p on (p.category_id = c.category_id) 
inner join stocks s on (s.product_id = p.product_id) 
inner join stores st on (st.store_id = s.store_id)
inner join brands br on (st.brand_id = p.brand_id)
order by p.product_name asc;


-- 
select cat.category_name, br.brand_name as nombre_marca, st.store_name as nombre_tienda, p.product_id, p.product_name , s.quantity from categories c 
inner join products p on (p.category_id = c.category_id) 
inner join stocks s on (s.product_id = p.product_id) 
inner join stores st on (st.store_id = s.store_id)
inner join brands br on (br.brand_id = p.brand_id)
inner join categories cat on (cat.category_id = p.category_id)
order by p.product_name asc;
