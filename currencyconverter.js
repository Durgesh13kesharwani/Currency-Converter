const BASE_URL = "https://v6.exchangerate-api.com/v6/8da4da60cbe57dec9ced89c8/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes (assuming you have a 'countryList' object with currency codes)
for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        // Fetch exchange rates for all currencies against USD (or your selected from currency)
        const URL = `${BASE_URL}`; // No need to modify URL based on from/to currency
        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates");
        }

        let data = await response.json();
        let rate = data.conversion_rates[toCurr.value]; // Get the conversion rate for the selected "to" currency

        if (rate) {
            let finalAmount = amtVal * rate;
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
        } else {
            msg.innerText = "Invalid currency selected.";
        }
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        msg.innerText = "Failed to fetch exchange rate.";
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

window.addEventListener("load", () => {
    updateExchangeRate();
});
