import { Component, OnInit } from '@angular/core';
import { AddEditComponent } from './add-edit/add-edit.component';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { EstateService } from 'src/app/service/estate.service';

@Component({
  selector: 'app-cost-config',
  templateUrl: './cost-config.component.html',
  styleUrls: ['./cost-config.component.less']
})
export class CostConfigComponent implements OnInit {

  estatelist: Array<object>;
  datalist: Array<object>;
  sourcedatalist: Array<object>;
  isLoading: boolean = true;
  EstateId: number;
  discount = {
    cash: '一次性现金优惠',
    cashMultiple: '倍数重复现金优惠',
    time: '一次性期限优惠',
    timeMultiple: '倍数重复期限优惠'
  };
  discountUnit = {
    cash: '元',
    cashMultiple: '元',
    time: '个月',
    timeMultiple: '个月'
  };

  getlist() {
    this.costConfigService.getlist().subscribe(result => {
      this.isLoading = false;
      this.datalist = result['datalist'];
      this.sourcedatalist = result['datalist'];
    });
  }

  filter() {
    var EstateId = this.EstateId;
    if (this.EstateId && this.EstateId > 0){
      this.datalist = this.sourcedatalist.filter(function (item: any) {
        return item['config']['EstateId'] == EstateId;
      });
    }
    else {
      this.datalist = this.sourcedatalist;
    }
  }

  addEdit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let title = '新增缴费配置';
    if (index > -1) {
      data = this.datalist[index]['config'];
      title = '编辑缴费配置“' + this.datalist[index]['config']['Category'] + this.datalist[index]['config']['ConfigVersion'] + '”';
    }
    var that = this;
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
      modal.getContentComponent().closed.subscribe(function () {
        modal.close();
        that.getlist();
      });
    });
  }

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要删除此配置吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.costConfigService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '配置删除成功');
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

  constructor(private modalService: NzModalService, private estateService: EstateService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getlist();
    this.getEstate();
  }

}