
const RegexInput : { [key: string]: RegExp } = 
{
    "email" : new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'),
    "password" : new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'),
    "cognome" : new RegExp('^[a-zA-Z]+$'),
    "nome" : new RegExp('^[a-zA-Z]+$'),
    "telefono" : new RegExp('^[0-9]{10}$'),
    "username" : new RegExp('^[a-z0-9_.]+$'),
}

export default RegexInput;