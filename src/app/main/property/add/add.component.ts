import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { PropertyService } from 'src/app/service/property.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { NzTreeHigherOrderServiceToken } from 'ng-zorro-antd';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {

  @Input() estateList: Array<object>;
  data: object = {
    OwnerId: null,
    EstateId: null,
    ConfigId: null,
    UnitPrice: null,
    UnitName: null,
    Amount: null,
    MonthCount: 12,
    StartDate: null,
    EndDate: null,
    ReceiptNo: null,
    VoucherNo: null,
    PayWay: null,
    Remark: null,
    Status: null,
    IsPay: false
  };
  ownerList: Array<object>;
  configList: Array<object>;
  owner: object = {
    HouseNo: null,
    EstateId: null,
    HouseType: null,
    Model: null,
    Floorage: null,
    HouseId: null,
    OwnerId: null,
    OwnerName: null,
    Phone: null,
    PropertyExpireDate: null
  };
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  displayTips = true;
  errors: object = {
    voucher: false,
    receipt: false
  }
  curConfig: object;
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
    if (this.data['UnitPrice'] && this.data['MonthCount'] && this.owner['Floorage']) {
      this.data['Amount'] = (this.data['UnitPrice'] * this.data['MonthCount'] * this.owner['Floorage']).toFixed(2);
      if (this.curConfig['DiscountMode'] === 'cash' && this.data['MonthCount'] >= this.curConfig['Quantity']) {
        this.data['Amount'] -= this.curConfig['Amount'];
        this.disCountText = `优惠${this.curConfig['Amount']}元`;
      }
      else if (this.curConfig['DiscountMode'] === 'cashMultiple' && this.data['MonthCount'] >= this.curConfig['Quantity']) {
        let discountAmount = this.curConfig['Amount'] * Math.floor(this.data['MonthCount'] / this.curConfig['Quantity']);
        this.data['Amount'] -= discountAmount;
        this.disCountText = `优惠${discountAmount}元`;
      }
    }
    if (this.data['MonthCount'] && this.owner['PropertyExpireDate']) {
      let endtDate = new Date(this.owner['PropertyExpireDate']);
      let discountMonth = 0;
      if (this.curConfig['DiscountMode'] === 'time' && this.data['MonthCount'] >= this.curConfig['Quantity']) {
        discountMonth = this.curConfig['Amount'];
        this.disCountText = `优惠${discountMonth}个月`;
      }
      else if (this.curConfig['DiscountMode'] === 'timeMultiple' && this.data['MonthCount'] >= this.curConfig['Quantity']) {
        discountMonth = Math.floor(this.data['MonthCount'] / this.curConfig['Quantity']);
        this.disCountText = `优惠${discountMonth}个月`;
      }
      endtDate.setMonth(endtDate.getMonth() + this.data['MonthCount'] + discountMonth);
      this.data['EndDate'] = endtDate;
    }
  }

  changeDate() {
    let endtDate = new Date(this.data['StartDate'].getTime());
    let discountMonth = 0;
    if (this.curConfig['DiscountMode'] === 'time' && this.data['MonthCount'] >= this.curConfig['Quantity']) {
      discountMonth = this.curConfig['Amount'];
      this.disCountText = `优惠${discountMonth}个月`;
    }
    else if (this.curConfig['DiscountMode'] === 'timeMultiple' && this.data['MonthCount'] >= this.curConfig['Quantity']) {
      discountMonth = Math.floor(this.data['MonthCount'] / this.curConfig['Quantity']);
      this.disCountText = `优惠${discountMonth}个月`;
    }
    endtDate.setMonth(endtDate.getMonth() + this.data['MonthCount'] + discountMonth);
    endtDate.setDate(endtDate.getDate() - 1);
    this.data['EndDate'] = endtDate;
  }

  onOwnerChange() {
    let ownerId = this.data['OwnerId'];
    let owner = this.ownerList.find(function (item: any) { return item['OwnerId'] == ownerId });
    this.data['OwnerId'] = ownerId;
    let PropertyExpireDate = new Date(owner['PropertyExpireDate']);
    let startDate = PropertyExpireDate;
    startDate.setDate(startDate.getDate() + 1);
    this.data['StartDate'] = startDate;
    this.owner = owner;
    this.calculateAmount();
  }

  onEstateChange() {
    this.getConfig();
  }

  onConfigChange() {
    let configId = this.data['ConfigId'];
    let config = this.configList.find(item => { return item['ConfigId'] == configId });
    this.data['UnitPrice'] = config['UnitPrice'];
    this.data['UnitName'] = config['UnitName'];
    this.curConfig = config;
    this.calculateAmount();
  }

  getConfig() {
    this.costConfigService.select(this.data['EstateId'], 'property').subscribe(result => {
      this.configList = result['datalist'];
      if (this.configList.length > 0) {
        this.curConfig = this.configList[0];
        this.data['ConfigId'] = this.curConfig['ConfigId'];
        this.data['UnitPrice'] = this.curConfig['UnitPrice'];
        this.data['UnitName'] = this.curConfig['UnitName'];
        this.calculateAmount();
      }
      else {
        this.data['ConfigId'] = null;
        this.data['UnitPrice'] = null;
        this.data['UnitName'] = null;
      }
    });
  }

  handleOk() {
    let isVerfy = this.checkValue(this.data['ReceiptNo'], 'receipt') && this.checkValue(this.data['VoucherNo'], 'voucher');
    if (isVerfy) {
      this.isLoading = true;
      this.data['Status'] = this.data['IsPay'] ? 1 : 0;
      this.data['StartDate'] = this.oprationService.formatDate(this.data['StartDate']);
      this.data['EndDate'] = this.oprationService.formatDate(this.data['EndDate']);
      this.propertyService.add(this.data).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '新增缴费成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  constructor(private ownerService: OwnerService, private propertyService: PropertyService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['EstateId'] = this.estateList[0]['EstateId'];
    this.getConfig();
  }

}
