import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class EstateService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist() {
    let url = this.uri + '/api/estate';
    return this.http.get(url);
  }

  select() {
    let url = this.uri + '/api/estate/select';
    return this.http.get(url);
  }

  add(data: any) {
    let url = this.uri + '/api/estate/add';
    return this.http.post(url, data);
  }

  modify(data: any) {
    let url = this.uri + '/api/estate/modify';
    return this.http.put(url, data);
  }

  changeIntroduct(data: any) {
    let url = this.uri + '/api/estate/changeintroduct';
    return this.http.put(url, data);
  }

  delete(id: number) {
    let url = this.uri + '/api/estate/delete/' + id.toString();
    return this.http.delete(url);
  }

}
