import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NzModalService, NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { WaterElectricityService } from 'src/app/service/water-electricity.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ServiceModule } from 'src/app/service/service.module';

@Injectable({
  providedIn: ServiceModule
})

@Component({
  selector: 'app-waterandelectricity',
  templateUrl: './waterandelectricity.component.html'
})
export class WaterandelectricityComponent implements OnInit {

  datalist: Array<object>;
  estatelist: Array<object>;
  isLoading: boolean = false;
  PageSize = 10;
  PageIndex = 1;
  TotalCount: number;
  selectData = {
    KeyWord: '',
    type: null,
    FkId: null
  };
  uploadUrl: string = '/api/waterandelectricity/import';
  headers: object = null;
  importVisible = false;
  importList = [];

  search(){
    this.PageIndex = 1;
    this.getlist();
  }

  getlist() {
    this.isLoading = true;
    this.waterElectricityService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  add() {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    var that = this;
    const modal = this.modalService.create({
      nzTitle: '新增水电费缴费',
      nzContent: AddComponent,
      nzComponentParams: {
        estateList: this.estatelist
      },
      nzMaskClosable: false,
      nzFooter: null,
      nzWidth: width,
      nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
    });
    modal.afterOpen.subscribe(function () {
      modal.getContentComponent().submitOk.subscribe(function () {
        modal.close();
        that.getlist();
      });
      modal.getContentComponent().closed.subscribe(function () {
        modal.close();
      });
    });
  }

  edit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    var that = this;
    const modal = this.modalService.create({
      nzTitle: '编辑业主“'+this.datalist[index]['OwnerName']+'”的缴费单据“',
      nzContent: EditComponent,
      nzComponentParams: {
        data: this.datalist[index]
      },
      nzMaskClosable: false,
      nzFooter: null,
      nzWidth: width,
      nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
    });
    modal.afterOpen.subscribe(function () {
      modal.getContentComponent().submitOk.subscribe(function () {
        modal.close();
        that.getlist();
      });
      modal.getContentComponent().closed.subscribe(function () {
        modal.close();
      });
    });
  }

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要作废此笔缴费单据吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.waterElectricityService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '单据作废成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  getEstate() {
    this.estateService.select().subscribe(result => {
      this.estatelist = result['datalist'];
    });
  }

  showImportModal() {
    this.importVisible = true;
  }

  importClose() {
    this.importVisible = false;
  }

  importChange(info: UploadChangeParam): void {
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} 导入成功`);
      //在这里下载导入得文件
      this.getlist();
      if (info.file.response) {
        this.importList.push(info.file.response.filename);
      }
      //
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} 导入失败.`);
    }
  }

  download(filename: string){
    this.http.get(this.uri + '/api/waterandelectricity/importfile?filename=' + filename, {responseType: 'blob', observe: 'response'}).subscribe(res => {
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

  constructor(private modalService: NzModalService, private http: HttpClient, private msg: NzMessageService, @Inject(API_CONFIG) private uri: string, private estateService: EstateService, private waterElectricityService: WaterElectricityService, private oprationService: OprationService) { }

  ngOnInit() {
    this.uploadUrl = this.uri + this.uploadUrl;
    let ticket = window.sessionStorage['ticket'];
    this.headers = { 'Authorization': 'BasicAuth ' + ticket };
    this.getlist();
    this.getEstate();
  }

}
