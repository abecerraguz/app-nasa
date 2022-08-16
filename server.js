import express from 'express';
import { create } from 'express-handlebars';
// import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url'
import { dirname } from "path";
import bodyParser from 'body-parser';
// import expressFileUpload from 'express-fileupload';
import { getAllOrdenes ,getOrdenes, getCategorias, getTiendas, getMarcas,getProductos, getStores } from './consultas.js'
import axios from 'axios';
const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )

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


const HATEOASV1 = async() =>{
    const salida = await axios.get(`https://app-shopbikes.herokuapp.com/stores`)
    return salida  
}

// Ruta raiz
app.get('/', async(req,res)=>{
    res.render("admin",{
        layout:"main",
        title:"Sistema de búsqueda de ordenes",
    })
})

// Ruta que recibe los criterios del form
app.post('/ordenes', async(req,res)=>{
    const { category_id, store_id , brand_name } = req.body
    console.log('Salida de req.body-->', category_id, store_id , brand_name )
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
    console.log('Salida de stores-->', stores)
    res.send(stores)
})

app.get('/api/v1/stores',(req,res)=>{
    HATEOASV1()
        .then(result =>{
            const rest = result.data
            const dataFiltrada = rest.map(element => {
                return {
                    store_name:element.store_name,
                    src:`https://app-shopbikes.herokuapp.com/api/v1/store/${element.store_id}`,
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

app.listen(process.env.PORT || 3000 )
console.log('Servidor arriba 🚀 en el puerto', process.env.PORT || 3000  )
