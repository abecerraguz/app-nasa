import * as UI from './interfaz.js'
import infoProducto from './infoProducto.js';
import replaceQuotes from './replaceQuotes.js';

const printTable = async (  ) => {
    // console.log( 'Llego info-->', brand_name,category_id,store_id )
    UI.loading.style.display = "flex";
    await axios.get('https://app-shopbikes.herokuapp.com/ordenes')
    // await axios.get('http://localhost:3000/ordenes')
        .then( result => {
            const info = result.data
            info.forEach(element =>{
                UI.infoTable.innerHTML+=`
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

        })    
}
export default printTable