import React, { useEffect, useState } from 'react';
import { MdOutlineSwapHoriz } from "react-icons/md";
import CurrencySelect from './CurrencySelect';

const CurrencyForm = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("PLN");
    const [toCurrency, setToCurrency] = useState("KGS");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSwapCurrency = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };


    const getExchangeRate = async () => {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

        setIsLoading(true);

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw Error("Something went wrong!");

            const data = await response.json();
            const rate = (data.conversion_rate * amount);
            setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => getExchangeRate, []);

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
            <p className="exchange-rate-result">
                {isLoading ? "Loading..." : result}
            </p>
        </form>
    )
}

export default CurrencyForm;