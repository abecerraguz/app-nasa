import * as UI from './utilities/interfaz.js'
import { setupTimers } from './utilities/inactiveSesion.js'
import {editProducto} from './utilities/infoProducto.js'
import replaceQuotes from './utilities/replaceQuotes.js'
UI.loading.style.display = "none";
UI.alertDangerCategory.style.display = "none";
UI.alertDangerBrand.style.display = "none";


// Close sesion
UI.closeSesion.addEventListener('click',(e)=>{
    e.preventDefault();
    sessionStorage.removeItem('token');
    window.location.href = `/`;
})


const infoButton = document.querySelectorAll('#infoTable tr td button');
infoButton.forEach( element => {
    element.addEventListener('click',(e)=>{
        e.preventDefault();
        const infoId = e.target.id
        const email = e.target.name
        axios.post('https://app-shopbikes.herokuapp.com/user',{
        //axios.post('http://localhost:3000/user',{
         email   
        })
        .then( result =>{
            const dataEmail = result.data
            const buscar = dataEmail.find( element => element.product_id == infoId )
            const idTienda = buscar.store_id
            // console.log('Salida de buscar--->',buscar )
            editProducto( buscar.store_name, buscar.product_id, replaceQuotes(buscar.product_name), buscar.quantity, buscar.model_year, buscar.list_price )

            // console.log('Salida infoId', infoId)
            document.querySelector('#mensajesModal .modal-body form button.editar').setAttribute( 'id', infoId );

            // INICIO MODAL EDITAR
            UI.editar.addEventListener('click', (e)=>{
                e.preventDefault();
                let nombreProducto = UI.product_name.value
                let selectCategoria = UI.categoryNameSelect.value
                let brandNameSelect = UI.brandNameSelect.value
            
                let year = UI.year.value
                let quantity = UI.quantity.value
                let price = UI.price.value
                let infoId = e.target.id;
            
                UI.categoryNameSelect.addEventListener('change',(e)=>{
                    UI.alertDangerCategory.style.display = "none";
                    UI.categoryNameSelect.style.marginBottom = '1rem';
                })
            
                UI.brandNameSelect.addEventListener('change',(e)=>{
                    UI.alertDangerBrand.style.display = "none";
                    UI.brandNameSelect.style.marginBottom = '1rem';
                })
            
                UI.close.addEventListener('click',(e)=>{
                    e.preventDefault();
                    UI.alertDangerCategory.style.display = "none";
                    UI.categoryNameSelect.style.marginBottom = '1rem';
                    UI.alertDangerBrand.style.display = "none";
                    UI.brandNameSelect.style.marginBottom = '1rem';
                })
            
                if( selectCategoria != -1 && brandNameSelect != -1){
                    axios.put('https://app-shopbikes.herokuapp.com/stock',{
                    //axios.put('http:/localhost:3000/stock',{
                        idTienda,
                        infoId,
                        quantity
                    })
                    axios.put('https://app-shopbikes.herokuapp.com/producto',{
                    //axios.put('http://localhost:3000/producto',{
                        infoId,
                        nombreProducto,
                        brandNameSelect,
                        selectCategoria,
                        year,
                        price
                    })
                    .then( result => {
                        $('#mensajesModal').modal('toggle');
                        // window.location.reload();
                    })
                    .then( result => {
                            window.location.reload();
                            console.log('Salida del stock--->',result.data)
                    })
            
            
                }else{
                    UI.categoryNameSelect.style.margin = '0';
                    UI.brandNameSelect.style.margin = '0';
                    UI.alertDangerCategory.style.display = "block";
                    UI.alertDangerBrand.style.display = "block";
                    UI.alertDangerCategory.innerHTML = `Debes seleccionar una categoria`
                    UI.alertDangerBrand.innerHTML = `Debes seleccionar una marca`
                }
            
            })
            // CIERRE MODAL EDITAR

        })

    })
})



// Insert option categorias
//axios.get('https://app-shopbikes.herokuapp.comcategorias')
//https://app-shopbikes.herokuapp.com/
axios.get('https://app-shopbikes.herokuapp.com/categorias')
    .then( result =>{
        const categorias = result.data
        categorias.forEach( element => {
            UI.categoryNameSelect.innerHTML+= `<option value="${element.category_id}">${element.category_name}</option>`
        });
})

// Insert option marcas
//axios.get('https://app-shopbikes.herokuapp.commarcas')
// https://app-shopbikes.herokuapp.com/
axios.get('https://app-shopbikes.herokuapp.com/marcas')
    .then( result =>{
        const marcas = result.data
        marcas.forEach( element => {
            UI.brandNameSelect.innerHTML+= `<option value="${element.brand_id}">${element.brand_name}</option>`
        });
        // UI.brandNameSelect.selectedIndex = 4
})

setupTimers();


 









