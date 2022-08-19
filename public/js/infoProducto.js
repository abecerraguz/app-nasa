const modalBody = document.querySelector('.modal-body');
const infoTienda = document.querySelector('.infoTienda');

export const infoProducto = ( store_name , product_id, product_name, quantity)=>{
    $('#mensajesModal').modal('toggle');
    modalBody.innerHTML=``
    modalBody.innerHTML=`<p>En la tienda <span class="text-uppercase text-danger">${store_name}</span> el producto <span class="text-uppercase text-danger">${product_name}</span> tiene un stock de <span class="text-uppercase text-danger">${quantity} bicicletas</span></p>`;
    infoTienda.innerHTML=`<h5 class="my-0">Tienda ${store_name}</h5>`      
}

