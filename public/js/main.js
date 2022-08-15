const enviar = document.querySelector('#enviar');
const category_id = document.querySelector('#category_id');
const store_id = document.querySelector('#store_id');
const reset = document.querySelector('#reset');
const loading = document.querySelector('.contentSpinnerLoading');
loading.style.display = "none";
const modalBody = document.querySelector('.modal-body')



const pintarTable = async()=>{
    loading.style.display = "flex";
    await axios.get('https://app-shopbikes.herokuapp.com/ordenes')
        .then( result => {
            const info = result.data
            console.log('Salida de info', info)
            info.forEach(element =>{
                infoTable.innerHTML+=`
                <tr>
                <td>${element.store_name}</td>
                <td>${element.product_id}</td>
                <td>${element.product_name}</td>
                <td>${element.quantity}</td>
                <td><button type="button" class="btn btn-danger btn-sm" id="${element.product_id}" onclick="infoProducto(this)">Ver</button></td>
            </tr>`
            })
            loading.style.display = "none";
        })
}


enviar.addEventListener('click', async(e)=>{

    e.preventDefault()
  
    const category_id = document.querySelector('#category_id').value
    const store_id = document.querySelector('#store_id').value
    const brand_name = document.querySelector('#brand_name').value
    const infoTable = document.querySelector('#infoTable')

    loading.style.display = "flex";

    await axios.post('https://app-shopbikes.herokuapp.com/ordenes',{
        category_id,
        store_id,
        brand_name
    }).then( result =>{

        
        const info = result.data
        if(info.length != 0){
            infoTable.innerHTML=``
            info.forEach(element =>{
                infoTable.innerHTML+=`
                <tr>
                <td>${element.store_name}</td>
                <td>${element.product_id}</td>
                <td>${element.product_name}</td>
                <td>${element.quantity}</td>
                <td><button type="button" class="btn btn-danger btn-sm" onclick="infoProducto('${element.product_id}')">Ver</button></td>
            </tr>`
            })
            loading.style.display = "none";

            const infoProducto = async(e,info)=>{

                console.log('Salida de e', e)
                console.log('Info--->',info)
                const id = e.id
                await axios.get('https://app-shopbikes.herokuapp.com/ordenes')
                    .then(result =>{
                        $('#mensajesModal').modal('toggle')
                        const info = result.data
                        const buscado = info.find(element => element.product_id == id)
                        console.log('Salida de buscando--->', buscado )
                        modalBody.innerHTML=``
                        modalBody.innerHTML=`<p>En la tienda <span class="text-uppercase text-danger">${buscado.store_name}</span> el producto <span class="text-uppercase text-danger">${buscado.product_name}</span> tiene un stock de <span class="text-uppercase text-danger">${buscado.quantity} bicicletas</span></p>`
                    })
                console.log(id)
            }
            
            console.log('Salida de infooooo',info)




            $('#mensajeLogin').modal('toggle');
            setTimeout(()=>{
              $('#mensajeLogin').modal('toggle'); 
            //   window.location.href = `/evidencias?token=${token}`
            },3000)
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
    .then( result =>{
        const categorias = result.data
        console.log('Salida de categorias',categorias)
        categorias.forEach( element => {
            category_id.innerHTML+= `<option value="${element.category_id}">${element.category_name}</option>`
        });
})

// Insert option tiendas
axios.get('https://app-shopbikes.herokuapp.com/tiendas')
    .then( result =>{
        const tiendas = result.data
        tiendas.forEach( element => {
            store_id.innerHTML+= `<option value="${element.store_id}">${element.store_name}</option>`
        });
})

// Insert option marcas
axios.get('https://app-shopbikes.herokuapp.com/marcas')
    .then( result =>{
        const marcas = result.data
        marcas.forEach( element => {
            brand_name.innerHTML+= `<option value="${element.brand_name}">${element.brand_name}</option>`
        });
})

reset.addEventListener('click',(e)=>{
    e.preventDefault();
    window.location.href = `https://app-shopbikes.herokuapp.com`
})

pintarTable()

