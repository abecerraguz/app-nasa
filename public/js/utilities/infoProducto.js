import * as UI from './interfaz.js';
import replaceQuotes from './replaceQuotes.js'

const infoProducto = ( store_name , product_id, product_name, quantity )=>{
    $('#mensajesModal').modal('toggle');
    UI.infoModalBody.innerHTML=`<p>En la tienda <span class="text-uppercase text-danger">${store_name}</span> el producto <span class="text-uppercase text-danger">${product_name}</span> tiene un stock de <span class="text-uppercase text-danger">${quantity} bicicletas</span></p>`;
    UI.infoTienda.innerHTML=`<h5 class="my-0">Tienda ${store_name}</h5>`      
}

const editProducto = ( store_name , product_id, product_name, quantity, year, precio )=>{
    $('#mensajesModal').modal('toggle');
    UI.product_name.value = replaceQuotes( product_name );
    UI.quantity.value = quantity;
    UI.year.value = year;
    UI.price.value = precio;
}

const putProduct = ()=>{
    // https://app-shopbikes.herokuapp.com/
    // https://app-shopbikes.herokuapp.com
    axios.get('https://app-shopbikes.herokuapp.com/producto')
    .then( result =>{
        const marcas = result.data
        // console.log('Salida de marcas--->', marcas)
    })
    
}

export {
    infoProducto,
    editProducto,
    putProduct
}