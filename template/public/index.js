document.querySelector(`#switchToRegister`).addEventListener(`click`, () => {
    document.querySelector(`#loginForm`).style.display = `none`;
    document.querySelector(`#registerForm`).style.display = `block`;
});

document.querySelector(`#switchToLogin`).addEventListener(`click`, () => {
    document.querySelector(`#registerForm`).style.display = `none`;
    document.querySelector(`#loginForm`).style.display = `block`;
});

const checkInputValue = (nameUser, password, e) => {
    if (/^\s*$/.test(nameUser.value) && /^\s*$/.test(password.value)) {
        e.preventDefault();
        alert("Данные введены не верно!");
        nameUser.value = ``;
        password.value = ``;
    }
}

document.querySelector(`#loginForm`).addEventListener(`submit`, (e) => {
    const nameUser = document.querySelector(`#nameUser`);
    const password = document.querySelector(`#loginPassword`);

    checkInputValue(nameUser, password, e);
});

document.querySelector(`#registrationForm`).addEventListener(`submit`, (e) => {
    const nameUser = document.querySelector(`#registerName`);
    const password = document.querySelector(`#registerPassword`);

    checkInputValue(nameUser, password, e);
});