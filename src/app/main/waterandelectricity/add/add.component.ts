import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { WaterElectricityService } from 'src/app/service/water-electricity.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {

  @Input() estateList: Array<object>;
  data: object = {
    EstateId: null,
    OwnerId: null,
    ConfigId: null,
    UnitPrice: null,
    UnitName: null,
    FeeType: 'water',
    FeeName: '水费',
    FeeDate: null,
    LastQuantity: 0,
    Quantity: 0,
    Amount: null,
    ReceiptNo: null,
    VoucherNo: null,
    PayWay: null,
    Remark: null,
    Status: null,
    IsPay: false
  };
  ownerList: Array<object>;
  configSourceList: Array<object>;
  configList: Array<object>;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  displayTips = true;
  errors: object = {
    voucher: false,
    receipt: false
  }

  cancel() { this.closed.emit(); }

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

  calculateAmount() {
    if (this.data['UnitPrice'] && this.data['LastQuantity'] != null && this.data['Quantity']) {
      this.data['Amount'] = (this.data['UnitPrice'] * (this.data['Quantity'] - this.data['LastQuantity'])).toFixed(2);
    }
  }

  onConfigChange() {
    let configId = this.data['ConfigId'];
    let config = this.configList.find(item => { return item['ConfigId'] == configId });
    this.data['UnitPrice'] = config['UnitPrice'];
    this.data['UnitName'] = config['UnitName'];
    this.calculateAmount();
  }

  getPreQuantity() {
    if (this.data['OwnerId'] && this.data['FeeDate']) {
      this.waterElectricityService.getPreQuantity(this.data['OwnerId'], this.data['FeeType'], this.data['FeeDate']).subscribe(result => {
        if (result['LastQuantity'])
          this.data['LastQuantity'] = result['LastQuantity'];
        this.calculateAmount();
      });
    }
    else
      this.calculateAmount();
  }

  onEstateChange() {
    this.getConfig();
  }

  onFeeTypeChange() {
    let feeType = this.data['FeeType'];
    this.configList = this.configSourceList.filter(function (item: any) { return item['ConfigType'] == feeType });
    if (this.configList.length > 0) {
      this.data['ConfigId'] = this.configList[0]['ConfigId'];
      this.data['UnitPrice'] = this.configList[0]['UnitPrice'];
      this.data['UnitName'] = this.configList[0]['UnitName'];
      this.getPreQuantity();
    }
    else {
      this.data['ConfigId'] = null;
      this.data['UnitPrice'] = null;
      this.data['UnitName'] = null;
    }
  }

  getConfig() {
    this.costConfigService.select(this.data['EstateId'], 'water,electricity').subscribe(result => {
      this.configSourceList = result['datalist'];
      this.onFeeTypeChange();
    });
  }

  handleOk() {
    let isVerfy = this.checkValue(this.data['ReceiptNo'], 'receipt') && this.checkValue(this.data['VoucherNo'], 'voucher');
    if (isVerfy) {
      this.isLoading = true;
      if (this.data['FeeType'] === 'water')
        this.data['FeeName'] = '水费';
      else if (this.data['FeeType'] === 'electricity')
        this.data['FeeName'] = '电费';
      this.data['Status'] = this.data['IsPay'] ? 1 : 0;
      this.waterElectricityService.add(this.data).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '新增缴费成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  constructor(private ownerService: OwnerService, private waterElectricityService: WaterElectricityService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['EstateId'] = this.estateList[0]['EstateId'];
    this.getConfig();
  }

}