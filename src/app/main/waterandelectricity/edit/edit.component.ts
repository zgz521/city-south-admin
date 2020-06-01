import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { WaterElectricityService } from 'src/app/service/water-electricity.service';

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

  formatterNumber(value: number) {
    if (value) {
      let val = value.toFixed(2);
      if (value < 10)
        val = '0000' + val;
      else if (value < 100)
        val = '000' + val;
      else if (value < 1000)
        val = '00' + val;
      else if (value < 10000)
        val = '0' + val;
      return val;
    }
    else {
      return '0';
    }
  }

  formatterWE = (value: number) => this.formatterNumber(value);
  parserWE = (value: string) => value;

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
    this.costConfigService.select(this.data['EstateId'], 'water,electricity').subscribe(result => {
      let feeType = this.data['waterAndE']['FeeType'];
      this.configList = result['datalist'].filter(function (item: any) { return item['ConfigType'] == feeType });
      if (this.configList.length > 0) {
        this.data['waterAndE']['UnitName'] = this.configList[0]['UnitName'];
      }
    });
  }

  calculateAmount() {
    if (this.data['waterAndE']['UnitPrice'] && this.data['waterAndE']['LastQuantity'] != null && this.data['waterAndE']['Quantity']) {
      this.data['waterAndE']['Amount'] = (this.data['waterAndE']['UnitPrice'] * (this.data['waterAndE']['Quantity'] - this.data['waterAndE']['LastQuantity'])).toFixed(2);
    }
  }

  onConfigChange() {
    let configId = this.data['waterAndE']['ConfigId'];
    let config = this.configList.find(item => { return item['ConfigId'] == configId });
    this.data['waterAndE']['UnitPrice'] = config['UnitPrice'];
    this.data['waterAndE']['UnitName'] = config['UnitName'];
    this.calculateAmount();
  }

  getPreQuantity() {
    if (this.data['waterAndE']['FeeDate']) {
      this.waterElectricityService.getPreQuantity(this.data['waterAndE']['OwnerId'], this.data['waterAndE']['FeeType'], this.data['waterAndE']['FeeDate']).subscribe(result => {
        if (result['LastQuantity'])
          this.data['waterAndE']['LastQuantity'] = result['LastQuantity'];
        this.calculateAmount();
      });
    }
    else
      this.calculateAmount();
  }

  handleOk() {
    let isVerfy = this.checkValue(this.data['waterAndE']['ReceiptNo'], 'receipt')
      && this.checkValue(this.data['waterAndE']['VoucherNo'], 'voucher');
    if (isVerfy) {
      if (this.data['waterAndE']['Status'] > -1) {
        this.isLoading = true;
        this.data['waterAndE']['Status'] = this.data['IsPay'] ? 1 : 0;
        this.waterElectricityService.modify(this.data['waterAndE']).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '繳費修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
    }
  }

  constructor(private ownerService: OwnerService, private waterElectricityService: WaterElectricityService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['IsPay'] = this.data['waterAndE']['Status'] == 1;
    if (!this.data['waterAndE']['ShareQuantity'])
      this.data['waterAndE']['ShareQuantity'] = 0;
    this.getConfig();
  }

}