import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class RoleService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist() {
    let url = this.uri + '/api/role';
    return this.http.get(url);
  }

  getauthors(id: number) {
    let url = this.uri + '/api/role/author/' + id.toString();
    return this.http.get(url);
  }

  add(data: any){
    let url = this.uri + '/api/role/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/role/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/role/delete/' + id.toString();
    return this.http.delete(url);
  }

}
