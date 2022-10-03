import * as UI from './utilities/interfaz.js'
import printTable from './utilities/printTable.js';
// import logout from './utilities/logout.js';
UI.loading.style.display = "none";



// Login
UI.ingresar.addEventListener('click',(e)=>{
    e.preventDefault();
    verificacion();
})



const verificacion = ()=>{

    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    if( email&&password ){
        axios.post('/verify',{
            email,
            password
        }).then( result =>{
            const token = result.data
            $('#mensajeLogin').modal('toggle');
            sessionStorage.setItem('token', JSON.stringify(token) )
            console.log( 'Salida de token', token )
            setTimeout(()=>{
              $('#mensajeLogin').modal('toggle'); 
              window.location.href = `/admin?token=${token}`
            },3000)   
        })
        .catch( ({response}) =>{
            
            console.log( 'Salida de response-->', response )
            $('#mensajeLogin').modal('toggle');
            $('#mensaje').html(`${response.data.error}`)
    
            setTimeout(()=>{
              $('#mensajeLogin').modal('toggle'); 
            },3000)
                
        }) 
    }else{
        $('#mensajeLogin').modal('toggle');
        $('#mensaje').html(`Debe ingresar usuario y contraseña`)
    }
       

}

// Filtrar busqueda por ID de la categoría, ID de la tienda, nombre de la tienda
UI.enviar.addEventListener('click', async(e)=>{
    e.preventDefault()
    UI.loading.style.display = "flex";
    printTable( UI.category_id.value, UI.store_id.value, UI.brand_name.value )
})

// Insert option de categoria 
//axios.get('https://app-shopbikes.herokuapp.com/categorias')
// http://localhost:3000/
axios.get('http://localhost:3000/categorias')
    .then( result =>{
        const categorias = result.data
        categorias.forEach( element => {
            category_id.innerHTML+= `<option value="${element.category_id}">${element.category_name}</option>`
        });
})

// Insert option tiendas
// axios.get('https://app-shopbikes.herokuapp.com/tiendas')
// http://localhost:3000/
axios.get('http://localhost:3000/tiendas')
    .then( result =>{
        const tiendas = result.data
        tiendas.forEach( element => {
            UI.store_id.innerHTML+= `<option value="${element.store_id}">${element.store_name}</option>`
        });
})

// Insert option marcas
//axios.get('https://app-shopbikes.herokuapp.com/marcas')
// http://localhost:3000/
axios.get('http://localhost:3000/marcas')
    .then( result =>{
        const marcas = result.data
        marcas.forEach( element => {
            UI.brand_name.innerHTML+= `<option value="${element.brand_name}">${element.brand_name}</option>`
        });
})

UI.reset.addEventListener('click',(e)=>{
    e.preventDefault();
    //window.location.href = `https://app-shopbikes.herokuapp.com`
    window.location.href = `https://app-shopbikes.herokuapp.com`
})


printTable();







