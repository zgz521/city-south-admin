import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { PropertyService } from 'src/app/service/property.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { HandHouseService } from 'src/app/service/hand-house.service';

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
    HandDate: new Date(),
    PropertyStartDate: new Date(),
    Remark: null,
  };
  ownerList: Array<object>;
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

  cancel() { this.closed.emit(); }

  onSearch(value: string): void {
    if (value && value.length > 2) {
      this.ownerService.select(this.data['EstateId'], value).subscribe(result => {
        this.ownerList = result["datalist"];
        this.displayTips = false;
      });
    } else {
      this.ownerList = [];
      this.displayTips = true;
    }
  }


  onOwnerChange() {
    let ownerId = this.data['OwnerId'];
    let owner = this.ownerList.find(function (item: any) { return item['OwnerId'] == ownerId });
    this.data['OwnerId'] = ownerId;
    this.data['PropertyStartDate'] = new Date(owner['PropertyStartDate']);
    this.owner = owner;
  }

  handleOk() {
    this.isLoading = true;
    this.handHouseService.add(this.data).subscribe(result => {
      this.isLoading = false;
      this.oprationService.tips(result, '新增交房成功');
      if (result['code'] == 'success')
        this.submitOk.emit();
    });
  }

  constructor(private ownerService: OwnerService, private handHouseService: HandHouseService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['EstateId'] = this.estateList[0]['EstateId'];
  }

}