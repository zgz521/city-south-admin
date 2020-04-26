import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: ServiceModule
})
export class CostConfigService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist() {
    let url = this.uri + '/api/costConfig';
    return this.http.get(url);
  }

  select(EstateId: number, ConfigType: string) {
    let selectData = {FkId: EstateId, KeyWord: ConfigType}
    let url = this.uri + '/api/costConfig/select';
    return this.http.post(url, selectData);
  }

  add(data: any){
    let url = this.uri + '/api/costConfig/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/costConfig/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/costConfig/delete/' + id.toString();
    return this.http.delete(url);
  }
}
