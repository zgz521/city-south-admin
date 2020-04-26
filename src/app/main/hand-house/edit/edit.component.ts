import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { HandHouseService } from 'src/app/service/hand-house.service';

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

  cancel() { this.closed.emit(); }

  handleOk() {
    this.isLoading = true;
    this.handHouseService.modify(this.data['hand']).subscribe(result => {
      this.isLoading = false;
      this.oprationService.tips(result, '交房修改成功');
      if (result['code'] == 'success')
        this.submitOk.emit();
    });
  }

  constructor(private ownerService: OwnerService, private handHouseService: HandHouseService, private oprationService: OprationService) { }

  ngOnInit(): void {
  }

}