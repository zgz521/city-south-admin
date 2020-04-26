import { Component, OnInit } from '@angular/core';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { HandHouseService } from 'src/app/service/hand-house.service';

@Component({
  selector: 'app-hand-house',
  templateUrl: './hand-house.component.html',
  styleUrls: ['./hand-house.component.less']
})
export class HandHouseComponent implements OnInit {

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

  getlist() {
    this.isLoading = true;
    this.handHouseService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
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
    let title = '新增交房';
    var that = this;
    that.isLoading = false;
    const modal = this.modalService.create({
      nzTitle: title,
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
    that.isLoading = false;
    const modal = this.modalService.create({
      nzTitle: '编辑交房“' + this.datalist[index]['EstateName'] + this.datalist[index]['HouseNo'] + '(' + this.datalist[index]['Owner'] + ')' + '”',
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
      nzContent: '确定要删除此交费吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.handHouseService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '交房信息删除成功');
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


  constructor(private modalService: NzModalService, private estateService: EstateService, private handHouseService: HandHouseService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getlist();
    this.getEstate();
  }

}
