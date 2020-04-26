import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { PropertyService } from 'src/app/service/property.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { NzTreeHigherOrderServiceToken } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

  @Input() data: object;
  configList: Array<object>;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  errors: object = {
    voucher: false,
    receipt: false
  }
  disCountText = '';

  checkValue($event: string, field: string) {
    let isVerfy = false;
    if (field === 'receipt')
      isVerfy = /^\d{7}$/.test($event);
    else if (field === 'voucher')
      isVerfy = /^\d{6}$/.test($event);
    this.errors[field] = !isVerfy;
    return isVerfy;
  }

  cancel() { this.closed.emit(); }

  getConfig() {
    this.costConfigService.select(this.data['EstateId'], 'property').subscribe(result => {
      this.configList = result['datalist'];
      if (this.configList.length > 0) {
        this.data['UnitName'] = this.configList[0]['UnitName'];
      }
    });
  }

  handleOk() {
    let isVerfy = this.checkValue(this.data['property']['ReceiptNo'], 'receipt')
      && this.checkValue(this.data['property']['VoucherNo'], 'voucher');
    if (isVerfy && this.data['property']['Status'] > -1) {
      this.isLoading = true;
      this.data['property']['Status'] = this.data['IsPay'] ? 1 : 0;
      this.data['property']['StartDate'] = this.oprationService.formatDate(this.data['property']['StartDate']);
      this.data['property']['EndDate'] = this.oprationService.formatDate(this.data['property']['EndDate']);
      this.propertyService.modify(this.data['property']).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '繳費修改成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  constructor(private ownerService: OwnerService, private propertyService: PropertyService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['IsPay'] = this.data['property']['Status'] == 1;
    this.data['property']['StartDate'] = new Date(this.data['property']['StartDate']);
    this.data['property']['EndDate'] = new Date(this.data['property']['EndDate']);
    let monthCount = this.oprationService.dateDiff('MM', this.data['property']['StartDate'], this.data['property']['EndDate']);
    let amount = this.data['Floorage'] * this.data['property']['UnitPrice'] * this.data['property']['MonthCount'];
    if (monthCount > this.data['property']['MonthCount'])
      this.disCountText = `优惠${monthCount - this.data['property']['MonthCount']}个月`;
    else if (amount > this.data['property']['Amount'])
      this.disCountText = `优惠${Math.ceil(amount - this.data['property']['Amount'])}元`;
    if (this.data['property']['Status'] == 0) {
      let startDate = new Date(this.data['PropertyExpireDate']);
      let endDate = new Date(this.data['PropertyExpireDate']);
      endDate.setMonth(endDate.getMonth() + monthCount);
      startDate.setDate(startDate.getDate() + 1);
      this.data['property']['StartDate'] = startDate;
      this.data['property']['EndDate'] = endDate;
    }
    this.getConfig();
  }

}