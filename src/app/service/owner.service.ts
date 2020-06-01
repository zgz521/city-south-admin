import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class OwnerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  select(estateId: number, key: string) {
    let selectData = {FkId: estateId, KeyWord: key};
    let url = this.uri + '/api/owner/select';
    return this.http.post(url, selectData);
  }

  selectLog(id: number){
    let url = this.uri + '/api/owner/expirelog/' + id.toString();
    return this.http.get(url);
  }

  andCarSelect(estateId: number, key: string) {
    let selectData = {FkId: estateId, KeyWord: key};
    let url = this.uri + '/api/owner/andCarSelect';
    return this.http.post(url, selectData);
  }

  getlist(selectData:any, PageSize: number, PageIndex: number) {
    selectData['PageSize'] = PageSize;
    selectData['PageIndex'] = PageIndex;
    let url = this.uri + '/api/owner';
    return this.http.post(url, selectData);
  }

  add(data: any){
    let url = this.uri + '/api/owner/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/owner/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/owner/delete/' + id.toString();
    return this.http.delete(url);
  }

  deleteCar(id: number){
    let url = this.uri + '/api/owner/deleteCar/' + id.toString();
    return this.http.delete(url);
  }

  deletePeople(id: number){
    let url = this.uri + '/api/owner/deletePeople/' + id.toString();
    return this.http.delete(url);
  }

}
