import React,{createContext, useEffect, useState} from "react";
import {getTransactions,addTransaction as apiAddTransaction,deleteTransaction as apiDeletetransaction} from './Api'





//Create Context
export const  GlobalContext=createContext();


export const GlobalProvider = ({children}) => {
    const [transactions, setTransactions] = useState([]);
    const [needRefresh, setNeedRefresh] = useState(false);

    //Loading the transactions on intail render
    useEffect(() =>{
        const fetchTransactions = async () => {
            try{
                const data = await getTransactions();
                // console.log("Fetched transactions:", data);
                const formattedData = data.map(item => ({
                    id: item.ID,
                    text: item.Discription,
                    amount: item.Amount,
                    type: item.PaymentType
                }));
                setTransactions(formattedData);
                setNeedRefresh(false);

            }catch(error){
                console.error("Error fetching transactions:",error)
                setTransactions([])
            }
        };
        fetchTransactions();
    },[transactions]);
// Actions
/*
function deleteTransaction(id){
    dispatch({
        type:"DELETE_TRANSACTION",
        payload:id
    });
}
function addTransaction(transaction){
    dispatch({
        type:"ADD_TRANSACTION",
        payload:transaction
    });
}
*/


//Add transaction 
const addTransaction = async(transaction) =>{
    try{
        await apiAddTransaction(transaction);
            setNeedRefresh(true);
    }
    catch(error){
        console.error("Error in Adding the transaction :(",error);
        throw error;
    }
};

   const deleteTransaction =async (id) => {
    try{
        console.log("Deleting transaction with ID:", id);
        await apiDeletetransaction(id);
        setTransactions(prev => prev.filter(t => t.id !== id));

        setNeedRefresh(true);
    }
    catch(error){
        setNeedRefresh(true);
        console.error("Error in deleting the transaction at global",error);

    }
};


const contextValue = React.useMemo(() => ({
    transactions,
    deleteTransaction,  
    addTransaction
}),[transactions]);

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
}