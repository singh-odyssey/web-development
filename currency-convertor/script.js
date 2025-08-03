// API Configuration
const API_KEY = 'your-api-key'; // We'll use a free API that doesn't require a key
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/';

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const fromImg = document.getElementById('from-img');
const toImg = document.getElementById('to-img');
const submitBtn = document.getElementById('submit');
const swapBtn = document.getElementById('swap-btn');
const resultDiv = document.getElementById('result');
const exchangeRateDiv = document.getElementById('exchange-rate');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    populateCurrencyDropdowns();
    setDefaultValues();
    addEventListeners();
});

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    const currencies = Object.keys(countryList).sort();
    
    currencies.forEach(currency => {
        // Create option for 'from' currency
        const fromOption = document.createElement('option');
        fromOption.value = currency;
        fromOption.textContent = currency;
        fromCurrency.appendChild(fromOption);
        
        // Create option for 'to' currency
        const toOption = document.createElement('option');
        toOption.value = currency;
        toOption.textContent = currency;
        toCurrency.appendChild(toOption);
    });
}

// Set default values
function setDefaultValues() {
    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
    amountInput.value = '1';
    updateFlag(fromCurrency, fromImg);
    updateFlag(toCurrency, toImg);
}

// Add event listeners
function addEventListeners() {
    submitBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    fromCurrency.addEventListener('change', () => updateFlag(fromCurrency, fromImg));
    toCurrency.addEventListener('change', () => updateFlag(toCurrency, toImg));
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });
}

// Update flag based on currency selection
function updateFlag(selectElement, imgElement) {
    const currency = selectElement.value;
    const countryCode = countryList[currency];
    if (countryCode) {
        imgElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
        imgElement.alt = `${currency} flag`;
    }
}

// Swap currencies
function swapCurrencies() {
    const fromValue = fromCurrency.value;
    const toValue = toCurrency.value;
    
    fromCurrency.value = toValue;
    toCurrency.value = fromValue;
    
    updateFlag(fromCurrency, fromImg);
    updateFlag(toCurrency, toImg);
    
    // Convert automatically after swap if amount is entered
    if (amountInput.value) {
        convertCurrency();
    }
}

// Convert currency
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    // Validation
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    if (from === to) {
        showResult(amount, from, to, 1);
        return;
    }
    
    try {
        showLoading();
        const rate = await getExchangeRate(from, to);
        const convertedAmount = (amount * rate).toFixed(2);
        showResult(convertedAmount, from, to, rate);
    } catch (error) {
        showError('Failed to fetch exchange rate. Please try again.');
        console.error('Error:', error);
    }
}

// Get exchange rate from API
async function getExchangeRate(from, to) {
    try {
        const response = await fetch(`${BASE_URL}${from}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }
        
        const data = await response.json();
        
        if (!data.rates[to]) {
            throw new Error(`Exchange rate not found for ${to}`);
        }
        
        return data.rates[to];
    } catch (error) {
        // Fallback to alternative API
        return await getExchangeRateFromBackup(from, to);
    }
}

// Backup API for exchange rates
async function getExchangeRateFromBackup(from, to) {
    const response = await fetch(`https://api.fxratesapi.com/latest?base=${from}&symbols=${to}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch from backup API');
    }
    
    const data = await response.json();
    return data.rates[to];
}

// Show loading state
function showLoading() {
    resultDiv.innerHTML = '<div class="loading">Converting...</div>';
    exchangeRateDiv.innerHTML = '';
}

// Show conversion result
function showResult(amount, from, to, rate) {
    resultDiv.innerHTML = `
        <div>
            ${parseFloat(amountInput.value).toLocaleString()} ${from} = 
            <strong>${parseFloat(amount).toLocaleString()} ${to}</strong>
        </div>
    `;
    
    exchangeRateDiv.innerHTML = `1 ${from} = ${rate.toFixed(4)} ${to}`;
}

// Show error message
function showError(message) {
    resultDiv.innerHTML = `<div style="color: #ff6b6b;">${message}</div>`;
    exchangeRateDiv.innerHTML = '';
}

// Format number with commas
Number.prototype.toLocaleString = function() {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};