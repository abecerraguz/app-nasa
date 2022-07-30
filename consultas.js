import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "nasa",
    port: 5432,
});

export const nuevoUsuario = async ( email, nombre, password )  => {

    const result = await pool.query(
        `INSERT INTO usuarios ( email, nombre, password , auth) values ( '${email}', '${nombre}', '${password}', false ) RETURNING *`
    );

    const usuario = result.rows[0]
    return usuario

}

export const  getUsuario = async ( email, password ) =>{
    try {
        const result = await pool.query(
         `SELECT * FROM usuarios WHERE email = '${email}' AND password = '${password}'`
        );
        return result.rows[0]
    } catch (error) {
        console.log(error);
        return false
    }
}

export const getUsuarios = async()=>{
    try {
        const result = await pool.query(
            `SELECT * FROM usuarios ORDER BY id ASC`
        );
        return result.rows
    } catch (error) {
        console.log(error)
        return error
    }
}

export const setUsuarioStatus = async( id, auth)=>{
    try {
        const result = await pool.query(
            `UPDATE usuarios SET auth = ${auth} WHERE id = ${id} RETURNING *`
        );
        const usuario = result.rows[0]
        return usuario
    } catch (error) {
        console.log(error)
        return false
    }
}

export const deleteUsuario = async (id) =>{
    try {
        const result = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}
