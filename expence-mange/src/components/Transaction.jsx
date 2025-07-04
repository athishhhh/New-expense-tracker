import React ,{useContext,useState} from 'react'
import { GlobalContext } from '../context/Global';

export const Transaction = ({transaction}) => {
  const {deleteTransaction} = useContext(GlobalContext);  

  //if(!transaction) return null;
  

 // console.log(`Transaction: ${JSON.stringify(transaction, null, 2)}`);
//console.log("Transaction ID:", transaction.ID);
  


  const sign=transaction.amount<0? '-'  : '+' ;
  //console.log("Transaction id:", transaction.id);
  return (


    <li className={transaction.amount <0 ? "minus":"plus"}>
                {transaction.text}<span>{sign}₹{Math.abs(transaction.amount)}</span>
                
                <button onClick={()=> deleteTransaction(transaction.id)} className='delete-btn'>X</button>
                </li>
  );
}
 