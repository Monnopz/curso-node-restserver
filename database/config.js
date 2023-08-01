const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        
        await mongoose.connect( process.env.MONGODB_CNN ); //Cadena de conexión de los enviroments .env
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error con la conexión en la base de datos');
    }

}

module.exports = {
    dbConnection
}