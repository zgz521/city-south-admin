import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: ServiceModule
})
export class EmployeeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist(selectData:any, PageSize: number, PageIndex: number) {
    selectData['PageSize'] = PageSize;
    selectData['PageIndex'] = PageIndex;
    let url = this.uri + '/api/employee';
    return this.http.post(url, selectData);
  }

  add(data: any){
    let url = this.uri + '/api/employee/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/employee/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/employee/delete/' + id.toString();
    return this.http.delete(url);
  }

  postHistory(id: number){
    let url = this.uri + '/api/employee/posthistory/' + id.toString();
    return this.http.get(url);
  }

  getCity(): Observable<any[]>{
    return this.http.get<any[]>('assets/json/city.json');
  }
}
