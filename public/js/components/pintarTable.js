import * as UI from './interfaz.js';
import infoProducto from './infoProducto.js';
import replaced from './replaced.js'

export const pintarTable = async()=>{
    UI.loading.style.display = "flex";
    await axios.get('https://app-shopbikes.herokuapp.com/ordenes')
        .then( result => {
            const info = result.data
            info.forEach(element =>{
                UI.infoTable.innerHTML+=`
                <tr>
                <td>${element.store_name}</td>
                <td>${element.product_id}</td>
                <td>${replaced(element.product_name)}</td>
                <td>${element.quantity}</td>
                <td>
                <button type="button" class="btn btn-danger btn-sm" id="${element.product_id}" onclick='${infoProducto(element.store_name,element.product_id,replaced(element.product_name),element.quantity)}'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                    <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
                    <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                </button>
                </td>
            </tr>`
            })
            UI.loading.style.display = "none";
        })    
}

{/* <button type="button" class="btn btn-danger btn-sm" id="${element.product_id}" onclick='infoProducto("${element.store_name}","${element.product_id}","${replaced(element.product_name)}","${element.quantity}")'></button> */}