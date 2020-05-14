import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { ParkingService } from 'src/app/service/parking.service';
import { addDays, addMonths } from 'date-fns';

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
    CarId: null,
    ParkingExpireDate: null,
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
  carList: Array<object>;
  configList: Array<object>;
  owner: object = {
    HouseNo: null,
    EstateId: null,
    HouseId: null,
    OwnerId: null,
    OwnerName: null,
    Phone: null,
    carList: []
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
  maxDate = new Date();

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
      this.ownerService.andCarSelect(this.data['EstateId'], value).subscribe(result => {
        this.ownerList = result["datalist"];
        this.displayTips = false;
      });
    } else {
      this.ownerList = [];
      this.displayTips = true;
    }
  }

  calculateAmount() {
    if (this.data['UnitPrice'] && this.data['MonthCount']) {
      this.data['Amount'] = (this.data['UnitPrice'] * this.data['MonthCount']).toFixed(2);
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
    if (this.data['MonthCount'] && this.data['StartDate']) {
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
      endtDate = addDays(endtDate, 1);
      endtDate = addMonths(endtDate, this.data['MonthCount'] + discountMonth);
      endtDate = addDays(endtDate, -1);
      endtDate.setDate(endtDate.getDate() - 1);
      this.data['EndDate'] = endtDate;
    }
  }

  onOwnerChange() {
    let ownerId = this.data['OwnerId'];
    let owner = this.ownerList.find(function (item: any) { return item['OwnerId'] == ownerId });
    console.log(owner);
    this.data['OwnerId'] = ownerId;
    this.owner = owner;
    if (owner['carList'].length > 0) {
      this.data['CarId'] = owner['carList'][0]['CarId'];
      let startDate = new Date();
      if (owner['carList'][0]['ParkingExpireDate']) {
        this.data['ParkingExpireDate'] = owner['carList'][0]['ParkingExpireDate'];
        let ParkingExpireDate = new Date(owner['carList'][0]['ParkingExpireDate']);
        ParkingExpireDate.setDate(ParkingExpireDate.getDate() + 1);
        if (ParkingExpireDate.getTime() > startDate.getTime()) {
          startDate = ParkingExpireDate;
        }
      }
      this.data['StartDate'] = startDate;
      this.maxDate = startDate;
    }
    this.calculateAmount();
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

  onCarChange() {
    let carId = this.data['CarId'];
    let car = this.owner['carList'].find(function (item: any) { return item['CarId'] == carId });
    let startDate = new Date();
    this.data['ParkingExpireDate'] = car['ParkingExpireDate'];
    if (car['ParkingExpireDate']) {
      this.data['ParkingExpireDate'] = car['ParkingExpireDate'];
      let ParkingExpireDate = new Date(car['ParkingExpireDate']);
      ParkingExpireDate.setDate(ParkingExpireDate.getDate() + 1);
      if (ParkingExpireDate.getTime() > startDate.getTime()) {
        startDate = ParkingExpireDate;
      }
    }
    this.data['StartDate'] = startDate;
    this.maxDate = startDate;
    this.calculateAmount();
  }

  getConfig() {
    this.costConfigService.select(this.data['EstateId'], 'parking').subscribe(result => {
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
      this.parkingService.add(this.data).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '新增缴费成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return current.getTime() > this.maxDate.getTime();
  };

  constructor(private ownerService: OwnerService, private parkingService: ParkingService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['EstateId'] = this.estateList[0]['EstateId'];
    this.getConfig();
  }

}
