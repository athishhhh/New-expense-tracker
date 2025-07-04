import React,{useEffect , useState    } from 'react'

export const Backtry = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://localhost:8081/transactionsHistory')
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));
        },[])
  return (
    <div>
        <table border={1} cellPadding={10} cellSpacing={0} style={{width:"100%"}}> 
            <thead>
                <tr>
                    <th>Id</th>
                    <th>discription</th>
                    <th>amount</th>
                    <th>transactiontype</th>
                    <th>date</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.ID}>
                        <td>{item.ID}</td>
                        <td>{item.Discription}</td>
                        <td>{item.Amount}</td>
                        <td>{item.PaymentType}</td>
                        <td>{item.TransactionDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

{/*import React, { useEffect, useState } from 'react';

export const Backtry = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/t')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Transaction History</h2>
      <table border={1} cellPadding={10} cellSpacing={0} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Transaction Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.ID}>
              <td>{item.ID}</td>
              <td>{item.Description}</td>
              <td>{item.Amount}</td>
              <td>{item.PaymentType}</td>
              <td>{item.TransactionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
*/}

