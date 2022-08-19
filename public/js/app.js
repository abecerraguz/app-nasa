import * as UI from './interfaz.js'
import printTable from './printTable.js';
UI.loading.style.display = "none";

// Filtrar busqueda
UI.enviar.addEventListener('click', async(e)=>{
    e.preventDefault()
    UI.loading.style.display = "flex";
    printTable( UI.category_id.value, UI.store_id.value, UI.brand_name.value )
})

// Insert option de categoria 
axios.get('https://app-shopbikes.herokuapp.com/categorias')
//axios.get('http://localhost:3000/categorias')
    .then( result =>{
        const categorias = result.data
        categorias.forEach( element => {
            category_id.innerHTML+= `<option value="${element.category_id}">${element.category_name}</option>`
        });
})

// Insert option tiendas
axios.get('https://app-shopbikes.herokuapp.com/tiendas')
//axios.get('http://localhost:3000/tiendas')
    .then( result =>{
        const tiendas = result.data
        tiendas.forEach( element => {
            UI.store_id.innerHTML+= `<option value="${element.store_id}">${element.store_name}</option>`
        });
})

// Insert option marcas
axios.get('https://app-shopbikes.herokuapp.com/marcas')
//axios.get('http://localhost:3000/marcas')
    .then( result =>{
        const marcas = result.data
        marcas.forEach( element => {
            UI.brand_name.innerHTML+= `<option value="${element.brand_name}">${element.brand_name}</option>`
        });
})

UI.reset.addEventListener('click',(e)=>{
    e.preventDefault();
    window.location.href = `https://app-shopbikes.herokuapp.com`
    //window.location.href = `http://localhost:3000`
})

printTable();



