import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { WaterElectricityService } from 'src/app/service/water-electricity.service';
import { ElseCostService } from 'src/app/service/else-cost.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {

  @Input() estateList: Array<object>;
  @Input() costNames: Array<string>;
  data: object = {
    EstateId: null,
    OwnerId: null,
    ConfigId: null,
    UnitPrice: null,
    CostName: null,
    StartDate: null,
    EndDate: null,
    Amount: null,
    ReceiptNo: null,
    VoucherNo: null,
    PayWay: null,
    Remark: null,
    Status: null,
    IsPay: false
  };
  ownerList: Array<object>;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  displayTips = true;
  errors: object = {
    voucher: false,
    receipt: false
  }

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

  onSearch(value: string): void {
    if (value && value.length > 1) {
      this.ownerService.select(this.data['EstateId'], value).subscribe(result => {
        this.ownerList = result["datalist"];
        this.displayTips = false;
      });
    } else {
      this.ownerList = [];
      this.displayTips = true;
    }
  }


  handleOk() {
    let isVerfy = this.checkValue(this.data['ReceiptNo'], 'receipt') && this.checkValue(this.data['VoucherNo'], 'voucher');
    if (isVerfy) {
      this.isLoading = true;
      this.data['Status'] = this.data['IsPay'] ? 1 : 0;
      this.wlseCostService.add(this.data).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '新增缴费成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  constructor(private ownerService: OwnerService, private wlseCostService: ElseCostService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['EstateId'] = this.estateList[0]['EstateId'];
  }

}