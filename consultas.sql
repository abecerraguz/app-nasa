Host: ec2-3-225-110-188.compute-1.amazonaws.com
Database:d8e23pirsgbvqj
User:plhgziwympewbk
Port:5432
Password:d378cf61c2eab40529abc69ea7ae2dc24ff03f5eab300d43b19d5622acc0a56e
URI:postgres://plhgziwympewbk:d378cf61c2eab40529abc69ea7ae2dc24ff03f5eab300d43b19d5622acc0a56e@ec2-3-225-110-188.compute-1.amazonaws.com:5432/d8e23pirsgbvqj
Heroku CLI
heroku pg:psql postgresql-animate-40133 --app app-shopbikes

-- Conectarnos Heroku
psql -h ec2-3-225-110-188.compute-1.amazonaws.com -p 5432 -U plhgziwympewbk -W -d d8e23pirsgbvqj 

-- IMPORTAR BASE DE DATOS A MI MAQUINA A POSTGRES HEROKU
psql -h ec2-3-225-110-188.compute-1.amazonaws.com -d d8e23pirsgbvqj -U plhgziwympewbk -f /Users/abecerraguz/Desktop/db-postgres-bikeshop.sql;

/*
DEPLOY A HEROKU

heroku git:remote -a app-shopbikes
git push heroku master

// Para abrir
heroku open

// Para ver el proceso
heroku logs --tail
*/

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

-- AGREGAR LA COLUMNA PASSWORD
ALTER TABLE staffs
ADD COLUMN password VARCHAR(255);

alter table staffs alter column password set default '1234';
ALTER TABLE ONLY staffs ALTER COLUMN password SET DEFAULT '1234';
UPDATE staffs SET password='1234' WHERE staff_id=7;
UPDATE staffs SET password='1234' WHERE staff_id=8;
UPDATE staffs SET password='1234' WHERE staff_id=9;
UPDATE staffs SET password='1234' WHERE staff_id=10;


-- USAR LA EXTENSION CREATE EXTENSION pgcrypto;
-- http://rafinguer.blogspot.com/2019/08/encriptacion-de-columnas-en-postgresql.html
-- CREATE EXTENSION pgcrypto;

CREATE TABLE users(nombre VARCHAR(50), password VARCHAR(255));
INSERT INTO users ( nombre, password ) VALUES ('Rafael', PGP_SYM_ENCRYPT('mypassword','AES_KEY'));
SELECT nombre, pgp_sym_decrypt(password::bytea,'AES_KEY') FROM users;
UPDATE staffs SET password=(PGP_SYM_ENCRYPT('123456', 'AES_KEY'));



select sta.store_id, sta.email, sta.staff_id, st.store_name, p.product_id, p.product_name , p.list_price ,s.quantity from categories c 
inner join products p on (p.category_id = c.category_id) 
inner join stocks s on (s.product_id = p.product_id) 
inner join stores st on (st.store_id = s.store_id) 
inner join staffs sta on (sta.store_id = s.store_id) 
WHERE sta.email like '%jannette.david@bikes.shop%'
order by p.product_name asc;

SELECT * FROM staffs;

-- psql --host ec2-3-225-110-188.compute-1.amazonaws.com --port 5432 --username plhgziwympewbk --password --dbname d8e23pirsgbvqj

INSERT INTO staffs ( staff_id, first_name, last_name, email ,phone, active, store_id, manager_id, password ) values ( nextval('staff_id'),'Alex', 'Becerra', 'alejandrobecerrabecerra73@gmail.com', '984415629', 1, 1, 1, '123456' );
SELECT * FROM staffs;

-- mireya.copeland@bikes.shop
-- @Mi123456

ALTER TABLE staffs RENAME COLUMN password TO _password;
INSERT INTO staffs ( staff_id, first_name, last_name, email ,phone, active, store_id, manager_id, _password ) values ( nextval('staff_id'), 'Admin', 'Super Admin', 'alejandrobecerrabecerra73@gmail.com', '+56 9 4567 7890', '1', '1', '1', 'Adm@123456' );
-- Se crea una secuencia
create sequence staff_id
  minvalue 30
  maxvalue 999999
  increment by 1;

-- Elimina una secuencia
DROP SEQUENCE staff_id;

DELETE FROM staffs WHERE staff_id = '1000';


UPDATE staffs SET first_name='Admin', last_name = 'InfoBike', email = 'info.bikeshoping@gmail.com ', phone='+56984415629', active=1, store_id=1, manager_id=1, _password='Adm@123456'  WHERE staff_id=19;

