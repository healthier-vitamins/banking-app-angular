import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function startsWithNumValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value

        if(!value) return null

        let fail = false
        if(/[0-9]+/.test(value[0])) {
            fail = true
        }

        return fail ? {startsWithNumValidator: true} : null
    }
}