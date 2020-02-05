const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    console.warn(formulario);
    var transporter = nodemailer.createTransport({
        service: `gmail`,
        auth: {
            user: `dennis.brian.pv@gmail.com`,
            pass: 'draxlercktudios'
        }
    });

    const mailOptions = {
        from: formulario.email,
        to: `dennis.brian.pv@gmail.com`,
        subject: formulario.asunto,
        html: `
        <strong>Nombre: </strong> ${formulario.nombre} <br/>
        <strong>Apellido: </strong> ${formulario.apellido} <br/>
        <strong>Email: </strong> ${formulario.email} <br/>
        <strong>Asunto: </strong> ${formulario.asunto} <br/>
        <strong>Mensaje: </strong> ${formulario.mensaje}
        `
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if(err)
            console.log(err);
        else
            console.log(info);
    });
}