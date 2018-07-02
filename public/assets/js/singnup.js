


const checkPW = function(){
  let password = document.getElementById("password").value;
  let check = document.getElementById("check").value;
  
  if (password === check){
    document.getElementById("Button").disabled = false;
    document.getElementById("message").innerHTML="Thank You!!";
  } else{
    document.getElementById("Button").disabled = true;
    document.getElementById("message").innerHTML="Passwords dont match!";
  }
};

let aaa = document.querySelector("#check");
aaa.addEventListener("click", checkPW, false);