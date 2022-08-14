const enviar = document.querySelector('#enviar');
const category_id = document.querySelector('#category_id');
const store_id = document.querySelector('#store_id');
const reset = document.querySelector('#reset')

const infoProducto = (e)=>{
    console.log('Salida de e', e)
    const id = e.id
    console.log(id)
    $('#mensajesModal').modal('toggle')
    $('#mensajeLogin').modal('toggle'); 
}

const pintarTable = async()=>{

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
    })
}


enviar.addEventListener('click',(e)=>{

    e.preventDefault()
  
    const category_id = document.querySelector('#category_id').value
    const store_id = document.querySelector('#store_id').value
    const brand_name = document.querySelector('#brand_name').value
    const infoTable = document.querySelector('#infoTable')



    axios.post('https://app-shopbikes.herokuapp.com/ordenes',{
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
    
            console.log('Salida de infooooo',info)
            $('#mensajeLogin').modal('toggle');
            setTimeout(()=>{
              $('#mensajeLogin').modal('toggle'); 
            //   window.location.href = `/evidencias?token=${token}`
            },3000)
        }else{
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

