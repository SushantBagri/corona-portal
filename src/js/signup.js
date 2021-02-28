'use strict';
//declearing html elements

setTimeout(() => {
    document.querySelector('.screen').classList.remove('d-none')
}, 1000);

const signupForm = document.querySelector('.sign__form')
const inputFirstName = document.querySelector('.sign__firstname');
const inputLastName = document.querySelector('.sign__lastname');
const inputPhone = document.querySelector('.sign__phone');
const inputDob = document.querySelector('.sign__dob');
const inputAdderess = document.querySelector('.sign__address');
const inputPin = document.querySelector('.sign__pin');
const inputEmail = document.querySelector('.sign__email');
const inputSetPass = document.querySelector('.sign__setpass');
const inputConfPass = document.querySelector('.sign__confpass');
const userMessage = document.querySelector('.user__message');
const callCode = document.getElementById('call__code');
const imgDiv = document.querySelector('.profile-pic-div');
const img = document.querySelector('#photo');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');
let flag = false;

//IF USER IS ALREADY LOGGED IN REDIRECT TO HOME PAGE 
let user = JSON.parse(localStorage.getItem('user'));
const loggedStatus = document.cookie ? JSON.parse(document.cookie.slice(7)) : null
if (user?.rememberd || loggedStatus) { window.location.href = "index.html" }

// validate user age

const calcAge = dob => {
    const milliSecDiff = Date.now() - (new Date(dob)).getTime(); // milliseconds difference between now and date of birth
    const age_dt = new Date(milliSecDiff); //  converting millisecond difference into date formate

    return Math.abs(age_dt.getUTCFullYear() - 1970); // returning age
}


// COUNTRY CODE FETCH AND INSERT INTO HTML;
const insertCallCode = (data) => {
    const markup = `
            ${data.map(code => { return (`<option ${(code.name === 'India') ? 'selected' : ''} value="${code.dial_code}">${code.dial_code} ${code.name} </option>`); })}
        `
    callCode.insertAdjacentHTML('afterbegin', markup)
}

const getCallCode = async () => {
    try {
        //fetch data for call code
        const res = await fetch('https://gist.githubusercontent.com/Goles/3196253/raw/9ca4e7e62ea5ad935bb3580dc0a07d9df033b451/CountryCodes.json')
        const data = await res.json()

        //call function for insert html
        insertCallCode(data);

    } catch (error) {
        console.log(error);
    }
}

const displayMessage = (message) => {
    userMessage.classList.remove('d-none')
    userMessage.classList.add('alert-danger')
    return userMessage.textContent = message
}

getCallCode()

//VALIDATE THE FORM
const formValidation = (user) => {
    if (user.firstName.length < 3 || user.lastName.length < 3) return displayMessage('Name must contain more than 3 letters');
    if (user.password.length < 7) return displayMessage('Password must contain more than 6 letters.');
    if (user.phoneNum.length !== 13) return displayMessage('Invalid phone number');
    if (!file.value) return displayMessage('Please uplaod your pic.')
    if (calcAge(user.birthDate) < 18) return displayMessage('Age restricted')

    flag = true;
}

const formSubmition = (e) => {
    e.preventDefault()
    const completeAddress = inputAdderess.value + ' ' + inputPin.value
    if (inputSetPass.value !== inputConfPass.value) return displayMessage('Password should be same.');
    const user = {
        firstName: inputFirstName.value.trim(),
        lastName: inputLastName.value.trim(),
        phoneNum: callCode.value.trim() + inputPhone.value.trim(),
        birthDate: inputDob.value.trim(),
        address: completeAddress,
        email: inputEmail.value.trim(),
        password: inputSetPass.value.trim(),
        rememberd: false
    }
    formValidation(user)
    if (!flag) return;
    //SEND ALL USER DATA IN LOCALSTORAGE
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = "login.html";
}

signupForm.addEventListener('submit', formSubmition)



// FOR PROFILE IMAGE UPLOAG

//if user hover on img div 

imgDiv.addEventListener('mouseenter', function () {
    uploadBtn.style.display = "block";
});

//if we hover out from img div

imgDiv.addEventListener('mouseleave', function () {
    uploadBtn.style.display = "none";
});

//when we choose a photo to upload

file.addEventListener('change', function () {
    //this refers to file
    const choosedFile = this.files[0];

    if (choosedFile) {

        const reader = new FileReader();

        reader.addEventListener('load', function () {
            img.setAttribute('src', reader.result);
        });
        reader.readAsDataURL(choosedFile);

    }
});