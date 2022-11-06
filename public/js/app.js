import * as UI from './utilities/interfaz.js'
import printTable from './utilities/printTable.js';
import { checkCelular, checkEmail, checkPassword, checkString } from './utilities/validacionForm.js'
// import logout from './utilities/logout.js';

UI.loading.style.display = "none";
UI.errorEmail.style.display = "none";
UI.errorPassword.style.display = "none";
UI.formLogin.style.display = "none";


UI.dropdownToggle.addEventListener('click', (e)=>{
    e.preventDefault()
    let email = document.querySelector("#email")
    let password = document.querySelector("#password")
    email.value = ''
    password.value = ''
})



function toggle(el,classname){
    if(el.classList.contains(classname)){
        console.log('Salida de el',el)
        el.classList.remove(classname)
    }else{
        el.classList.add(classname)
    }
}


UI.linkShowLink.addEventListener('click', (e)=>{
    toggle(UI.divForm, 'hidden')
})

// INICIO MANEJO DEL TAB LOGIN Y REGISTRARSE
let opciones = document.querySelectorAll('#divForm ul li a');

opciones.forEach( element =>{
    element.addEventListener('click',(e)=>{
        e.preventDefault();
        let idLink = e.target.id
        if( idLink == 'login' ){
            console.log('Salida de login')
            console.log( 'SalidaaaXXXX', UI.formLogin )
            console.log( 'SalidaaaYYYY', UI.formRegistrarse )
            UI.login.classList.add('active')
            UI.registrarse.classList.remove('active')
            UI.formLogin.style.display = "none";
            UI.formRegistrarse.style.display = "block";
        }else if( idLink == 'registrarse' ){
            console.log('Salida de registrarse')
            console.log( 'SalidaaaXXXX', UI.formLogin )
            console.log( 'SalidaaaYYYY', UI.formRegistrarse )
            UI.formLogin.style.display = "block";
            UI.formRegistrarse.style.display = "none";
            UI.login.classList.remove('active')
            UI.registrarse.classList.add('active')
        }

    })
})
// INICIO MANEJO DEL TAB LOGIN Y REGISTRARSE


// VALIDACION INPUT EMAIL
UI.inputEmail.addEventListener('input',(e)=>{
    let validaCorreo = checkEmail( e.target.value )
    let valueInput = e.target.value
    console.log('Holaaaa-->', valueInput )
    if( validaCorreo || valueInput.length === 0 ){
        UI.errorEmail.style.display = "none";
        UI.errorEmail.innerHTML = `` 
    }else{
        UI.errorEmail.style.display = "block";
        UI.errorEmail.innerHTML = `Debe ingresar un correo valido`   
    }
})

// VALIDACION INPUT PASSWORD
UI.inputPassword.addEventListener('input',(e)=>{
    let validaPassword = checkPassword( e.target.value )
    let valueInput = e.target.value
    if( validaPassword || valueInput.length === 0){
        UI.errorPassword.style.display = "none";
        UI.errorPassword.innerHTML = `` 
    }else{
        UI.errorPassword.style.display = "block";
        UI.errorPassword.innerHTML = `Clave entre 8 y 15 caracteres, que contenga una letra minúscula, una letra mayúscula, un dígito numérico y un carácter especial`   
    }
})

// VALIDA LOS DATOS DEL LOGIN CON LA BASE DE DATOS
UI.ingresar.addEventListener('click',(e)=>{
    e.preventDefault();
    verificacion();
})

// LIMPIA EL FORM DE REGISTRARSE
UI.registrarse.addEventListener('click',(e)=>{
    e.preventDefault()
    console.log('Registrarse');
    registrarNombre.value = ''
    registrarApellido.value = ''
    registrarEmail.value = ''
    registrarCelular.value = ''
    registrarPassword.value = ''
})

// VERIFICACION DEL USUARIO Y CONTRASENA
const verificacion = ()=>{
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    if( email && password ){
        axios.post('/verify',{
            email,
            password
        }).then( result =>{

            console.log('Salida XC--->', result.config.data )
            const admin = JSON.parse(result.config.data)
            const token = result.data
            
            $('#mensajeLogin').modal('toggle');
            sessionStorage.setItem('token', JSON.stringify(token) )
            
            console.log( 'Salida de admin === Adm@123456--->', admin === 'Adm@123456' )
            console.log( 'Salida de admin--->', admin  )
            console.log( 'Salida de admin.password--->', admin.password  )
            console.log('Salida de token--->', token )

            if( admin.password === 'Adm@123456'){
                console.log('Entreeeee')
                setTimeout(()=>{
                    $('#mensajeLogin').modal('toggle'); 
                    window.location.href = `/superadmin?token=${token}`
                },3000)
            }else{
                setTimeout(()=>{
                    $('#mensajeLogin').modal('toggle'); 
                    window.location.href = `/admin?token=${token}`
                },3000) 
            }
        })
        .catch( ({response}) =>{
            
            console.log( 'Salida de response-->', response )
            $('#mensajeLogin').modal('toggle');
            $('#mensaje').html(`${response.data.error}`)
    
            setTimeout(()=>{
              $('#mensajeLogin').modal('toggle'); 
            },3000)      
        })        
    }else{
        $('#mensajeLogin').modal('toggle');
        $('.mensaje').html(`Debe ingresar usuario y contraseña`)
        setTimeout(()=>{
            $('#mensajeLogin').modal('toggle'); 
        },3000)
    }
   
}


// Filtrar busqueda por ID de la categoría, ID de la tienda, nombre de la tienda
UI.enviar.addEventListener('click', async(e)=>{
    e.preventDefault()
    UI.loading.style.display = "flex";
    printTable( UI.category_id.value, UI.store_id.value, UI.brand_name.value )
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
            UI.store_id.innerHTML+= `<option value="${element.store_id}">${element.store_name}</option>`
        });
    })

// Insert option marcas
axios.get('https://app-shopbikes.herokuapp.com/marcas')
//axios.get('http://localhost:3000/marcas')
    .then( result =>{
        const marcas = result.data
        marcas.forEach( element => {
            UI.brand_name.innerHTML+= `<option value="${element.brand_name}">${element.brand_name}</option>`
        });
    })

UI.reset.addEventListener('click',(e)=>{
    e.preventDefault();
    //window.location.href = `https://app-shopbikes.herokuapp.com`
    window.location.href = `https://app-shopbikes.herokuapp.com`
    //window.location.href = `http://localhost:3000`
})

// INICIO VALIDACION FORMULARIO DE REGISRARSE
let nombreInput = document.querySelector("#registrarNombre")
let apellidoInput = document.querySelector("#registrarApellido")
let emailInput = document.querySelector("#registrarEmail")
let celularInput = document.querySelector("#registrarCelular")
let passwordInput = document.querySelector("#registrarPassword")

nombreInput.addEventListener('input', (e)=>{
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

apellidoInput.addEventListener('input', (e)=>{
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

emailInput.addEventListener('input', (e)=>{
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

celularInput.addEventListener('input', (e)=>{
    let validaCelular = checkCelular( e.target.value )
    let valueInput = e.target.value
    if(validaCelular || valueInput.length === 0 ){
        UI.errorCelular.style.display = "none";
        UI.errorCelular.innerHTML = `` 
    }else{
        UI.errorCelular.style.display = "block";
        UI.errorCelular.style.color = '#ff8484' 
        UI.errorCelular.innerHTML = `Debe ingresar un numero de celular correcto +56(2-9)12345678`   
    }
})

passwordInput.addEventListener('input', (e)=>{
    let validaPassword = checkPassword( e.target.value )
    let valueInput = e.target.value

    if(validaPassword || valueInput.length === 0 ){
        UI.errorClave.style.display = "none";
        UI.errorClave.innerHTML = `` 
    }else{
        UI.errorClave.style.display = "block";
        UI.errorClave.style.color= '#ff8484!important' 
        UI.errorClave.innerHTML = `Clave entre 8 y 15 caracteres, que contenga una letra minúscula, una letra mayúscula, un dígito numérico y un carácter especial`   
    }
})

//REGISTRAR USUARIO
const buttonRegistrarse = document.querySelector("#nuevoUsuario");

//SI EL USUARIO SE REGISTRO LO LLEGA A LA PAGINA LOGIN
buttonRegistrarse.addEventListener("click",(e)=>{
    e.preventDefault();
    console.log('Hola me estoy registrando')

    let nombre = nombreInput.value
    let apellido = apellidoInput.value
    let email = emailInput.value
    let celular = celularInput.value
    let password = passwordInput.value

    if( nombre && apellido && email && celular && password ){
        axios.post('https://app-shopbikes.herokuapp.com/usuarios', {
        //axios.post('http://localhost:3000/usuarios', {
            nombre,
            apellido,
            email,
            celular,
            password
        })
        .then((response) => {
            console.log(response.data);
                $('#mensajeRegistrado').modal('toggle');
            setTimeout(()=>{
                $('#mensajeRegistrado').modal('toggle');
                location.href = "https://app-shopbikes.herokuapp.com/login"
                //location.href = "http://localhost:3000/login"
            },5000)
        })
        .catch((error) => {
            console.log(error);
        });
    }else{
        UI.mensaje.innerHTML = 'Debe llenar los campos del formulario!!'
        $('#mensajeLogin').modal('toggle');
        setTimeout(()=>{
            $('#mensajeLogin').modal('toggle'); 
        },5000)
    }
    

})
// CIERRE REGISTRAR USUARIO


printTable();







