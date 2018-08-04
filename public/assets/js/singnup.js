
let button =document.getElementById("Button");

const checkPW = function(){
  let password = document.getElementById("password").value;
  let check = document.getElementById("check").value;
  
  if (password === check){
    document.getElementById("Button").disabled = false;
    document.getElementById("message").innerHTML="Passwords match";
  } else{
    document.getElementById("Button").disabled = true;
    document.getElementById("message").innerHTML="Passwords don\'t match!";
  }
};

button.addEventListener("mouseenter", checkPW, false);
button.addEventListener("touchenter", checkPW, false);