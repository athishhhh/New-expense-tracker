import React,{useContext} from 'react'
import { GlobalContext } from '../context/Global'

export const Balence = () => {
  const { transactions } = React.useContext(GlobalContext)
  const amounts=transactions.map(transaction=>transaction.amount);
  const total = amounts.reduce((acc,item)=>(acc += item),0).toFixed(2);
  return (
    <div>
        <h4>Your Current Balance</h4>
        <h1 className='h1Ai'>₹ {total}</h1>
        
    </div>
  )
}
