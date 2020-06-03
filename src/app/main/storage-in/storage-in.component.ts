import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { EstateService } from 'src/app/service/estate.service';
import { OprationService } from 'src/app/service/opration.service';
import { StorageInService } from 'src/app/service/storage-in.service';
import { AddEditComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-storage-in',
  templateUrl: './storage-in.component.html',
  styleUrls: ['./storage-in.component.less']
})
export class StorageInComponent implements OnInit {

  datalist: any[];
  estatelist: any[];
  estateNames: any = {};
  isLoading: boolean = false;
  PageSize = 10;
  PageIndex = 1;
  TotalCount: number;
  selectData = {
    KeyWord: '',
    FkId: null
  };

  getlist() {
    this.isLoading = true;
    this.storageInService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  addEdit(index?: number): void {
    let title = '新增入库单';
    if (index !== undefined) {
      title = '编辑入库单“' + this.datalist[index]['ReceiptNo'] + '”';
    }
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    var that = this;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: index === undefined ? {} : this.datalist[index],
        estates: this.estatelist,
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
      nzContent: '确定要作废此入库单吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.storageInService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '入库单作废成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  getEstate() {
    this.estateService.select().subscribe(result => {
      this.estatelist = result['datalist'];
      this.estatelist.splice(0, 0, {EstateId: 0, EstateName: '总公司'});
      this.estatelist.forEach(item => {
        this.estateNames[item['EstateId']] = item['EstateName'];
      });
    });
  }


  constructor(private modalService: NzModalService, private estateService: EstateService, private storageInService: StorageInService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getlist();
    this.getEstate();
  }

}
