const nodemailer = require('nodemailer')

function sendEmail(to){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'youremail@gmail.com', //Insert user
          pass: 'yourpassword' //inser pw
        }
      });
      
      var mailOptions = {
        from: 'youremail@gmail.com',  //TODO
        to: to,
        subject: 'Sidebuilder API test email',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);   
        }
    });
} 

module.exports = {
    sendEmail,
}