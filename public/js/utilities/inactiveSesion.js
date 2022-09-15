let timeoutInMiliseconds = 10000;
let timeoutId; 
let nextSesion = document.querySelector('#nextSesion');
let myDiv = document.getElementById('result');
var myModal = new bootstrap.Modal(document.getElementById('infoSesion'))


export const startTimer = () => { 
    timeoutId =    setTimeout( doInactive, timeoutInMiliseconds );
}

export const resetTimer = () => { 
    window.clearTimeout( timeoutId )
    startTimer();
}
 
export const doInactive = () => {

    //$('#mensajesModal').modal('toggle');
    myModal.show();

    myDiv.innerHTML = ``
    myDiv.innerHTML = 20

    function countDown(){

        nextSesion.addEventListener('click',(e)=>{
            e.preventDefault();
            clearInterval(myTime);
        })

        if( myDiv.textContent <= 0 ){
            myDiv.textContent="Done..";
            //$('#mensajesModal').modal('toggle');
            myModal.hide();
            sessionStorage.removeItem('token');
            window.location.href = `/`;
            clearInterval(myTime);
        }else{
            myDiv.textContent = myDiv.textContent -1;
        }
      
    }
    
    let myTime = setInterval(countDown,1000);
     
}
 
export const setupTimers = () => {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    startTimer();
}

