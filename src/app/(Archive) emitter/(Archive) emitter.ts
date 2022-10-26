import { EventEmitter } from "@angular/core";

export class Emitters {
    static LoggedInUsernameEmitter = new EventEmitter<string>();
}