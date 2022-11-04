// Valida si el correo es de un formato valido
export const checkEmail = ( val ) => {
    if(!val.match(/\S+@\S+\.\S+/)){
        return false;
    }
    if( val.indexOf(' ') != -1 || val.indexOf('..') != -1){
        return false;
    }
    return true;
}

export const checkPassword = ( val ) => { 
    if(val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)){ 
      return true;
    }else{ 
      return false;
    }
} 

export const checkString = ( val ) => { 
    if( /[a-zA-Z]+/i.test(val)){ 
      return true;
    }else{ 
      return false;
    }
} 

export const checkCelular = ( val ) =>{ 
    if( /\D*([+56][2-9])(\d{9})\D*/.test(val)){ 
      return true;
    }else{ 
      return false;
    }
} 