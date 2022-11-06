import * as UI from './interfaz.js'
import { infoProducto } from './infoProducto.js';
import replaceQuotes from './replaceQuotes.js';


const printTable = async ( category_id, store_id, brand_name ) => {
    UI.loading.style.display = "flex";
  
    await axios.post('https://app-shopbikes.herokuapp.com/ordenes',{
    //await axios.post('http://localhost:3000/ordenes',{
        category_id,
        store_id,
        brand_name
    })
    await axios.get('https://app-shopbikes.herokuapp.com/ordenes')
        .then( result => {
            const info = result.data
            if(info.length != 0){
                UI.infoTable.innerHTML=``
                info.forEach(element =>{
                    // console.log('Salida de element--->', element)
                    UI.infoTable.innerHTML+=`
                    <tr>
                    <td data-label="Tienda">${element.store_name}</td>
                    <td data-label="Producto">${replaceQuotes(element.product_name)}</td>
                    <td data-label="Inventario">${element.quantity}</td>
                    <td data-label="ID">${element.list_price}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" id="${element.product_id}">
                            Ver información
                        </button>
                    </td>
                </tr>`
                })
                UI.loading.style.display = "none";
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
                UI.loading.style.display = "none";
                UI.infoTable.innerHTML=`<tr> 
                    <td colspan="5">
                        <h5 class="text-center my-5">Lo sentimos la orden que esta buscando no existe!!</h5>
                    </td>
                </tr>`
            }
        })    
}


export default printTable