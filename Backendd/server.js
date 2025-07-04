const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express()
app.use(cors())
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true
  }));

const newconnect =(databasename) =>{
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass123',
        database: databasename
    }
)}
const db =  newconnect('Expense')

//Get all transactions
app.get('/transactions', (req, res) => {
    const sql = "SELECT * FROM transactionsHistory";
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(data);
    });
});

//Add a new transaction
app.post('/transactions',(req, res) => {
    const {text,amount,type} = req.body
    console.log(req.body);
    const sql = "INSERT INTO transactionsHistory (Discription, Amount, PaymentType) VALUES (?, ?, ?)";
    db.query(sql,[text,amount,type],(err,result) => {
        if (err)throw err;
        res.json({
            id:result.insertId,
            text,
            amount,
            type
        });
        
    })
});

//Delete a transaction f
app.delete('/transactions/:id', (req, res) =>{
    const {id} = req.params;
    db.query('DELETE FROM transactionsHistory WHERE ID = ?',[[id],(err,results) => {
        if (err) throw err;
        res.json({success: true,message: 'Transaction Deleted!'});
    }]);
});

//Start the Server 
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*
app.get('/',(req,res)=>{
    return res.json("From Backend Side");
})

app.get('/AddingIntoDataBase',(req,res)=>{
    const sql = "INSERT INTO transactionsHistory (Discription, Amount, PaymentType, TransactionDate) VALUES ('test', 100, 'Credit', '2023-10-01')";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);

    })
})

app.get('/transactionsHistory',(req,res)=>{
    const  sql = "SELECT * FROM transactionsHistory";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);

    })
})




app.listen(8081,() => {
    console.log("Listening");
}) 
    */