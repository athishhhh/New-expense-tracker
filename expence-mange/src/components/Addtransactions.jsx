import React ,{useState,useContext} from 'react'
import { GlobalContext } from '../context/Global';

export const Addtransactions = () => {
    const [text, setText] = useState("");
    const [amount, setAmount]= useState(0);
    const {addTransaction} = useContext(GlobalContext);
    const [transactionType,setTransactionType]= useState("expense"); //gives Income as the default
    const [isSubmitting,setIsSubmitting]=useState(false);
    

    
    
    //let transactionID=1000;
     
    const generateID = () =>  {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }; 

    const onSubmit = async(e) => {
        e.preventDefault();
        
    
    if(!text || !amount){
        alert("Please enter both text and amount");
        return;
    }
    const numericAmt=parseFloat(amount);


    
    
    if(isNaN(numericAmt)){
        alert("Plese enter a valid amount!");
        return;
    }
    setIsSubmitting(true);
    try{
        const signedAmt=transactionType==='income'
        ? Math.abs(numericAmt)
        : -Math.abs(numericAmt);

        await addTransaction({
            id:generateID(),
            text: text,
            amount: signedAmt,
            type: transactionType
        });
        setText("")
        setAmount(0);
        setTransactionType('expense');
    
    }
    catch(error){
        alert("Failed to add the transaction!");
        console.error("Add transaction Error,",error);
    }
    finally{
        setIsSubmitting(false);
    };
   /* useEffect(()=>{
        console.log("useEffect is called",text); 
    },[text])*/
    }
  return (
    <div className='add-container'>
    <div className='add-transaction'>
        <center>
        <h3 className='h3Ai'>Add new Transaction</h3></center>
        <form onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Description</label>
                <input 
                type='text' 
                value={text}
                onChange={(e) => setText(e.target.value)} 
                placeholder='Description'
                disabled={isSubmitting} />
                
            </div>

            <div className='form-control'>
                <label>Amount</label>
                <input 
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='Enter amount' 
                min="0"
                step="any"
                required
                disabled={isSubmitting}
                 />
            </div>

            <label>Type</label>
            <div className='type-buttons'>
                <button 
                type='button'
                className={transactionType==='income'?'active':''}
                onClick={() => {setTransactionType('income')}} disabled={isSubmitting}> Income💸</button>

                <button 
                type='button'
                className={transactionType==='expense'?'active':''}
                onClick={(e) => {setTransactionType('expense')} } disabled={isSubmitting}> Expense🛒  </button>

            </div>
            <div>
                <button className='btn' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Adding..' : 'Add Transaction'} </button>
            </div>
        </form>

        {/*<form onSubmit={onSubmit}>
            <div className='form-control'>
                <label htmlFor='text'>Text</label>
                <input type='text' value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter the way you spent your money' />
            </div>
            <div className='form-control'>
                <label htmlFor='amount'>Amount
                    <br />
                    (negative-expence , positive-invcome) 
                </label>
                <input  type='number'value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Enter the amount' />
            </div>
            <button className='btn'>Add the Transaction</button>

        </form>
        <br><button className='btn'>Income</button></br>*/}
        
    </div>
    </div>
  );

    }