import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    // Conección para produccion pero para local o Local
    connectionString:process.env.DATABASE_URL,
    ssl:true

});

console.log('Salida de pool', pool)

export const getStores = async() => {

    const result = await pool.query(
        `Select * from stores;`
    );

    const stores = result.rows
    return stores

}

export const getProductos = async( id ) => {

    const result = await pool.query(
        `select st.store_id, st.store_name, cat.category_name as categoria, br.brand_name as marca, p.product_id, p.product_name , s.quantity from categories c 
        inner join products p on (p.category_id = c.category_id) 
        inner join stocks s on (s.product_id = p.product_id) 
        inner join stores st on (st.store_id = s.store_id)
        inner join brands br on (br.brand_id = p.brand_id)
        inner join categories cat on (cat.category_id = p.category_id)
        WHERE st.store_id='${id}';`
    );

    const productos = result.rows
    return productos

}

export const getAllOrdenes = async() => {

    const result = await pool.query(
        `select st.store_name, p.product_id, p.product_name , s.quantity from categories c 
        inner join products p on (p.category_id = c.category_id) 
        inner join stocks s on (s.product_id = p.product_id) 
        inner join stores st on (st.store_id = s.store_id) 
        order by p.product_name asc`
    );

    const ordenes = result.rows
    console.log('Salida de ordenes',ordenes)
    return ordenes

}

export const getOrdenes = async (category_id="1", store_id="1", brand_name="Electra" )  => {
    try {
        const result = await pool.query(
            `select st.store_name, p.product_id, p.product_name , s.quantity from categories c 
            inner join products p on (p.category_id = c.category_id) 
            inner join stocks s on (s.product_id = p.product_id) 
            inner join stores st on (st.store_id = s.store_id) 
            where c.category_id = ${category_id} and s.store_id = ${store_id} and p.product_name like '%${brand_name}%'
            order by c.category_id asc;`
        );
    
        const ordenes = result.rows
        return ordenes
    } catch (error) {
        console.log(error)
    }
   

}

export const getCategorias = async ()  => {
    const result = await pool.query(
        `SELECT * FROM categories order by category_id ASC;`
    );
    const ordenes = result.rows
    return ordenes
}

export const getTiendas = async ()  => {
    const result = await pool.query(
        `SELECT stores.store_id, stores.store_name FROM stores order by store_id ASC`
    );
    const ordenes = result.rows
    return ordenes
}

export const getMarcas = async ()  => {
    const result = await pool.query(
        `SELECT * FROM brands`
    );
    const ordenes = result.rows
    return ordenes
}


