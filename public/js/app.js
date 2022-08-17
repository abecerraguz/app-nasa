const enviar = document.querySelector('#enviar'),
category_id = document.querySelector('#category_id'),
store_id = document.querySelector('#store_id'),
reset = document.querySelector('#reset'),
loading = document.querySelector('.contentSpinnerLoading'),
modalBody = document.querySelector('.modal-body'),
infoTienda = document.querySelector('.infoTienda'),
brand_name = document.querySelector('#brand_name'),
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
                <td>${element.store_name}</td>
                <td>${element.product_id}</td>
                <td>${replaced(element.product_name)}</td>
                <td>${element.quantity}</td>
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
        })    
}

// Filtrar busqueda
enviar.addEventListener('click', async(e)=>{
    e.preventDefault()
 
    loading.style.display = "flex";
    const _category_id = category_id.value;
    const _store_id = store_id.value;
    const _brand_name = brand_name.value;
    await axios.post('https://app-shopbikes.herokuapp.com/ordenes',{
    //await axios.post('http://localhost:3000/ordenes',{
        _category_id,
        _store_id,
        _brand_name
    }).then( result =>{
        const info = result.data
        console.log('Salida de info--->',info)
        if(info.length != 0){
            infoTable.innerHTML=``
            info.forEach(element =>{
                infoTable.innerHTML+=`
                <tr>
                <td>${element.store_name}</td>
                <td>${element.product_id}</td>
                <td>${replaced(element.product_name)}</td>
                <td>${element.quantity}</td>
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

