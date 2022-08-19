import infoProducto from './infoProducto.js';
import replaceQuotes from './replaceQuotes.js';

const enviar = document.querySelector('#enviar'),
reset = document.querySelector('#reset'),
loading = document.querySelector('.contentSpinnerLoading'),
infoTable = document.querySelector('#infoTable');


loading.style.display = "none";



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
                <td data-label="Producto">${replaceQuotes(element.product_name)}</td>
                <td data-label="Inventario">${element.quantity}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm" id="${element.product_id}">
                        Ver información
                    </button>
                </td>
            </tr>`

            })

            loading.style.display = "none";
            const infoButton = document.querySelectorAll('#infoTable tr td button');
            infoButton.forEach( element => {
                element.addEventListener('click',(e)=>{
                    e.preventDefault();
                    const infoId = e.target.id
                    const buscar = info.find( element => element.product_id == infoId )
                    infoProducto(buscar.store_name, buscar.product_id, replaceQuotes(buscar.product_name), buscar.quantity)
                })
            })

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
                <td data-label="Producto">${replaceQuotes(element.product_name)}</td>
                <td data-label="Inventario">${element.quantity}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm" id="${element.product_id}">
                        Ver información
                    </button>
                </td>
            </tr>`
            })
            loading.style.display = "none";
            const infoButton = document.querySelectorAll('#infoTable tr td button');
            infoButton.forEach( element => {
                element.addEventListener('click',(e)=>{
                    e.preventDefault();
                    const infoId = e.target.id
                    const buscar = info.find( element => element.product_id == infoId )
                    infoProducto(buscar.store_name, buscar.product_id, replaceQuotes(buscar.product_name), buscar.quantity)
                })
            })

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

