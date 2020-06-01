import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { NzModalService, NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { OwnerService } from 'src/app/service/owner.service';
import { HttpClient } from '@angular/common/http';
import { ServiceModule, API_CONFIG } from 'src/app/service/service.module';
import { CarService } from 'src/app/service/car.service';

@Injectable({
  providedIn: ServiceModule
})

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.less']
})
export class CarComponent implements OnInit {

  datalist: Array<object>;
  estatelist: Array<object>;
  isLoading: boolean = false;
  PageSize = 10;
  PageIndex = 1;
  TotalCount: number;
  selectData = {
    KeyWord: '',
    FkId: null
  };
  search() {
    this.PageIndex = 1;
    this.getlist();
  }

  getlist() {
    this.isLoading = true;
    this.carService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  getEstate() {
    this.estateService.select().subscribe(result => {
      this.estatelist = result['datalist'];
    });
  }

  export() {
    this.isLoading = true;
    this.http.post(`${this.uri}/api/car/export`, this.selectData, { responseType: 'blob', observe: 'response' }).subscribe(res => {
      this.isLoading = false;
      let blob = new Blob([res.body], { type: "application/octet-stream" });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', decodeURI(res.headers.get('content-disposition').split('filename=')[1]));
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string, private estateService: EstateService, private carService: CarService) { }

  ngOnInit() {
    this.getlist();
    this.getEstate();
  }

}