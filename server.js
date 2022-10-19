
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

    const htmlTemplate = `
    <div>
    <p style="color:blue;">Date: ${req.body.req.body.date} </p>
    <p style="color:blue;">From: ${req.body.emailAddress} </p>
    <p style="color:blue;">Message: ${req.body.message} </p>
    <table style="border-collapse: collapse; font-family: Tahoma, Geneva, sans-serif;">
	<thead>
		<tr>
			<td style="background-color: #54585d;
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
            border: 1px solid #54585d;
            padding: 15px;">Country Code</td>
			<td style="background-color: #54585d;
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
            border: 1px solid #54585d;
            padding: 15px;">Country Name</td>
			<td style="background-color: #54585d;
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
            border: 1px solid #54585d;
            padding: 15px;">City</td>
			<td style="background-color: #54585d;
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
            border: 1px solid #54585d;
            padding: 15px;">Language</td>
			<td style="background-color: #54585d;
            color: #ffffff;
            font-weight: bold;
            font-size: 13px;
            border: 1px solid #54585d;
            padding: 15px;">Languages</td>
		</tr>
	</thead>
	<tbody>
		<tr style="background-color: #f9fafb;">
			<td style="color: #636363;
            border: 1px solid #dddfe1;
            padding: 15px;">${req.body.country_code}</td>
			<td style="color: #636363;
            border: 1px solid #dddfe1;
            padding: 15px;">${req.body.country_name}</td>
			<td style="color: #636363;
            border: 1px solid #dddfe1;
            padding: 15px;">${req.body.city}</td>
			<td style="color: #636363;
            border: 1px solid #dddfe1;
            padding: 15px;">${req.body.language}</td>
			<td style="color: #636363;
            border: 1px solid #dddfe1;
            padding: 15px;">${req.body.languages}</td>
		</tr>
	</tbody>
</table>
</div>
    `

    const mailOptions = {
        from: req.body.name + '<' + req.body.emailAddress + '>',
        to: process.env.MY_EMAIL,
        subject: req.body.subject,
        html: htmlTemplate
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            console.log('Email sent: ' + info.response);
            res.sendStatus(200);
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
