const mysql = require('mysql')


export const newconnect =(databasename) =>{
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pass123',
        database: databasename
    })
}
