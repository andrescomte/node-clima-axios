require('dotenv').config()
const {leerInput, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() =>{

    let opt;
    const busquedas = new Busquedas();

    busquedas.leerDB()
    //await pausa();
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado ==='0') continue;

                //console.log({idSeleccionado});
                const lugarSelect = lugares.find(l =>l.id==idSeleccionado);

                //guarda en db 
                busquedas.agregarHistorial(lugarSelect.nombre);
                //console.log(lugarSelect);
                //console.log(lugares);

                // llamar a clima y rellenar info
                const climaLugar = await busquedas.climaLugar(lugarSelect.lat,lugarSelect.lng);
                
                //mostrar resultados
                console.log('\n Informacion de la ciudad\n'.green)
                console.log('Ciudad: ',lugarSelect.nombre.green);
                console.log('Lat: ',lugarSelect.lat);
                console.log('Lng: ',lugarSelect.lng);
                console.log('Temperaturas: ',climaLugar.temp.yellow);
                console.log('Minima: ',climaLugar.min.yellow);
                console.log('Maximas: ',climaLugar.max.yellow);
                console.log('Estado del Clima: ',climaLugar.desc.green);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i) =>{
                    const idx = `${i +1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
        }
        await pausa();
        
    } while (opt!==0);

}

main();