const currencySelector = document.getElementById("currency_select");

const currencyHUF = document.getElementById("currency_huf");
const currencyOther = document.getElementById("currency_other");

let otherInHuf = 1;

class Currency
{
    constructor(name, code, convertToHUF)
    {
        this.name = name;
        this.code = code;
        this.convertToHUF = convertToHUF;
    }
}

let currencies = [];

fetch("https://hexarate.paikama.co/api/currencies")
    .then(response => response.json())
    .then(data => {
        setData(data.data);
        
    });

async function setData(data)
{
    data.forEach(element => {

        let currency = new Currency(element.name, element.code, element.convertToHUF);
        if(element.code !== "HUF")
        {
            currencies.push(currency);
        }

    });

    populateForm();
}

function nameToCode(name)
{
    const currency = currencies.find(c => c.name === name);
    return currency ? currency.code : null;
}

function populateForm()
{
    // Valuták hozzáadása
    currencies.forEach(currency => {
        let currencyOptn = document.createElement("option");
        currencyOptn.value = currency.code;
        currencyOptn.textContent = (currency.name + " (" + currency.code + ")");

        currencySelector.addEventListener("change", async (event) => 
        {
            const selectedCurrency = event.target.value;
            if (!selectedCurrency) return;


            try 
            {
                const response = await fetch(`https://hexarate.paikama.co/api/rates/${selectedCurrency}/HUF/latest`);
                const result = await response.json();
                otherInHuf = result.data.mid;
                
                const event = new Event("change");
                currencyHUF.dispatchEvent(event);
            } 
            catch (error) 
            {
                console.error("Error fetching conversion rate:", error);
            }
        });

        currencySelector.appendChild(currencyOptn);
    });

    // set the default currency to EUR and trigger the change event to fetch the conversion rate
    currencySelector.value = "EUR";
    const event = new Event("change");
    currencySelector.dispatchEvent(event);
}

currencyHUF.addEventListener("change", ()=>
{
    console.log(otherInHuf);
    console.log(currencyHUF.value);
    if(currencyHUF.value > 0 && otherInHuf > 0)
    {
        currencyOther.value = currencyHUF.value / otherInHuf;
    }
});

currencyOther.addEventListener("change", ()=>
{
    console.log(otherInHuf);
    console.log(currencyHUF.value);
    if(currencyOther.value > 0 && otherInHuf > 0)
    {
        currencyHUF.value = currencyOther.value * otherInHuf;
    }
});