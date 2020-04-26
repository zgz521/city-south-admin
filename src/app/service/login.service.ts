import { Injectable, Inject } from '@angular/core';
import { ServiceModule, API_CONFIG } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})

export class LoginService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  userLogin(user: any) {
    return this.http.post(this.uri + '/api/login', user);
  }
}
