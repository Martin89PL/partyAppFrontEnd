import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const auth = JSON.parse(localStorage.getItem('auth'));

        if (auth && auth.token) {
            request = request.clone({
                setHeaders: {
                    'x-access-token': auth.token
                }
            });
        }

        return next.handle(request);
    }
}

