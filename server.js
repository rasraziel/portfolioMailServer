
const nodemailer = require('nodemailer');
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
const smtpTransport = require('nodemailer-smtp-transport');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h2>Mail Server works</h2>'));
});

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
}));


app.post("/contact/message", (req, res) => {

    console.log('Data received: ' + req.body);

    const htmlTemplate = `
    <div style="display:flex; justify-content: center;">
        <h1 style="color:red;">${req.body.date.toString()}</h1>
    </div>
    <div style="display:flex; justify-content: center;">
        <h2 style="color:blue;">My name is ${req.body.name} and my email address is ${req.body.emailAddress} </h2>
    </div>
    <div style="display:flex; justify-content: center;">
        <p style="color:black;">${req.body.message} </p>
    </div>
    <div style="display:flex; justify-content: center;">
        <p style="color:grey;">${JSON.stringify(req.body.data)} </p>
    </div>
    <div style="display:flex; justify-content: center;">
        <p style="color:grey;">${req.body.languages} </p>
    </div>
    <div style="display:flex; justify-content: center;">
        <p style="color:grey;">${req.body.userAgent} </p>
    </div>
    `

    const mailOptions = {
        from: req.body.emailAddress,
        to: 'rasraziel@gmail.com',
        subject: req.body.subject + ' (' + req.body.name + ')',
        html: htmlTemplate
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

const server = app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});

module.exports = {
    router
};
