const enviar = document.querySelector('#enviar'),
reset = document.querySelector('#reset'),
loading = document.querySelector('.contentSpinnerLoading'),
modalBody = document.querySelector('.modal-body'),
infoTienda = document.querySelector('.infoTienda'),
infoTable = document.querySelector('#infoTable');

loading.style.display = "none";

const infoProducto = ( store_name , product_id, product_name, quantity)=>{
    $('#mensajesModal').modal('toggle');
    modalBody.innerHTML=``
    modalBody.innerHTML=`<p>En la tienda <span class="text-uppercase text-danger">${store_name}</span> el producto <span class="text-uppercase text-danger">${product_name}</span> tiene un stock de <span class="text-uppercase text-danger">${quantity} bicicletas</span></p>`;
    infoTienda.innerHTML=`<h5 class="my-0">Tienda ${store_name}</h5>`      
}

const replaced = (str)=>{
    const out = str
    if(/'/g.test(str)){
        const replaced = str.replace(/'/g,`&apos;`);
        return replaced
    }

    if(/"/g.test(str)){
        const replaced = str.replace(/"/g ,`&quot;`);
        return replaced
    }
    return out
}

const pintarTable = async()=>{
    loading.style.display = "flex";
    await axios.get('https://app-shopbikes.herokuapp.com/ordenes')
    // await axios.get('http://localhost:3000/ordenes')
        .then( result => {
            const info = result.data
            info.forEach(element =>{
                infoTable.innerHTML+=`
                <tr>
                <td data-label="Tienda">${element.store_name}</td>
                <td data-label="ID">${element.product_id}</td>
                <td data-label="Producto">${replaced(element.product_name)}</td>
                <td data-label="Inventario">${element.quantity}</td>
                <td>
                <button type="button" class="btn btn-danger btn-sm" id="${element.product_id}" onclick='infoProducto("${element.store_name}","${element.product_id}","${replaced(element.product_name)}","${element.quantity}")'>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 576 512" style="enable-background:new 0 0 576 512;" xml:space="preserve">
           <style type="text/css">
               .st0{fill:#FFFFFF;}
           </style>
           <path class="st0" d="M279.6,160.4c2.8-0.3,5.6-0.4,8.4-0.4c53,0,96,42.1,96,96c0,53-43,96-96,96c-53.9,0-96-43-96-96
               c0-2.8,0.1-5.6,0.4-8.4c9.3,4.5,20.1,8.4,31.6,8.4c35.3,0,64-28.7,64-64C288,180.5,284.1,169.7,279.6,160.4z M480.6,112.6
               c46.8,43.4,78.1,94.5,92.9,131.1c3.3,7.9,3.3,16.7,0,24.6c-14.8,35.7-46.1,86.8-92.9,131.1C433.5,443.2,368.8,480,288,480
               s-145.5-36.8-192.6-80.6c-46.8-44.3-78.1-95.4-93-131.1c-3.3-7.9-3.3-16.7,0-24.6c14.9-36.6,46.2-87.7,93-131.1
               C142.5,68.8,207.2,32,288,32S433.5,68.8,480.6,112.6L480.6,112.6z M288,112c-79.5,0-144,64.5-144,144s64.5,144,144,144
               s144-64.5,144-144S367.5,112,288,112z"/>
           </svg>
                </button>
                </td>
            </tr>`

            })
            loading.style.display = "none";
        })    
}

// Filtrar busqueda
enviar.addEventListener('click', async(e)=>{
    e.preventDefault()
 
    loading.style.display = "flex";
    const brand_name = document.querySelector('#brand_name').value
    const category_id = document.querySelector('#category_id').value
    const store_id = document.querySelector('#store_id').value

    await axios.post('https://app-shopbikes.herokuapp.com/ordenes',{
    //await axios.post('http://localhost:3000/ordenes',{
        category_id,
        store_id,
        brand_name
    }).then( result =>{
        const info = result.data
        console.log('Salida de info--->',info)
        if(info.length != 0){
            infoTable.innerHTML=``
            info.forEach(element =>{
                infoTable.innerHTML+=`
                <tr>
                <td data-label="Tienda">${element.store_name}</td>
                <td data-label="ID">${element.product_id}</td>
                <td data-label="Producto">${replaced(element.product_name)}</td>
                <td data-label="Inventario">${element.quantity}</td>
                <td>
                <button type="button" class="btn btn-danger btn-sm" id="${element.product_id}" onclick='infoProducto("${element.store_name}","${element.product_id}","${replaced(element.product_name)}","${element.quantity}")'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                    <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
                    <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                </button>
                </td>
            </tr>`
            })
            loading.style.display = "none";
        }else{
            loading.style.display = "none";
            infoTable.innerHTML=`<tr> 
                <td colspan="5">
                    <h5 class="text-center my-5">Lo sentimos la orden que esta buscando no existe!!</h5>
                </td>
            </tr>`
        }
        
    })
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
            store_id.innerHTML+= `<option value="${element.store_id}">${element.store_name}</option>`
        });
})

// Insert option marcas
axios.get('https://app-shopbikes.herokuapp.com/marcas')
//axios.get('http://localhost:3000/marcas')
    .then( result =>{
        const marcas = result.data
        marcas.forEach( element => {
            brand_name.innerHTML+= `<option value="${element.brand_name}">${element.brand_name}</option>`
        });
})

reset.addEventListener('click',(e)=>{
    e.preventDefault();
    window.location.href = `https://app-shopbikes.herokuapp.com`
    //window.location.href = `http://localhost:3000`
})

pintarTable()

