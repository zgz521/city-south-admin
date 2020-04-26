import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HouseService } from 'src/app/service/house.service';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-add-batch',
  templateUrl: './add-batch.component.html',
  styleUrls: ['./add-batch.component.less']
})
export class AddBatchComponent implements OnInit {

  @Input() estateList: Array<object>;
  data: object = {
    EstateId: null,
    HouseType: null,
    ContactTel: null,
    Structure: null,
    IsPlace: false,
    StartBuilding: null,
    EndBuilding: null,
    StartUnit: null,
    EndUnit: null,
    StartFloor: null,
    EndFloor: null,
    EmptyState: null,
    HandDate: null,
    News: null,
    ModelList:
      [
        { HouseNo: 1, Model: null, Floorage: null },
      ]
  };
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;

  cancel() { this.closed.emit(); }

  setModel(no: number) {
    if (no < 0) {
      let order = this.data['ModelList'].length + 1;
      this.data['ModelList'].push( { HouseNo: order, Model: null, Floorage: null },);
    }
    else {
      this.data['ModelList'].splice(no, 1);
      for(let i = no; i < this.data['ModelList'].length; i++){
        this.data['ModelList'][i]['HouseNo'] = this.data['ModelList'][i]['HouseNo'] -1;
      }
    }
  }

  handleOk() {
    this.isLoading = true;
    this.houseService.batch(this.data).subscribe(result => {
      this.isLoading = false;
      this.oprationService.tips(result, '批量新建房屋成功');
      if (result['code'] == 'success')
        this.submitOk.emit();
    });
  }

  constructor(private houseService: HouseService, private oprationService: OprationService) { }

  ngOnInit(): void {
  }

}
