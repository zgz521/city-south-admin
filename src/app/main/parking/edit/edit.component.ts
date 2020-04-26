import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { ParkingService } from 'src/app/service/parking.service';

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
    console.log(isVerfy);
    return isVerfy;
  }

  cancel() { this.closed.emit(); }

  getConfig() {
    this.costConfigService.select(this.data['EstateId'], 'parking').subscribe(result => {
      this.configList = result['datalist'];
      if (this.configList.length > 0) {
        this.data['UnitName'] = this.configList[0]['UnitName'];
      }
    });
  }

  handleOk() {
    let isVerfy = this.checkValue(this.data['parking']['ReceiptNo'], 'receipt') 
    && this.checkValue(this.data['parking']['VoucherNo'], 'voucher');
    if (isVerfy && this.data['parking']['Status'] > -1) {
      this.isLoading = true;
      this.data['parking']['Status'] = this.data['IsPay'] ? 1 : 0;
      this.data['parking']['StartDate'] = this.oprationService.formatDate(this.data['parking']['StartDate']);
      this.data['parking']['EndDate'] = this.oprationService.formatDate(this.data['parking']['EndDate']);
      this.parkingService.modify(this.data['parking']).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '繳費修改成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  constructor(private ownerService: OwnerService, private parkingService: ParkingService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['IsPay'] = this.data['parking']['Status'] == 1;
    this.data['parking']['StartDate'] = new Date(this.data['parking']['StartDate']);
    this.data['parking']['EndDate'] = new Date(this.data['parking']['EndDate']);
    let monthCount = this.oprationService.dateDiff('MM', this.data['parking']['StartDate'], this.data['parking']['EndDate']);
    let amount = this.data['parking']['UnitPrice'] * this.data['parking']['MonthCount'];
    if (monthCount > this.data['parking']['MonthCount'])
      this.disCountText = `优惠${monthCount - this.data['parking']['MonthCount']}个月`;
    else if (amount > this.data['parking']['Amount'])
      this.disCountText = `优惠${Math.ceil(amount - this.data['parking']['Amount'])}元`;
    if (this.data['parking']['Status'] == 0) {
      if(this.data['ParkingExpireDate']){
        let startDate = new Date(this.data['ParkingExpireDate']);
        let endDate = new Date(this.data['ParkingExpireDate']);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setMonth(endDate.getMonth() + monthCount);
        this.data['parking']['StartDate'] = startDate;
        this.data['parking']['EndDate'] = endDate;
      }
    }
    this.getConfig();
  }

}