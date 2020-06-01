import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { AddEditComponent } from './add-edit/add-edit.component';
import { NzModalService, NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { OwnerService } from 'src/app/service/owner.service';
import { HttpClient } from '@angular/common/http';
import { ServiceModule, API_CONFIG } from 'src/app/service/service.module';

@Injectable({
  providedIn: ServiceModule
})

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.less']
})
export class OwnerComponent implements OnInit {

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
  uploadUrl: string = '/api/owner/import';
  headers: object = null;
  importVisible = false;
  importList = [];

  mapOfExpandData: { [key: string]: boolean } = {};

  search(){
    this.PageIndex = 1;
    this.getlist();
  }
  
  getlist() {
    this.isLoading = true;
    this.ownerService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  import(){
    this.modalService.info({
      nzTitle: '信息提示',
      nzContent: '等待实现',
    });
  }

  addEdit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let houseInfo = {
      EstateName: this.datalist[index]['EstateName'],
      HouseNo: this.datalist[index]['HouseNo'],
      Model: this.datalist[index]['Model'],
      Floorage: this.datalist[index]['Floorage'],
    };
    let data = this.datalist[index]['owner'];
    let title = '编辑业主“' + this.datalist[index]['EstateName'] + this.datalist[index]['HouseNo'] + '”';
    var that = this;
    that.isLoading = false;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        houseInfo: houseInfo,
        data: data
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
      nzContent: '确定要删除此业主吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.ownerService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '业主删除成功');
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
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
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
    this.http.get(this.uri + '/api/owner/importfile?filename=' + filename, {responseType: 'blob', observe: 'response'}).subscribe(res => {
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

  export() {
    this.isLoading = true;
    this.http.post(`${this.uri}/api/owner/export`, this.selectData, { responseType: 'blob', observe: 'response' }).subscribe(res => {
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

  constructor(private modalService: NzModalService, private http: HttpClient, private msg: NzMessageService, @Inject(API_CONFIG) private uri: string, private estateService: EstateService, private ownerService: OwnerService, private oprationService: OprationService) { }

  ngOnInit() {
    this.uploadUrl = this.uri + this.uploadUrl;
    let ticket = window.sessionStorage['ticket'];
    this.headers = { 'Authorization': 'BasicAuth ' + ticket };
    this.getlist();
    this.getEstate();
  }

}