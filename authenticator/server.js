const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode'); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const secret = speakeasy.generateSecret();
console.log(secret);

app.get('/', (req, res) => {
  res.send('hello');
})

app.get('/twofactorsetup', (req, res) => {
  QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
    res.send(
      `<h1>setup authenticator</h1>
      <h3>use the qr code to your authenticator</h3>
      <img src=${data_url} > <br>
      or add manually: ${secret.base32}`
    );
  })
})

app.post('/verify', (req, res) => {
  const token = req.body.userToken;
  console.log(token);
  const verfied = speakeasy.totp.verify({secret: secret.base32, encoding: 'base32', token: token});
  res.json({success: verfied});
})

app.listen(3000, () => {
  console.log('server started at port 3000');
});