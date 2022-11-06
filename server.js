import express from 'express';
import { create } from 'express-handlebars';
import { fileURLToPath } from 'url'
import { dirname } from "path";
import jwt from "jsonwebtoken";
import bodyParser from 'body-parser';
// import expressFileUpload from 'express-fileupload';
import { getUsuario, 
    getAllOrdenes,
    getOrdenes,
    getCategorias,
    getTiendas,
    getMarcas,
    getProductos,
    getStores,
    getDataUser,
    editarProducto,
    editarStock,
    getDataUsers,
    setUsuarioStatus,
    editarStaffs,
    deleteUsuario,
    nuevoUsuario } from './consultas.js';
    
import axios from 'axios';
import { send } from './utils/send.js';
const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )
const secretKey = "claveSecreta";

const app = express();
console.clear()

// Definimos nuestros Meddleware
app.use(express.static('public'));
app.use('/img',express.static(  `${__dirname}/img`  ));
app.use('/css',express.static(  `${__dirname}/css`  ));
app.use('/js',express.static(  `${__dirname}/js`  ));
app.use('/font',express.static(  `${__dirname}/font`  ));
app.use('/bootstrap',express.static(  `${__dirname}/node_modules/bootstrap/dist/css`  ));
app.use('/axios',express.static(  `${__dirname}/node_modules/axios/dist`  ));
app.use('/jquery',express.static(  `${__dirname}/node_modules/jquery/dist`  ));
app.use('/bootstrapJS',express.static(  `${__dirname}/node_modules/bootstrap/dist/js`  ));
app.use('/sweetalert2',express.static(  `${__dirname}/node_modules/sweetalert2/dist`  ));
app.use('/sweetalert2css',express.static(  `${__dirname}/node_modules/sweetalert2/dist`  ));

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())



// Consfiguramos a travez del metodo create
// Las vistas hacia Handelbars

const hbs = create({
    partialsDir:[
        "views/"
    ]
});

app.engine( "handlebars", hbs.engine );
app.set("view engine","handlebars");


const HATEOASV1 = async () =>{
    //const salida = await axios.get(`https://app-shopbikes.herokuapp.com/stores`)
    const salida = await axios.get(`http://localhost:3000/stores`)
    return salida  
}

// Ruta raiz
app.get('/', ( req, res )=>{
    res.render("admin",{
        layout:"home",
        title:"Bienvenido a BikeShop Sistema de búsqueda de ordenes",
    })
})

app.get('/logout', async(req,res)=>{
    res.render("dashboard",{
        layout:"home",
        title:"Sistema de búsqueda de ordenes",
        logout:"Su sesión ha caducado."
    })
})

// Ruta APIv1
app.get('/APIv1', async(req,res)=>{
    res.render("api",{
        layout:"api",
        title:"API desarrollada con NodeJs, Express, PostgresSql",
    })
})

// Ruta que recibe los criterios del form
app.post('/ordenes', async(req,res)=>{
    const { category_id, store_id , brand_name } = req.body
    const ordenes = await getOrdenes( category_id, store_id , brand_name );
    res.send(ordenes)
})

app.get('/ordenes', async(req,res)=>{
    const { category_id, store_id , brand_name } = req.body
    const ordenes = await getOrdenes( category_id, store_id , brand_name );
    res.send(ordenes)
})

app.get('/allordenes', async(req,res)=>{
    const ordenes = await getAllOrdenes();
    res.send(ordenes)
})

// Ruta que obtiene los usuarios desde la base de datos
app.get('/categorias', async(req,res)=>{
    const categorias = await getCategorias();
    res.send(categorias)
})

app.get('/tiendas', async(req,res)=>{
    const tiendas = await getTiendas();
    res.send(tiendas)
})

app.get('/marcas', async(req,res)=>{
    const marcas = await getMarcas();
    res.send(marcas)
})

app.get('/stores', async(req,res)=>{
    const stores = await getStores();
    // console.log('Salida de stores-->', stores)
    res.send(stores)
})

app.get('/api/v1/stores',(req,res)=>{
    HATEOASV1()
        .then(result =>{
            const rest = result.data
            const dataFiltrada = rest.map(element => {
                return {
                    store_name:element.store_name,
                    //src:`https://app-shopbikes.herokuapp.com/api/v1/store/${element.store_id}`,
                    src:`http://localhost:3000/api/v1/store/${element.store_id}`,
                }
            })
            
            res.send({
                stores:dataFiltrada,
            })
        })
})

const store = async( id ) =>{
    const stores = await getProductos( id )
    return stores.filter( element => element.store_id == id)
}

app.get("/api/v1/store/:id", (req,res)=>{
    const id = req.params.id;
    store(id)
        .then(result=>{
            const hola = result
            res.send(hola)
        })
})

// ACCESO LOGIN
app.post("/verify", async ( req,res ) =>{
    // Primero cecuperamos los datos enviados desde el Fron o sea Login
    const { email, password } = req.body;
    console.log('Salida de email y password-->',  email, password)
    const user = await getUsuario( email, password );

    console.log('Salida de user desde server', user)
    if(user){
        console.log('Salida de user.auth desde server', user.active )
        if(user.active){
            // Creamos un Token
            const token = jwt.sign( 
            {
                exp: Math.floor( Date.now() / 1000 ) + 300,
                data:user
            },
            secretKey 
            );
            res.send(token)
        }else{
            res.status(401).send({
                error:"Este usuario aún no ha sido autorizado, comuniquese con el administrador",
                code:404
            })
        }
    }else{
        res.status(404).send({
            error:"Este usuario no esta registrado en la base de datos",
            code:404
        })
    }

})

app.get('/admin', (req,res) => {

    const { token } = req.query
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTkxOTI0MzEsImRhdGEiOnsiaWQiOjIxLCJlbWFpbCI6ImdhYnJpZWxhNzNAZ21haWwuY29tIiwibm9tYnJlIjoiR2FicmllbGEiLCJwYXNzd29yZCI6IjEyMzQiLCJhdXRoIjp0cnVlfSwiaWF0IjoxNjU5MTkyMzExfQ.K5u8S0N6uFHbXW0lhtOYLHLHLVgrgG2iwQK6nAuEe3g
    jwt.verify( token, secretKey, async( err, decoded )=>{

        if(err){
            // res.status(401).send({
            //     error : "401 Unauthorized",
            //     message : "Usted no está autorizado para estar aquí",
            //     token_error : err.message,
            //     code:404
            // })

            res.redirect('/')

        }else{

            const dataUser = await getDataUser( decoded.data.email );
    
            console.log('Salida dataUser-->',dataUser)
            res.render("dashboard",{
                layout:"home",
                title:`Bienvenid@ ${decoded.data.first_name}`,
                nombre: decoded.data.first_name,
                logout:"Su sesión va expirar en menos",
                infoUser:dataUser
            })
            
        }
        
    })
})

app.get('/superadmin', (req,res) => {

    const { token } = req.query
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTkxOTI0MzEsImRhdGEiOnsiaWQiOjIxLCJlbWFpbCI6ImdhYnJpZWxhNzNAZ21haWwuY29tIiwibm9tYnJlIjoiR2FicmllbGEiLCJwYXNzd29yZCI6IjEyMzQiLCJhdXRoIjp0cnVlfSwiaWF0IjoxNjU5MTkyMzExfQ.K5u8S0N6uFHbXW0lhtOYLHLHLVgrgG2iwQK6nAuEe3g
    jwt.verify( token, secretKey, async( err, decoded )=>{

        if(err){
            // res.status(401).send({
            //     error : "401 Unauthorized",
            //     message : "Usted no está autorizado para estar aquí",
            //     token_error : err.message,
            //     code:404
            // })

            res.redirect('/')

        }else{

            const dataUsers = await getDataUsers(  );
    
            console.log('Salida dataUsersssss-->',dataUsers)

            res.render("superadmin",{
                layout:"admin",
                title:`Bienvenid@ ${decoded.data.first_name}`,
                nombre: decoded.data.first_name,
                logout:"Su sesión va expirar en menos",
                infoUsers:dataUsers,
                nuevoUsuario: true
            })
            
        }
        
    })
})

// Ruta que edita el estado de autorización de acceso
app.put('/usuario', async (req,res)=>{

    const { id ,auth } = req.body
    console.log(id,auth)
    const usuario = await setUsuarioStatus(id, auth);
    res.status(200).send(JSON.stringify(usuario))
})

app.post('/user', async(req,res)=>{
    const { email } = req.body
    const dataUser = await getDataUser( email );
    res.send(dataUser)
})

// Ruta para editar producto
app.put('/producto',async(req,res)=>{
    const producto  = req.body
    const actualizar = await editarProducto(producto)
    res.send(actualizar)
})

// Ruta para editar stock
app.put('/stock',async(req,res)=>{
    const stock  = req.body
    const actualizar = await editarStock(stock)
    res.send(actualizar)
})

// Ruta para obtener tabla de usuarios
app.get('/getstaffs',async(req,res)=>{
    const stock  = req.body
    const actualizar = await getDataUsers(stock)
    res.send( actualizar )
})

// Ruta para obtener tabla de usuarios
app.put('/editstaffs',async(req,res)=>{
    const stock  = req.body
    const actualizar = await editarStaffs(stock)
    res.send( actualizar )
})

// Ruta que va a regsitrar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const { nombre, apellido, email, celular, tienda, active, password } = req.body
    const usuario = await nuevoUsuario( nombre, apellido, email, celular, tienda, active, password )
    
    let datos = {
        asunto:`Tu cuenta en Bikeshop a sido inscrita correctamente`,
        texto:`Bienvenido ${nombre} ${apellido} a Bikeshop. Será notificado al administrador para que active su cuenta.`
    }

    const { asunto, texto } = datos
    send( email, asunto, texto )
    send('info.bikeshoping@gmail.com', `Activar cuenta usuario ${nombre} ${apellido}`,`Estimado Administrador el usuario ${nombre} ${apellido} ha sido registrado debes activarlo, confirmar a su correo ${email}`)

    res.status(201).send(JSON.stringify(usuario))
})

// Ruta para crear la vista del login
app.get('/login',(req,res)=>{
    res.render("login",{
        layout:"home",
        title:"Ingrese usuario y contraseña",
        ocultar:'Juan'
    })
})

// Eliminar usuario
app.delete('/usuario/:id', async(req,res)=>{
    const { id } = req.params;
    const usuario = deleteUsuario(id);
    res.status(200).send(JSON.stringify(usuario));
})

app.listen(process.env.PORT || 3000 )
console.log('Servidor arriba 🚀 en el puerto', process.env.PORT || 3000  )
