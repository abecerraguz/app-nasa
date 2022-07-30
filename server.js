import express from 'express';
import { create } from 'express-handlebars';
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url'
import { dirname } from "path";
import bodyParser from 'body-parser';
import expressFileUpload from 'express-fileupload';
import { nuevoUsuario, getUsuario, getUsuarios, setUsuarioStatus, deleteUsuario } from './consultas.js'
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

// Definimos el MiddleWare de configuracion de FileUpload
app.use( expressFileUpload({
    limits:{ fileSize : 5000000 },
    abortOnLimit:true,
    responseOnLimit:"El peso del archivo es sobrepasa el limite"
}))

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

// Ruta que muestra el formulario de registro
app.get("/", (req,res) => {
    res.render("home",{
        layout:"main",
        title:"La NASA Buscando un ET"
    })
})

// Ruta que va a regsitrar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const { email, nombre, password } = req.body
    const usuario = await nuevoUsuario(email,nombre,password)
    res.status(201).send(JSON.stringify(usuario))
})

// Ruta para crear la vista del login
app.get('/login',(req,res)=>{
    res.render("login",{
        layout:"main",
        title:"Ingrese usuario y contraseña"
    })
})

// Ruta de verificacion 
// si el usuario existe en la base de datos ?
// El usuario esta autorizado o no esta autorizado (true / false ) para poder subir fotos ?

app.post("/verify", async ( req,res ) =>{
    // Primero cecuperamos los datos enviados desde el Fron o sea Login
    const { email, password } = req.body;
    const user = await getUsuario( email, password );
    console.log('Salida de user desde server', user)
    if(user){
        console.log('Salida de user.auth desde server', user.auth )
        if(user.auth){
            // Creamos un Token
            const token = jwt.sign( 
            {
                exp: Math.floor( Date.now() / 1000 ) + 540,
                data:user
            },
            secretKey 
            );
            res.send(token)
        }else{
            res.status(401).send({
                error:"Este usuario aún no ha sido validado para subir imagenes",
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

// Ruta que obtiene los usuarios desde la base de datos
app.get('/admin',async (req,res)=>{
    const usuarios = await getUsuarios();
    console.log('Salida de usuarios-->',usuarios)

    res.render("admin",{
        layout:"main",
        title:"Sistema de habilitación de usuarios",
        usuarios
    })
})

// Ruta que edita el estado de autorización para poder sacar una foto
app.put('/usuario', async (req,res)=>{
    const {id ,auth } = req.body
    const usuario = await setUsuarioStatus(id, auth);
    res.status(200).send(JSON.stringify(usuario))
})

// Eliminar usuario
app.delete('/usuario/:id', async(req,res)=>{
    const { id } = req.params;
    const usuario = deleteUsuario(id);
    res.status(200).send(JSON.stringify(usuario));
})

// 
app.get('/evidencias',(req,res) => {

    const { token } = req.query
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTkxOTI0MzEsImRhdGEiOnsiaWQiOjIxLCJlbWFpbCI6ImdhYnJpZWxhNzNAZ21haWwuY29tIiwibm9tYnJlIjoiR2FicmllbGEiLCJwYXNzd29yZCI6IjEyMzQiLCJhdXRoIjp0cnVlfSwiaWF0IjoxNjU5MTkyMzExfQ.K5u8S0N6uFHbXW0lhtOYLHLHLVgrgG2iwQK6nAuEe3g
    jwt.verify( token, secretKey, ( err, decoded )=>{
        err
            ? res.status(401).send(
                res.send({
                    error : "401 Unauthorized",
                    messaege : "Usted no está autorizado para estar aquí",
                    token_error : err.message
                })
            )
            :
            console.log('salida de decoded--->', decoded )

            res.render("evidencias",{
                layout:"main",
                title:"Carga una foto de un extraterrestre",
                nombre: decoded.data.nombre
              
            })
    })
})

app.post('/upload',(req,res)=>{

    let foto = req.files;
    if( foto == null ){
        return res.status(400).send("Ningun archivo fue seleccionado!!")
    }
    foto = req.files.foto
    let name = foto.name
    // console.log('Salida de foto', foto )
    // // console.log('Salida de name',name)

    foto.mv(`${__dirname}/public/uploads/${name}`,(err)=>{
        if(err){
            console.log(err)
        }else{
            res.send('Archivo cargado')
        }
    })

})



  

app.listen(3000, ()=> console.log('Servidor arriba en el puerto 3000'))
