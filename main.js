let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";
    acceptData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = [{}];

let acceptData = () => {
  data.push({
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
  });

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks();
};

let createTasks = () => {
  tasks.innerHTML = "";
  data.map((x, y) => {
    return (tasks.innerHTML += `
    <div id=${y}>
          <span class="fw-bold">${x.text}</span>
          <span class="small text-secondary">${x.date}</span>
          <p>${x.description}</p>
  
          <span class="options">
          <i onClick= "checkTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-check"></i>  
          <i onClick= "editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
          <i onClick ="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
        
          </span>
        </div>
    `);
  });

  resetForm();
};

let checkTask = (e) => {
  e.parentElement.parentElement.style.cssText = "text-decoration:line-through; background:rgba(243, 46, 46, 0.3);";
  localStorage.setItem("data", JSON.stringify(data));  
}

let deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  data.splice(e.parentElement.parentElement.id, 1);
  localStorage.setItem("data", JSON.stringify(data));
  console.log(data);
  
};

let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  textInput.value = selectedTask.children[0].innerHTML;
  dateInput.value = selectedTask.children[1].innerHTML;
  textarea.value = selectedTask.children[2].innerHTML;

  deleteTask(e);
};

let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || []
  console.log(data);
  createTasks();
})();




//********************************
//****CODIGO COUNTDOWN TIMER*****
//********************************
const inputContainer = document.getElementById('input-container')
const countdownForm = document.getElementById('countdownForm')
const dateEl = document.getElementById('date-picker')

const countdownEl = document.getElementById('countdown')
const countdownElTitle = document.getElementById('countdown-title')
const countdownBtn = document.getElementById('countdown-button')
const timeElements = document.querySelectorAll('span2')

const completeEl = document.getElementById('complete')
const completeElInfo = document.getElementById('complete-info')
const completeBtn = document.getElementById('complete-button')

let countdownTitle=''
let countdownDate=''
let countdownValue=Date;
let countdownActive;
let savedCountdown;   //para el guardar en localstorage el title y date

const second = 1000
const minute= second * 60
const hour = minute * 60
const day = hour * 24

// Set date input min. with Todays date
const today = new Date().toISOString().split('T')[0]
dateEl.setAttribute('min',today)

//populate countdown and complete UI
function updateDom(){
  countdownActive = setInterval(()=>{
    const now = new Date().getTime()
  const distance = countdownValue - now
  console.log('distance', distance)
  
  const days = Math.floor(distance / day)
  const hours = Math.floor((distance % day) / hour)
  const minutes = Math.floor((distance % hour) / minute)
  const seconds = Math.floor((distance % minute) / second)
  console.log(days,hours,minutes,seconds)
  
  //Hide input
  inputContainer.hidden= true
    
  //if the countdown has ended, in this case show complete
    if(distance <0){
      countdownEl.hidden = true
      clearInterval(countdownActive)
      completeElInfo.textContent = `*${countdownTitle}/ FINISHED on  ${countdownDate}`
      completeEl.hidden=false
    }else{
      //show the countdown in progress
      countdownElTitle.textContent = `${countdownTitle}`   
  timeElements[0].textContent = `${days} `   
  timeElements[1].textContent = `${hours} `
  timeElements[2].textContent = `${minutes} `
  timeElements[3].textContent = `${seconds} `
  completeEl.hidden=true
  countdownEl.hidden=false
    }
    
  }, second)
}

//take values from our form input  (Guardar informacion en el LOCALSTORAGE)
function updateCountdown(e){
  e.preventDefault()
  countdownTitle=e.srcElement[0].value
  countdownDate=e.srcElement[1].value
  savedCountdown ={
    title:countdownTitle,
    date:countdownDate
  }
  localStorage.setItem('countdown', JSON.stringify(savedCountdown))
  
  console.log(countdownTitle, countdownDate)
  
  //check for Valid Date
  if(countdownDate === ''){
    alert('Please select a date for the Countdown.')
  }else{
    //get number version of current date
  countdownValue= new Date(countdownDate).getTime()
  console.log('countdown value:', countdownValue)
  updateDom()
  }
}

//Reset Values
function reset(){
  //hide countdown and show inputs
  countdownEl.hidden= true
  completeEl.hidden=true
  inputContainer.hidden=false
  //stop the countdown
  clearInterval(countdownActive)
  //Reset Values
  countdownTitle=''
  countdownDate= ''
}
function restorePreviousCountdown(){
  if(localStorage.getItem('countdown')){
    inputContainer.hidden=true
    savedCountdown=JSON.parse(localStorage.getItem('countdown'))
    countdownTitle=savedCountdown.title
    countdownDate=savedCountdown.date
    countdownValue = new Date (countdownDate).getTime()
    updateDom()
  }
}

//Event Listeners
countdownForm.addEventListener('submit', updateCountdown)
countdownBtn.addEventListener('click', reset)
completeBtn.addEventListener('click', reset)

//on Load, check localStorage, llamamos la funcion para que la informacion no se pierda cuando se recarga la pagina
restorePreviousCountdown()
