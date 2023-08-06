const path = require('path'); // Obtiene los paths o rutas de archivos
const { v4: uuidv4 } = require('uuid'); // Paquete para generar ids unicos; se desestructura y se cambia su nombre a uuidv4

//Si los archivos no se suben en la carpeta "public" entonces aunque el cliente tenga toda la ruta los archivos no serán visibles

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => { 

    return new Promise( (resolve, reject) =>{

        const { archivo } = files; // archivo es como se llama la propiedad que se establece en el form data al enviar el archivo

        const nombreCortado = archivo.name.split('.'); // Corta la cadena pasandole el . como patron para cortar
        const extension = nombreCortado[ nombreCortado.length - 1 ]; // Toma la ultima posicion porque se supone que la extensión es la ultima posicion en el arreglo
    
        // Validar la extensión
        if(!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitda [${ extensionesValidas }]`); // Resuelve como reject la promesa
        }
    
        // path es propio de Node
        // __dirname llega hasta el path de controllers
        //Entonces se hace un retroceso en el segundo argumento
        // Y en tercer y cuarto argumento se concatena el nombre del archivo
        // Y asi la ruta queda completa
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp); // Directorio uploads en la raiz del proyecto
    
        archivo.mv(uploadPath, (err) => { //.mv es una funcion que mueve el archivo y se le tiene que indicar a donde moverlo
            if (err) {
                console.log(err);
                return reject(err); // Resuelve la promesa como reject
            }
    
            return resolve(nombreTemp);
    
        });

    });

}

module.exports = {
    subirArchivo
}