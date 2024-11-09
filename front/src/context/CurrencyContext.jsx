// CurrencyContext.js
import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('ILS');
    const [exchangeRate, setExchangeRate] = useState(1); // 1 by default for ILS

    const toggleCurrency = async () => {
        if (currency === 'ILS') {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/ILS');
                const data = await response.json();
                setExchangeRate(data.rates.USD); // שמירת שער ההמרה לדולר
                console.log("Updated exchange rate:", data.rates.USD);
                setCurrency('USD');
            } catch (error) {
                console.error("Failed to fetch exchange rate", error);
            }
        } else {
            setExchangeRate(1); // חזרה לשקל
            setCurrency('ILS');
        }
    };

    // פונקציה להמרת מחיר לפי המטבע הנבחר
    const convertPrice = (price) => {
        return (price * exchangeRate).toFixed(2);
    };

    return (
        <CurrencyContext.Provider value={{ currency, exchangeRate, toggleCurrency, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
