const inquirer = require('inquirer');


const pausa = async () => {
    await inquirer.prompt([
        {
            type: 'input',
            name: 'enter',
            message:'ENTER para salir'
        }
    ]);
}

const readInput = async (message, defaultInput) => {
    const {desc} = await inquirer.prompt([
        {
            type: 'input',
            name: 'desc',
            default: defaultInput,
            message,
            validate(value){
                if(isNaN(value)){
                    return 'La factura debe ser un número'
                }
                return true;
            }
        }
    ])
    return desc;
}

module.exports = {
    pausa,
    readInput,
}
