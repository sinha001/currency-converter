/*
Currency Converter - Mini Project

This script fetches real-time currency exchange rates and allows users to convert amounts between selected currencies.
Process Overview:
1. Populate dropdowns for currency selection using a predefined country list.
2. Automatically update the currency flag based on the selected currency.
3. Fetch the exchange rate from an API for the selected currencies.
4. Display the converted amount based on user input and selected currencies.
5. Ensure default values are set for smoother user experience.
*/

const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Select DOM elements for dropdowns, buttons, and display areas
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#submit");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

/* 
Populate currency dropdowns:
- Loops through the country list to populate the "from" and "to" dropdown menus.
- Sets default values to USD (from) and INR (to).
- Adds event listeners to dynamically update flags when a currency is changed.
*/
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode; // Display currency code (e.g., USD, INR)
    newOption.value = currCode; // Assign value to the option
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected"; // Set default "from" currency to USD
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected"; // Set default "to" currency to INR
    }
    select.append(newOption); // Add the option to the dropdown
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target); // Update flag whenever the currency is changed
  });
}

/*
Update the flag next to a dropdown based on the selected currency.
- Dynamically constructs the flag URL using the currency's associated country code.
*/
const updateFlag = (element) => {
  let currCode = element.value; // Get the selected currency code
  let countryCode = countryList[currCode]; // Map currency to country code
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; // Construct flag URL
  let img = element.parentElement.querySelector("img"); // Get the associated flag image element
  img.src = newSrc; // Update the flag
};

/*
Fetch and update the exchange rate:
- Retrieves exchange rates from the API for the selected "from" currency.
- Calculates the converted amount based on the user input and the fetched rate.
- Displays the result in the message container.
*/
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value; // User input amount
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1; // Default to 1 if the input is empty or invalid
    amount.value = amtVal; // Update the input field
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`; // API URL for the "from" currency
  let response = await fetch(URL); // Fetch exchange rate data
  let data = await response.json();
  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()]; // Extract rate for "to" currency

  let finalAmount = amtVal * rate; // Calculate converted amount
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`; // Display conversion result
};

// Add event listener to the convert button to trigger exchange rate calculation
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form submission
  updateExchangeRate(); // Update and display exchange rate
});

// Automatically calculate exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
