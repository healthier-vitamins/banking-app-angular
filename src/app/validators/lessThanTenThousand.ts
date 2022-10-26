import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function lessThanTenThousand(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value
        
        return value < 10000 ? {lessThanTenThousand: true} : null
    }
}