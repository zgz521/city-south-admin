import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { differenceInDays, startOfDay } from 'date-fns';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() houseInfo: object;
  @Input() data: object;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  errors: object = {
    phone: false,
    cardid: false
  }
  expireDate: Date | null = null;
  isExpireDateChange = false;
  isKeyModify = false;
  isManage = false;
  checkCardId(val: string) {
    if (/^(\d{14}|\d{17})[0-9Xx]$/.test(val)) {
      let Ai = val.length == 18 ? val.substring(0, 17) : val.substring(0, 6) + '19' + val.substring(6, 15);
      let yyyy = parseInt(Ai.substring(6, 10));
      let mm = parseInt(Ai.substring(10, 12));
      let dd = parseInt(Ai.substring(12, 14));
      if (yyyy % 4 == 0) {
        if (!/^[1-9][0-9]{5}[0-9]{4}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/.test(Ai))
          return false;
      }
      else {
        if (!/^[1-9][0-9]{5}[0-9]{4}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/.test(Ai))
          return false;
      }
      let birthday = new Date([yyyy, mm, dd].join('-'));
      let now = new Date();
      if (birthday.getTime() > now.getTime() || now.getFullYear() - yyyy > 100)
        return false;
      //开始检查校验位
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(val[i]) * factor[i];
      }
      let code = Ai + parity[sum % 11];
      return code === val.toUpperCase();
    }
    else {
      return false;
    }
  }
  logList: any[] | null = null;

  checkValue($event: string, field: string) {
    let isVerfy = false;
    if (field === 'phone')
      isVerfy = /^\d{11}$/.test($event);
    else if (field === 'cardid')
      isVerfy = $event === '' || this.checkCardId($event);
    this.errors[field] = !isVerfy;
    return isVerfy;
  }

  cancel() { this.closed.emit(); }

  setPeople(no: number) {
    if (no < 0) {
      this.data['FamilyList'].push({ PeopleName: null, Sex: null, Relation: null, Phone: null, Remark: null });
    }
    else {
      if (this.data['FamilyList'][no]['PeopleId'] && this.data['FamilyList'][no]['PeopleId'] > 0) {
        this.ownerService.deletePeople(this.data['FamilyList'][no]['PeopleId']).subscribe(result => {
          this.oprationService.tips(result);
          if (result['code'] == 'success')
            this.data['FamilyList'].splice(no, 1);
        });
      }
      else {
        this.data['FamilyList'].splice(no, 1);
      }
    }
  }

  setCar(no: number) {
    if (no < 0) {
      this.data['CarList'].push({ Brand: null, UserName: this.data['OwnerName'], Phone: this.data['Phone'], Model: null, CarNumber: null, Remark: null });
    }
    else {
      if (this.data['CarList'][no]['CarId'] && this.data['CarList'][no]['CarId'] > 0) {
        this.ownerService.deleteCar(this.data['CarList'][no]['CarId']).subscribe(result => {
          this.oprationService.tips(result);
          if (result['code'] == 'success')
            this.data['CarList'].splice(no, 1);
        });
      }
      else {
        this.data['CarList'].splice(no, 1);
      }
    }
  }

  handleOk() {
    let isVerfy = this.checkValue(this.data['Phone'], 'phone') && this.checkValue(this.data['CardId'], 'cardid');
    if (isVerfy) {
      this.isLoading = true;
      if (this.data['OwnerId'] && this.data['OwnerId'] > 0) {
        this.ownerService.modify(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '业主信息修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      } else {
        this.data['HouseId'] = this.houseInfo['HouseId'];
        this.ownerService.add(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '添加业主成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
    }
  }

  onEpireDateChange(date: Date) {
    if (this.expireDate && !date)
      this.isExpireDateChange = true;
    else if (!this.expireDate && date)
      this.isExpireDateChange = true;
    else if (differenceInDays(startOfDay(this.expireDate), startOfDay(date)) != 0)
      this.isExpireDateChange = true;
    else
      this.isExpireDateChange = false;
  }

  getLogList() {
    this.ownerService.selectLog(this.data['OwnerId']).subscribe(result => {
      this.logList = result['datalist'];
    })
  }

  constructor(private ownerService: OwnerService, private oprationService: OprationService) { }

  ngOnInit(): void {
    let authors = window.sessionStorage['authors'].split(',');
    if (this.data['OwnerId'] && this.data['OwnerId'] > 0) {
      this.getLogList();
      this.isKeyModify = authors.indexOf('owner.key-modify') === -1;
      this.isManage = authors.indexOf('owner.modify') === -1;
      if (this.data['PropertyExpireDate'])
        this.expireDate = new Date(this.data['PropertyExpireDate']);
    } else {
      this.isManage = authors.indexOf('owner.add') === -1;
    }
    if (!this.data['OwnerId']) {
      this.data['FamilyList'] = [];
      this.data['CarList'] = [];
    }
  }

}
