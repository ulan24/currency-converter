import React, { useEffect, useState } from 'react';
import { MdOutlineSwapHoriz } from "react-icons/md";
import CurrencySelect from './CurrencySelect';

const CurrencyForm = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("PLN");
    const [toCurrency, setToCurrency] = useState("KGS");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSwapCurrency = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const getExchangeRate = async () => {
        const API_KEY = import.meta.env.VITE_API_KEY;

        if (!API_KEY) {
            setError("API key not found. Please check your environment variables.");
            return;
        }

        const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.result === "error") {
                throw new Error(data["error-type"] || "API Error");
            }

            const rate = (data.conversion_rate * amount);
            const resultText = `${amount} ${fromCurrency} = ${rate.toFixed(2)} ${toCurrency}`;
            setResult(resultText);
        } catch (error) {
            setError(`Failed to get exchange rate: ${error.message}`);
            setResult("");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getExchangeRate();
    }, [fromCurrency, toCurrency, amount]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        getExchangeRate();
    };

    return (
        <form className="currency-form" onSubmit={handleSubmitForm}>
            <div className="form-group">
                <label className="form-label">Enter Amount</label>
                <input type="number" className="form-input" value={amount} required onChange={(e) => {
                    setAmount(e.target.value);
                }} />
            </div>

            <div className="form-group form-currency-group">
                <div className="form-section">
                    <label className='form-label'>From</label>
                    <CurrencySelect
                        selectedCurrency={fromCurrency}
                        handleCurrency={e => setFromCurrency(e.target.value)}
                    />
                </div>

                <div className="swap-icon" onClick={handleSwapCurrency}>
                    <MdOutlineSwapHoriz />
                </div>

                <div className="form-section">
                    <label className='form-label'>To</label>
                    <CurrencySelect
                        selectedCurrency={toCurrency}
                        handleCurrency={e => setToCurrency(e.target.value)}
                    />
                </div>
            </div>
            <button type='submit' className={`${isLoading ? "loading" : ""} submit-button`}>Get Exchange Rate</button>
            {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <p className="exchange-rate-result">
                {isLoading ? "Loading..." : result || "Enter an amount and select currencies"}
            </p>
        </form>
    )
}

export default CurrencyForm;