import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective{

  constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private authService: AuthService) { }

  // @Input()
  // set appHasRole(role: string) {
  //   console.log("boolean: " + this.authService.hasRole(role))

  //   if(this.authService.hasRole(role)) {
  //     // show content
  //     this.viewContainerRef.createEmbeddedView(this.templateRef)
  //   } else {
  //     // hide content
  //     this.viewContainerRef.clear()
  //   }

  // }

}
 