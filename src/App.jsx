import React from 'react'
import CurrencyForm from './components/CurrencyForm'

const App = () => {
  return (
    <div className='currency-converter'>
      <h2 className='currency-title'>Currency Converter</h2>
      <CurrencyForm />
    </div>
  )
}

export default App