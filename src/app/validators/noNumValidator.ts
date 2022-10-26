import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noNumValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value

        const hasNum = /[0-9]+/.test(value);

        return hasNum ? {noNumValidator: true} : null
    }
}