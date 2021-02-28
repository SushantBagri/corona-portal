const loginForm = document.querySelector('.login__form')
const inputLoginEmail = document.querySelector('.login__email');
const inputLoginPass = document.querySelector('.login__password');
const inputLoginRemember = document.querySelector('.remember__input');
const userMessage = document.querySelector('.user__message');

setTimeout(() => {
    document.querySelector('.screen').classList.remove('d-none')
}, 1000);
let user = JSON.parse(localStorage.getItem('user'));
const loggedStatus = document.cookie ? JSON.parse(document.cookie.slice(7)) : null
if (user?.rememberd || loggedStatus) { window.location.href = "index.html" }


const userAuthenticate = (user, formData) => {
    if (user.email === formData.email && user.password === formData.password) {
        user.rememberd = formData.rememberd;
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    }
    displayMessage('Email id or password is wrong')
    return false;
}
const displayMessage = (message) => {
    userMessage.classList.remove('d-none')
    userMessage.classList.add('alert-danger')
    return userMessage.textContent = message
}

const loginFormSubmition = (e) => {
    e.preventDefault();
    const formData = {
        email: inputLoginEmail.value,
        password: inputLoginPass.value,
        rememberd: inputLoginRemember.checked,
    }
    if (userAuthenticate(user, formData)) {
        let now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);
        document.cookie = "logged=true; expires=" + now.toUTCString() + "; path=/";
        return window.location.href = "index.html"
    }
}

loginForm.addEventListener('submit', loginFormSubmition)