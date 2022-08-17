import * as UI from './interfaz.js';
const infoProducto = ( store_name, product_id, product_name, quantity)=>{
    $('#mensajesModal').modal('toggle');
    UI.modalBody.innerHTML=``
    UI.modalBody.innerHTML=`<p>En la tienda <span class="text-uppercase text-danger">${store_name}</span> el producto <span class="text-uppercase text-danger">${product_name}</span> tiene un stock de <span class="text-uppercase text-danger">${quantity} bicicletas</span></p>`;
    UI.infoTienda.innerHTML=`<h5 class="my-0">Tienda ${store_name}</h5>`      
}
export default infoProducto;