// context/CurrencyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState("ILS"); // סוג המטבע שנבחר (ILS או USD)
    const [exchangeRate, setExchangeRate] = useState(1); // שער ההמרה מדולר לשקל

    useEffect(() => {
        const fetchExchangeRate = async () => {
            if (currency === "USD") {
                try {
                    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/ILS');
                    setExchangeRate(response.data.rates.USD);
                } catch (error) {
                    console.error("Error fetching exchange rate:", error);
                }
            } else {
                setExchangeRate(1); // שער ההמרה בשקלים
            }
        };

        fetchExchangeRate();
    }, [currency]);

    const toggleCurrency = () => {
        setCurrency((prevCurrency) => (prevCurrency === "ILS" ? "USD" : "ILS"));
    };

    const convertPrice = (priceILS) => {
        return currency === "USD" ? (priceILS * exchangeRate).toFixed(2) : priceILS;
    };

    return (
        <CurrencyContext.Provider value={{ currency, toggleCurrency, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};
