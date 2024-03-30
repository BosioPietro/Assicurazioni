import { AbstractControl } from "@angular/forms";

const RegexInput : { [key: string]: RegExp } = 
{
    "email" : new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'),
    "password" : new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'),
    "cognome" : new RegExp('^[a-zA-Z]+$'),
    "nome" : new RegExp('^[a-zA-Z]+$'),
    "telefono" : new RegExp('^[0-9]{10}$'),
    "username" : new RegExp('^[a-z0-9_.]+$'),
}

const ConfrontaPassword = (controlOne: AbstractControl, controlTwo: AbstractControl) => {
    return () => {
      if (controlOne.value !== controlTwo.value)
      {
        return { match_error: 'Value does not match' };
      }
      else return null;
    };
}

export { RegexInput, ConfrontaPassword };