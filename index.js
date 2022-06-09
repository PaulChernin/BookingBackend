import express from 'express'
import connection from './connection.js'

const app = express()
const port = 3000

app.use(express.json())

app.get('/rooms', async (req, res) => {
    const start = req.query.dateStart
    const end = req.query.dateEnd
    const guests = req.query.guestsNumber

    const [rows] = await connection.execute(
        `SELECT * FROM rooms WHERE guestsNumber = ${guests}\
        AND NOT EXISTS (SELECT * FROM bookings WHERE\
        dateStart < '${end}' AND dateEnd > '${start}' AND roomId = rooms.id)`)

    rows.forEach(row => {
        row.withBreakfast = !!row.withBreakfast
    })

    console.log(rows)
    res.send(rows)
})

app.post('/booking', (req, res) => {
    const booking = req.body
    console.log(booking)    

    const values = [
        booking.roomId, booking.dateStart, booking.dateEnd, booking.name, booking.surname, booking.deviceId
    ]

    connection.query(`INSERT INTO bookings (roomId, dateStart, dateEnd, name, surname, deviceId) VALUES (?)`, [values])

    res.status(200)
    res.send('ok')
})

app.get('/bookings', async (req, res) => {
    const deviceId = req.query.userId

    const [rows] = await connection.execute(
        `SELECT id, roomId, userId, DATE_FORMAT(dateStart, '%Y-%m-%d') AS dateStart, DATE_FORMAT(dateEnd, '%Y-%m-%d') AS dateEnd FROM bookings WHERE deviceId=${ deviceId }`)

    console.log(rows)
    res.send(rows)
})

app.get('/booking', async (req, res) => {
    const deviceId = req.query.userId

    const [rows] = await connection.execute(
        `SELECT id, roomId, userId, DATE_FORMAT(dateStart, '%Y-%m-%d') AS dateStart, DATE_FORMAT(dateEnd, '%Y-%m-%d') AS dateEnd FROM bookings WHERE deviceId=${ deviceId }`)

    console.log(rows)
    res.send(rows)
})

app.get('/bookedRooms', async (req, res) => {
    const deviceId = req.query.deviceId

    const [rows] = await connection.execute(
        `SELECT * FROM rooms WHERE EXISTS\
        (SELECT * FROM bookings WHERE roomId = rooms.id AND deviceId = '${deviceId}')`
    )

    rows.forEach(row => {
        row.withBreakfast = !!row.withBreakfast
    })

    res.send(rows)
})

app.listen(port, () => {
    console.log('server started')
})


// app.post('/rooms', (req, res) => {
//     const data = [
//         {
//             "name": "Двухместный номер",
//             "picture": "https://s.101hotelscdn.ru/uploads/image/hotel_image/4785/1227179.jpg",
//             "price": 15000,
//             "guestsNumber": 2,
//             "withBreakfast": true,
//             "beds": "Кровать King-size"
//           },
//           {
//             "name": "Двухместный Номер Делюкс",
//             "picture": "https://s.101hotelscdn.ru/uploads/image/hotel_image/4785/1227175.jpg",
//             "price": 19000,
//             "guestsNumber": 2,
//             "withBreakfast": true,
//             "beds": "Кровать King-size"
//           },
//           {
//             "name": "Люкс-студио",
//             "picture": "https://s.101hotelscdn.ru/uploads/image/hotel_image/4785/1227201.jpg",
//             "price": 36000,
//             "guestsNumber": 1,
//             "withBreakfast": true,
//             "beds": "Кровать King-size"
//           },
//           {
//             "name": "Апартаменты с 1 спальней",
//             "picture": "https://s.101hotelscdn.ru/uploads/image/hotel_image/494517/626312.jpg",
//             "price": 15000,
//             "guestsNumber": 3,
//             "withBreakfast": false,
//             "beds": "Односпальная кровать и кровать King-size"
//           },
//           {
//             "name": "Апартаменты с 1 спальней",
//             "picture": "https://s.101hotelscdn.ru/uploads/image/hotel_image/494517/626312.jpg",
//             "price": 18000,
//             "guestsNumber": 3,
//             "withBreakfast": true,
//             "beds": "Односпальная кровать и кровать King-size"
//           },
//           {
//             "name": "Апартаменты с 2 спальнями",
//             "picture": "https://s.101hotelscdn.ru/uploads/image/hotel_image/494517/626319.jpg",
//             "price": 20000,
//             "guestsNumber": 3,
//             "withBreakfast": true,
//             "beds": "Односпальная кровать и кровать King-size"
//           }
//     ]

//     const values = data.map(room => [
//         room.name, room.picture, room.guestsNumber, room.withBreakfast, room.price, room.beds
//     ])

//     console.log(values)

//     connection.query(`INSERT INTO rooms (name, picture, guestsNumber, withBreakfast, price, beds) VALUES ?`, [values])
// })