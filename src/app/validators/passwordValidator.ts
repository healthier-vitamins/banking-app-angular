import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value

        if(!value) return null

        const hasUpper = /[A-Z]+/.test(value)
        const hasLower = /[a-z]+/.test(value);
        const hasSpecial = /[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(value)
        const hasNum = /[0-9]+/.test(value);

        const valid = hasUpper && hasLower && hasSpecial && hasNum 

        return !valid ? {passwordValidator: true} : null
    }
}