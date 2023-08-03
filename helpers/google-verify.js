const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

const googleVerify = async( token = '' ) => {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload(); // En base al token, obtiene el payload que es la informacion contenida en el token
    const { name, picture, email } = payload;
    
    return {
        nombre: name,
        img: picture,
        correo: email
    }
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

module.exports = {
    googleVerify
}