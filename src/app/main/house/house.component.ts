import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { HouseService } from 'src/app/service/house.service';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AddEditComponent as OwnerAddEditComponent } from '../owner/add-edit/add-edit.component';
import { NzModalService, UploadChangeParam, NzMessageService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { AddBatchComponent } from './add-batch/add-batch.component';
import { ServiceModule, API_CONFIG } from 'src/app/service/service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.less']
})
export class HouseComponent implements OnInit {

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
  uploadUrl: string = '/api/house/import';
  headers: object = null;
  importVisible = false;
  importList = [];

  search() {
    this.PageIndex = 1;
    this.getlist();
  }

  getlist() {
    this.isLoading = true;
    this.houseService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  addEdit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let title = '新增房屋';
    if (index > -1) {
      data = this.datalist[index]['house'];
      title = '编辑房屋“' + this.datalist[index]['EstateName'] + this.datalist[index]['house']['HouseNo'] + '”';
    }
    var that = this;
    that.isLoading = false;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: data,
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

  addOwner(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let houseInfo = {
      EstateName: this.datalist[index]['EstateName'],
      HouseNo: this.datalist[index]['house']['HouseNo'],
      HouseId: this.datalist[index]['house']['HouseId'],
      Model: this.datalist[index]['house']['Model'],
      Floorage: this.datalist[index]['house']['Floorage'],
    };
    let title = '为房产“' + this.datalist[index]['EstateName'] + this.datalist[index]['house']['HouseNo'] + '”新增业主';
    var that = this;
    that.isLoading = false;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: OwnerAddEditComponent,
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
      nzContent: '确定要删除此房屋吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.houseService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '房屋删除成功');
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

  addBatch() {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let title = '批量新建房屋';
    var that = this;
    that.isLoading = false;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddBatchComponent,
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

  download(filename: string) {
    this.http.get(this.uri + '/api/house/importfile?filename=' + filename, { responseType: 'blob', observe: 'response' }).subscribe(res => {
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
    //
    this.http.post(`${this.uri}/api/house/export`, this.selectData, { responseType: 'blob', observe: 'response' }).subscribe(res => {
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

  constructor(private modalService: NzModalService, private http: HttpClient, private msg: NzMessageService, private estateService: EstateService, private houseService: HouseService, private oprationService: OprationService, @Inject(API_CONFIG) private uri: string) { }

  ngOnInit() {
    this.uploadUrl = this.uri + this.uploadUrl;
    let ticket = window.sessionStorage['ticket'];
    this.headers = { 'Authorization': 'BasicAuth ' + ticket };
    this.getlist();
    this.getEstate();
  }

}
