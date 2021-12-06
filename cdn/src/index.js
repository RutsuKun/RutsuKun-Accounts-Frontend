const express = require('express');

const app = express()


app.get('/', (req, res) => {
    return res.status(200).json({ message: 'cdn' })
})



app.listen(20001, () => {
    console.log('cdn started');
})