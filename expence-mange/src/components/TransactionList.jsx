import React,{useContext} from 'react'
import { GlobalContext } from '../context/Global'
import { Transaction } from './Transaction'

export const TransactionList = () => {
  

const { transactions = [] }=useContext(GlobalContext)
//console.log("Transactions in TransactionList:", transactions);
  if (!transactions) return null;
  return (
    <div>
        <center>
        <h3 className='h3Ai'>
            History of the Recent Transactions
        </h3>
        </center>
        <ul className='list' >
          {transactions.map(transaction => {
            if (!transaction.id) {
              console.error("Transaction missing id", transaction);
              return null;
            }
            // console.log(`Transaction: ${JSON.stringify(transaction, null, 2)}`);
            return <Transaction key={transaction.id} transaction={transaction}  />;
          })}
        </ul>
    </div>  
  );
}


