const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button"); // Your 'Get Exchange Rate' button
const fromCurr = document.getElementById("fromCurrSelect");
const toCurr = document.getElementById("toCurrSelect");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector("input"); // Your amount input box

// Populate currency options and set flags
for (let select of dropdowns) {
  for (let currCode in countryList) {
    const newOption = document.createElement("option");
    newOption.innerHTML = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });

  updateFlag(select); // Set initial flag
}

// Function to update flag
function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const parent = element.closest(".flex-col");

  if (parent) {
    const img = parent.querySelector("img");
    if (img) {
      img.src = newSrc;
    }
  }
}

// Button click: fetch and show conversion
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    msg.innerText = "Please enter a valid amount.";
    return;
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    const response = await fetch(`${BASE_URL}/${from}`);
    const data = await response.json();

    if (!data || !data.rates || !data.rates[to]) {
      msg.innerText = "Currency not supported.";
      return;
    }

    const rate = data.rates[to];
    const converted = (amount * rate).toFixed(2);
    msg.innerText = `${amount} ${from} = ${converted} ${to}`;
  } catch (err) {
    console.error(err);
    msg.innerText = "Failed to fetch exchange rate.";
  }
});
