import React , { useContext,}from 'react'
import { GlobalContext } from '../context/Global'

export const IncomeExpence = () => {
  const {transactions} =useContext(GlobalContext)
  
  const amounts=transactions.map(t => t.amount);

  const income = amounts.filter(amt => amt > 0)
  .reduce((sum,amt)=>(sum += amt),0) 
  .toFixed(2);
  
  const expense = amounts.filter(amt => amt < 0).reduce((sum,amt)=>(sum += Math.abs(amt)),0).toFixed(2);
  return (
    <div className='inc-exp-container'>
        <div>
            <h4>Income</h4>
            <p  className="money plus">₹{income}</p>
         </div>
        
        <div>
            
            <h4>Expence</h4>
            <p  className='money minus'>₹{expense}</p>
        </div>
    </div>
  );
}

