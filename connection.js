import mysql from 'mysql2/promise'
import bluebird from 'bluebird'

const connection = await mysql.createConnection({
    host: 'sql11.freemysqlhosting.net',
    database: 'sql11498278',
    user: 'sql11498278',
    password: 'ET9YUDNXy5',
    Promise: bluebird
})

connection.connect(error => {
    if (error) throw error

    console.log("connected to db")
})

export default connection