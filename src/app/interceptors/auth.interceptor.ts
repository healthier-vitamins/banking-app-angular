import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      headers: request.headers.set(
        'Authorization',
        this.authService.token ? `Bearer ` + this.authService.token : ''
      ),
    });

    // handle response data with RxJS
    // https://www.thisdot.co/blog/mapping-returned-http-data-with-rxjs
    // console.log(request)
    return next.handle(request)
    
    // .pipe(tap(x => {
    //   console.log("tapped: ", x)
    //   console.log("string", x.type.valueOf())
    //   map(x => console.log("mapped", x))
    // }))
    
    // .pipe(tap(x => console.log("tapped ", x)))

    // .pipe(map(msg => {
    //   of(msg).pipe(map(msg => {
    //     console.log("test: " + msg)
    //   }))
    //   return msg
    // }))
    

    // ,catchError(err => {
    //   if(err.status === 403) {
    //     console.log("refresh token pge")
    //   }
    //   return next.handle(request)
    // })
    // )
    // The Token has expired on 2022-10-20T15:45:14Z.
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
