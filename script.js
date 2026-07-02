// 1. new API link ko copy kiye fetch karke live data show karane ke liye
const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const convertBtn = document.querySelector(".convert-btn"); // class se convert button pakadne ke liye
const resetBtn = document.querySelector(".reset-btn");     // class se reset button pakadne ke liye

const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg"); // jaha result aayega uski class ko pakda
const swapBtn = document.querySelector(".swap-btn");
const timeStamoBox = document.querySelector(".timestamp");

// 2.dropdown ke select me sari country list ko lane ka or usi me se select karne ka logic
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

// 3. live rate laane ka function (put always before awit fun.)
const updateExchangeRate = async () => {
  let amount = document.querySelector(".ammount input");
  let amtVal = amount.value;

  // yadi user koi value na dale ya galat choose kare to bhi 1 print kardo input boxme
  if (amtVal === "" || amtVal < 1 || isNaN(amtVal)) {
    amtVal = 1;
    amount.value = "1";
  }

  // API ke link ko fetch kiya jisse live data aayega
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    // api se rate nikala
    let rates = data[fromCurr.value.toLowerCase()]; // sare data ke rates ko choose kiya
    let rate = rates[toCurr.value.toLowerCase()]; // data me se single value ko choose liya 

    let finalAmount = (amtVal * rate).toFixed(2); // (Fixed to) ka matlab total value ke baad only 2 zero dikhe

    // yaha screen par values ko calculate karke dikhayega like 1INR = 93.43 USD ese hi sabhi ki
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    let now = new Date();
    let liveTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
let liveDate = now.toLocaleDateString();
timeStamoBox.innerText= `Last updated: ${liveDate} | ${liveTime}`;
  } catch (error) {
    msg.innerText = "रेट लोड करने में दिक्कत आ रही है।";
    console.error(erro)
  }
};

// 4. flag change karne ke liye
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// 5. convert button ko click karne par change go jaye rate//
convertBtn.addEventListener("click", (evt) => {
  evt.preventDefault(); // page ko refresh hone se rokne ke liye
  updateExchangeRate();
});

// 6. sari values ko reset karne ke liye
resetBtn.addEventListener("click", (evt) => {
  evt.preventDefault(); // page ko refresh hone se rokne ke liye

  // yadi input box me koi value nahi hai to  (likh do) uske liye
  document.querySelector(".ammount input").value = "1";

  // yadi koi value choose nahi hai to reset karke USD or INR ki value hi likh do
  fromCurr.value = "USD";
  toCurr.value = "INR";

  // flags ko reset kar do 
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // yadi koi value calxulate nahi hui hai to vapas "Converted ammount " likh do
  msg.innerText = "Converted ammount:";
});

// 7. yaha par calculate ki gai sari values ko show karayega
window.addEventListener("load", () => {
  updateExchangeRate();
});

// icon ko click karne par currCode , Flag, live rate change karne ke liye
swapBtn.addEventListener("click", () => {

  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
