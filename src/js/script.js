'use strict';
setTimeout(() => {
    document.querySelector('.screen').classList.remove('d-none')
}, 1000);

const user = JSON.parse(localStorage.getItem('user'));
const loggedStatus = document.cookie ? JSON.parse(document.cookie.slice(7)) : null;

if (!user?.rememberd && !loggedStatus) window.location.href = "login.html";

const stateCol = document.querySelector('.state__col');
const allStateInput = document.querySelector('.all__state__input');
const form = document.querySelector('.state__form');
const totalState = document.querySelector('.total__state');
const confirmedCard = document.querySelector('.total__confirmed');
const activeCard = document.querySelector('.total__active');
const recoveredCard = document.querySelector('.total__recovered');
const logOut = document.querySelector('.log__out');
const statContainer = document.querySelector('.stat__container');

let allInputsArr;
let covidData;


const logOutUser = () => {
    user.rememberd = false;
    localStorage.setItem('user', JSON.stringify(user))
    document.cookie = "logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

const renderTotalState = (covidData, allState = true, selectedState) => {
    allState ? totalState.textContent = Object.keys(covidData).length : totalState.textContent = selectedState
}

const stateWise = []

const calcStatsBar = (state, confirmed, active, recovered) => {
    const confirmedPercent = (confirmed / 1000000) * 100;
    const activePercent = (active / confirmed) * 100;
    const recoveredPercent = (recovered / confirmed) * 100;

    const markup = `
            <div class="w-75 d-flex align-items-center stat__bar mb-4">
                <div class = "col-2"> <span class="mx-3 ">${state}</span></div>
                <div class="d-flex bg-dark" style=" width: ${confirmedPercent}%; height: 100% ;">
                <div class = "bg-danger" style="width: ${activePercent}% ;"></div>
                    <div class = "bg-success" style="width:${recoveredPercent}%;"></div>
                </div>
            </div>
            `

    statContainer.insertAdjacentHTML("afterbegin", markup)
}

const calcCases = (arr) => {
    statContainer.textContent = ""
    let totalConfirmed = 0;
    let totalRecovered = 0;
    let totalActive = 0;
    arr.map(state => {
        let stateConfirmed = 0;
        let stateRecovered = 0;
        let stateActive = 0;
        for (const key in covidData[state]['districtData']) {
            const element = covidData[state]['districtData'][key];
            let { active, confirmed, recovered } = element;
            stateActive += active;
            stateConfirmed += confirmed;
            stateRecovered += recovered;
        }
        const particularState = {
            [state]: {
                activeCase: stateActive,
                recoveredCase: stateRecovered,
                confirmedCase: stateConfirmed
            }
        }
        // stateWise.push(particularState)
        calcStatsBar(state, stateConfirmed, stateActive, stateRecovered)

        totalActive += stateActive
        totalRecovered += stateRecovered
        totalConfirmed += stateConfirmed
        console.log((stateConfirmed / 1000000) * 100);

    })
    confirmedCard.textContent = new Intl.NumberFormat('en-IN').format(totalConfirmed)
    activeCard.textContent = new Intl.NumberFormat('en-IN').format(totalActive)
    recoveredCard.textContent = new Intl.NumberFormat('en-IN').format(totalRecovered)
    // console.log(stateWise.map((stateData, i) => Object.keys(stateData)));
    // console.log(stateWise);

}

const renderCardData = (covidData, allState = true, selectedState = []) => {
    if (allState) {
        const stateArr = Object.keys(covidData);
        return calcCases(stateArr)
    }
    calcCases(selectedState)

}

const renderStates = (covidData) => {
    const getState = Object.keys(covidData);
    const markup = `
    ${getState.map(state => {
        return `
        <div class="mb-2">
        <input class="form-check-input state__input" checked value="${state}" type="checkbox" id="${state.slice(0, 7)}Check">
        <label class="form-check-label state__name ml-2" for="${state.slice(0, 7)}Check">
            ${state}
        </label>
    </div>
              `;
    }).join('')}
    `
    stateCol.insertAdjacentHTML('beforeend', markup)

}

const fetchCovidData = async () => {
    try {
        const res = await fetch('https://api.covid19india.org/state_district_wise.json');
        covidData = await res.json();
        delete covidData["State Unassigned"]
        renderStates(covidData)
        renderTotalState(covidData, true)
        renderCardData(covidData, true)
    } catch (error) {
        console.log(error);
    }
}

const checkedAllInputs = () => {
    allInputsArr = document.querySelectorAll('.state__input')
    if (allStateInput.checked) {
        allInputsArr.forEach(element => {
            element.checked = true;
        });
    } else {
        allInputsArr.forEach(element => {
            element.checked = false;
        });
    }
}

fetchCovidData()

allStateInput.addEventListener('click', checkedAllInputs);

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let selectedState = []
    document.querySelectorAll('.state__input').forEach(ele => {
        if (ele.checked) selectedState.push(ele.value)
    })
    renderTotalState(covidData, false, selectedState.length)
    renderCardData(covidData, false, selectedState)
})

logOut.addEventListener('click', logOutUser)