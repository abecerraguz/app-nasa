import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    // Conección para produccion pero para local o Local
    connectionString:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false
    }
});

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     password: "postgres",
//     database: "bikeshop",
//     port: 5432,
// });


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
    return ordenes

}

export const getOrdenes = async (category_id="1", store_id="1", brand_name="Electra" )  => {
   
    try {

        const result = await pool.query(
            `select st.store_name, p.product_id, p.product_name , s.quantity, p.list_price from categories c 
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

export const  getUsuario = async ( email, password ) =>{
    try {
        const result = await pool.query(
         `SELECT * FROM staffs WHERE email = '${email}' AND _password = '${password}'`
        );
        console.log('Salida de Usuario-->', result.rows[0] )
        return result.rows[0]
    } catch (error) {
        console.log(error);
        return false
    }
}

export const getDataUser = async ( email )  => {
    try {
        const result = await pool.query(
            `select sta.store_id, sta.email, sta.staff_id, st.store_name, p.product_id, p.model_year, p.product_name , s.quantity, p.list_price from categories c 
            inner join products p on (p.category_id = c.category_id) 
            inner join stocks s on (s.product_id = p.product_id) 
            inner join stores st on (st.store_id = s.store_id) 
            inner join staffs sta on (sta.store_id = s.store_id) 
            WHERE sta.email like '%${email}%'
            order by p.product_name asc;`
        );
    
        const ordenes = result.rows
        return ordenes
    } catch (error) {
        console.log(error)
    }
}

export const getDataUsers = async ()  => {
    const result = await pool.query(
        `SELECT * FROM staffs`
    );
    const data = result.rows
    return data
}

export const setUsuarioStatus = async( id, auth)=>{

    console.log('Salida de id--->', id )
    console.log('Salida de auth--->', auth )

    try {
        const result = await pool.query(
            `UPDATE staffs SET active = ${auth} WHERE staff_id = ${id} RETURNING *`
        );
        const usuario = result.rows[0]
        return usuario
    } catch (error) {
        console.log(error)
        return false
    }
}

export const editarProducto = async( producto ) =>{

    const values = Object.values( producto )
    console.log( 'Salida de values', values )

    // Salida de values [
    //     '257',
    //     "Electra Amsterdam Fashion 3i Ladies' - 2017/20188",
    //     '1',
    //     '1',
    //     '20188',
    //     '900'
    //   ]

    const consulta  = {
        text:"UPDATE products SET product_name=$2, brand_id=$3, category_id=$4, model_year=$5, list_price=$6 WHERE product_id = $1 RETURNING *;",
        values // [ '21', 'Titulo 1000','Esta es la descripcion' ]
    }

    const result = await pool.query(consulta)
    return result
}

export const editarStock = async( stock ) =>{

    const values = Object.values( stock )
    console.log( 'Salida de values stock', values )
    //Salida de values stock [ 1, '257', '25' ]
    const consulta  = {
        text:"UPDATE stocks SET quantity=$3 WHERE store_id=$1 AND product_id=$2 RETURNING *;",
        values // [ '21', 'Titulo 1000','Esta es la descripcion' ]
    }

    const result = await pool.query(consulta)
    return result
}

export const editarStaffs = async( users ) =>{

    const values = Object.values( users )
    console.log( 'Salida de values stock', values )
    //Salida de values stock [ 1, '257', '25' ]
    const consulta  = {
        text:'UPDATE staffs SET first_name=$2, last_name = $3, email = $4, phone=$5, active=$6, store_id=$7, manager_id=$8, _password=$9  WHERE staff_id=$1 RETURNING *;',
        values // [ '21', 'Titulo 1000','Esta es la descripcion' ]
    }

    const result = await pool.query(consulta)
    return result
}

export const nuevoUsuario = async ( nombre, apellido, email, phone, tienda=1, active=0, password )  => {

    const result = await pool.query(
        `INSERT INTO staffs ( staff_id, first_name, last_name, email ,phone, active, store_id, manager_id, _password ) values ( nextval('staff_id'), '${nombre}', '${apellido}', '${email}', '${phone}', ${active}, ${tienda}, 1, '${password}' ) RETURNING *`
    );

    const usuario = result.rows[0]
    return usuario

}

export const deleteUsuario = async ( id ) => {
    console.log('Salida de id--->',id)
    try {
        const result = await pool.query(`DELETE FROM staffs WHERE staff_id = ${id}`)
        return result
    } catch ( error ) {
        console.log(error)
        return error
    }
}


