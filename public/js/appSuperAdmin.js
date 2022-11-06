
import * as UI from './utilities/interfaz.js'
import { checkCelular, checkEmail, checkPassword, checkString } from './utilities/validacionForm.js'

document.querySelector('.contentSpinnerLoading').style.display = 'none'
const inputCheck = document.querySelectorAll('#infoTable tr td input')
let addUser = document.querySelector('#addUser')
let eliminarButton = document.querySelectorAll('#infoTable tr td button.delete')

console.log('Salida de UI',UI)

inputCheck.forEach( element =>{
    element.addEventListener('click', (e)=>{
        let dataInput = e.target
        changeStatus(dataInput)
    })
})

const modal = (msg)=>{
    $('#mensajesModalCheck').modal('toggle'); 
    $('.mensaje').html(msg);
    setTimeout(()=>{
        $('#mensajesModalCheck').modal('toggle'); 
    },3000)
}

// Validacion activar o desactivar usuario
const changeStatus = async( e ) => {
    let auth = e.checked ? 1 : 0;
    let id   = e.id
    await axios.put("https://app-shopbikes.herokuapp.com/usuario",{
    //await axios.put("http://localhost:3000/usuario",{
        id,
        auth
    })
    auth ? modal('Usuario habilitado') : modal('Usuario deshabilitado')
}


const infoButton = document.querySelectorAll('#infoTable tr td button.edit');
infoButton.forEach( element => {
    element.addEventListener('click',(e)=>{
            e.preventDefault();
            const email = e.target.name
            axios.get('https://app-shopbikes.herokuapp.com/getstaffs')
            //axios.get('http://localhost:3000/getstaffs')
            .then(result =>{
                const dataUsers = result.data
                const dataUser = dataUsers.find( element => element.email == email )
                console.log('Salida de dataUsers-->', dataUser )
                document.querySelector('#name').value = dataUser.first_name
                document.querySelector('#lastName').value = dataUser.last_name
                document.querySelector('#email').value = dataUser.email
                document.querySelector('#celular').value = dataUser.phone
                document.querySelector('#selectTienda').value = dataUser.store_id
                document.querySelector('#selectActive').value = dataUser.active
                document.querySelector('#password').value = dataUser._password
                document.querySelector('#mensajesModal .modal-body form button.editar').setAttribute( 'id', dataUser.staff_id );
                let infoTienda = document.querySelector('#mensajesModal .modal-header h5')
                console.log(infoTienda)
                infoTienda.innerText = 'Editar usuario'
                $('#mensajesModal').modal('toggle');
            })
    })
})

let guardarUsario = document.querySelector('#mensajesModal .modal-body form button.editar')

// INICIO MODAL EDITAR
guardarUsario.addEventListener('click', (e)=>{
    e.preventDefault();

    let id = e.target.id
    let name     = document.querySelector('#name').value
    let apellido = document.querySelector('#lastName').value
    let email    = document.querySelector('#email').value
    let celular  = document.querySelector('#celular').value
    let password = document.querySelector('#password').value
    let active = 1
    let store_id = 1
    let  manager_id = 1
    axios.put('https://app-shopbikes.herokuapp.com/editstaffs',
    //axios.put('http://localhost:3000/editstaffs',
    {
        id,
        name,
        apellido,
        email,
        celular,
        active,
        store_id,
        manager_id,
        password
        
    })
    .then( result =>{
        modal('Usuario modificado')
        $('#mensajesModal').modal('toggle');
        window.location.reload();
    })
    

// CIERRE MODAL EDITAR

})

// BOTON ACTIVA MODAL NUEVO USUARIO
addUser.addEventListener('click',(e)=>{
    e.preventDefault();
    $('#ModalNuevoUsuario').modal('toggle');
    let infoTienda = document.querySelector('#mensajesModal .modal-header h5')
    infoTienda.innerText = 'Nuevo usuario'
})
// CIERRE BOTON ACTIVA MODAL NUEVO USUARIO

// VALIDACION CAMPOS NUEVO USUARIO

UI.registrarNombre.addEventListener('input', (e)=>{
    let validaString = checkString( e.target.value )
    let valueInput = e.target.value
    if( validaString || valueInput.length === 0 ){
        UI.errorNombre.style.display = "none";
        UI.errorNombre.innerHTML = `` 
    }else{
        UI.errorNombre.style.display = "block";
        UI.errorNombre.style.color = '#ff8484' 
        UI.errorNombre.innerHTML = `Debes ingresar sólo letras`  
    }
})

UI.registrarApellido.addEventListener('input', (e)=>{
    let validaString = checkString( e.target.value )
    let valueInput = e.target.value
    if( validaString || valueInput.length === 0){
        UI.errorApellido.style.display = "none";
        UI.errorApellido.innerHTML = `` 
    }else{
        UI.errorApellido.style.display = "block";
        UI.errorApellido.style.color = '#ff8484' 
        UI.errorApellido.innerHTML = `Debes ingresar sólo letras`   
    }
})

UI.registrarEmail.addEventListener('input', (e)=>{
    let validaCorreo = checkEmail( e.target.value )
    let valueInput = e.target.value
    if(validaCorreo || valueInput.length === 0 ){
        UI.errorCorreo.style.display = "none";
        UI.errorCorreo.innerHTML = `` 
    }else{
        UI.errorCorreo.style.display = "block";
        UI.errorCorreo.style.color = '#ff8484' 
        UI.errorCorreo.innerHTML = `Debe ingresar un correo valido`   
    }
})

UI.registrarCelular.addEventListener('input', (e)=>{
    let validaCelular = checkCelular( e.target.value )
    let valueInput = e.target.value
    if(validaCelular || valueInput.length === 0 ){
        UI.errorCelular.style.display = "none";
        UI.errorCelular.innerHTML = `` 
    }else{
        UI.errorCelular.style.display = "block";
        UI.errorCelular.style.color = '#ff8484' 
        UI.errorCelular.innerHTML = `Debe ingresar un numero de celular correcto`   
    }
})

UI.registrarPassword.addEventListener('input',(e)=>{

    let validaPassword = checkPassword( e.target.value )
    let valueInput = e.target.value
    if( validaPassword || valueInput.length === 0){
        UI.errorClave.style.display = "none";
        UI.errorClave.innerHTML = `` 
    }else{
        UI.errorClave.style.display = "block";
        UI.errorClave.innerHTML = `Clave entre 8 y 15 caracteres, que contenga una letra minúscula, una letra mayúscula, un dígito numérico y un carácter especial`   
    }
})
// CIERRE DE VALIDACION NUEVO USUARIO



// REGISTRAR UN NUEVO USUARIO
const buttonRegistrarse = document.querySelector(".guardarNuevoUsuario");
buttonRegistrarse.addEventListener("click",(e)=>{
    
    e.preventDefault();

    console.log('Hola me estoy registrando', UI.nombreInput)

    let nombre = UI.registrarNombre.value
    let apellido = UI.registrarApellido.value
    let email = UI.registrarEmail.value
    let celular = UI.registrarCelular.value
    let tienda = UI.selectTienda.value
    let active = UI.selectActive.value
    let password = UI.registrarPassword.value


    console.log()

    if( nombre && apellido && email && celular && password ){
        axios.post('https://app-shopbikes.herokuapp.com/usuarios', {
        //axios.post('http://localhost:3000/usuarios', {
            nombre,
            apellido,
            email,
            celular,
            tienda,
            active,
            password
        })
        .then((response) => {
            UI.mensaje.innerText = 'Usuario registrado con exito!!'
            $('#mensajesModalCheck').modal('toggle');
            setTimeout(()=>{
                $('#mensajesModalCheck').modal('toggle'); 
                window.location.reload();
            },3000)
        })
        .catch((error) => {
            console.log(error);
        });
    }else{
        UI.mensaje.innerText = 'Debe llenar todos los campos'
        $('#mensajesModalCheck').modal('toggle');
        setTimeout(()=>{
            $('#mensajesModalCheck').modal('toggle'); 
        },3000)
    }
    

})
// CIERRE REGISTRAR UN NUEVO USUARIO


// INICIO ELIMINAR USUARIO
eliminarButton.forEach( element => {
    element.addEventListener('click', (e)=>{
        e.preventDefault();
        let id = e.target.id
        console.log('Salida de id',id)
        let idFinal = id.replace('_','')
  
        Swal.fire({
            title: 'Está seguro de eliminar al usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, seguro',
            cancelButtonText: 'No, no quiero'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Borrado!',
                    icon: 'success',
                    text: 'El archivo ha sido borrado'
                })
                console.log('XXXXX',idFinal)
                axios.delete(`https://app-shopbikes.herokuapp.com/usuario/${idFinal}`)
                //axios.delete(`http://localhost:3000/usuario/${idFinal}`)
                    .then( result =>{
                        console.log('Salida de result',result)
                        window.location.reload();
                    })
            }
          
        })
    
    })
})
// CIERRE ELIMINAR USUARIO



