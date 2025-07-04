const API_Base_URL = "http://localhost:8081";

const handleResponse = async (response) => {
    const text = await response.text();
    if (!response.ok) {
      // Try to parse error JSON, fallback to text if not JSON
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || 'Request failed');
      } catch {
        throw new Error(text || 'Request failed');
      }
    }
    
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON response');
    }
  };
  export const getTransactions = async () => {
    const response = await fetch(`${API_Base_URL}/transactions`);
      return handleResponse(response);
  };


{/*//To fetch all  transactions
export const getTransactions = async () => {
    const response = await fetch(`${API_Base_URL}/transactions`);
    if (!response.ok) {
        throw new Error('Failed to fetch transactions');
    }
    return await response.json();
};

*/}
//Add new transaction
// export const addTransaction=async (transaction) => {
//   try {
//     const response = await fetch(`${API_Base_URL}/transactions`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         Dscription: transaction.text,
//         Amount: transaction.amount,
//         PaymentType: transaction.type,
//       }),
//     });
//     return await handleResponse(response);
//     return await response.json();
//   } catch (error) {
//     console.error('Error adding transaction:', error);
//     throw error;
//   }


export const addTransaction = async (transaction) => {
  try {
    const response = await fetch(`${API_Base_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: transaction.text, 
        amount: transaction.amount,
        type: transaction.type
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Transaction failed');
    }

    return await response.json();
  } catch (error) {
    console.error("API Error Details:", error);
    throw new Error(`Couldn't reach server: ${error.message}`);
  }
};

//Delete the transaction
export const deleteTransaction = async (id) => {
    const response = await fetch(`${API_Base_URL}/transactions/ ${id}`, 
      {
        method: 'DELETE',
      });

    if (!response.ok) {
        throw new Error("Failed to delete transaction at api");
    }

    return await response.json();
};
