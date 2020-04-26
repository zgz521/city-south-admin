import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: ServiceModule
})
export class UserService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist() {
    let url = this.uri + '/api/user';
    return this.http.get(url);
  }

  getMenus() {
    let url = this.uri + '/api/user/menus';
    return this.http.get(url);
  }

  add(data: any){
    let url = this.uri + '/api/user/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/user/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/user/delete/' + id.toString();
    return this.http.delete(url);
  }

  getRoles(id: number){
    let url = this.uri + '/api/user/roles/' + id.toString();
    return this.http.get(url);
  }

  getEstates(id: number){
    let url = this.uri + '/api/user/estates/' + id.toString();
    return this.http.get(url);
  }

  changePassword(data: any){
    let url = this.uri + '/api/user/changePassword/';
    return this.http.post(url, data);
  }
}
