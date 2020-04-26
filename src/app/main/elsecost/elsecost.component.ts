import { Component, OnInit } from '@angular/core';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { ElseCostService } from 'src/app/service/else-cost.service';

@Component({
  selector: 'app-elsecost',
  templateUrl: './elsecost.component.html'
})
export class ElsecostComponent implements OnInit {

  datalist: Array<object>;
  costNames: Array<string>;
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

  search(){
    this.PageIndex = 1;
    this.getlist();
  }

  getlist() {
    this.isLoading = true;
    this.elseCostService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
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
      nzTitle: '新增其它费用缴费',
      nzContent: AddComponent,
      nzComponentParams: {
        estateList: this.estatelist,
        costNames: this.costNames
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
        data: this.datalist[index],
        costNames: this.costNames
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
        this.elseCostService.delete(id).subscribe(result => {
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

  getCostNames() {
    this.elseCostService.getGroup().subscribe(result => {
      this.costNames = result['groups'];
    });
  }

  constructor(private modalService: NzModalService, private estateService: EstateService, private elseCostService: ElseCostService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getlist();
    this.getEstate();
    this.getCostNames();
  }

}
