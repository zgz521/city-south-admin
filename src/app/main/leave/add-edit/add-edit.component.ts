import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';
import { OprationService } from 'src/app/service/opration.service';
import { LeaveService } from 'src/app/service/leave.service';
import { addDays, startOfDay } from 'date-fns';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() estateList: Array<object>;
  @Input() data: object;
  @Input() category: Array<object>;
  @Input() postNames: any;
  @Input() estateNames: any;
  @Input() employeeName: string;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  curPostId: number | null = null;
  expandKeys = [];
  cityList: any[] | null = null;
  employeeList: any[] | null = null;
  cityItem: any[] | null = null;
  postList: any[] = [];
  postItem: any[] | null = null;
  street: string = '';
  errors: object = {}
  postHistory: any[];
  displayTips = true;
  EsateName = '';
  PostName = '';

  cancel() { this.closed.emit(); }

  onSearch(value: string): void {
    if (value && value.length > 1) {
      this.employeeService.select(value).subscribe(result => {
        this.employeeList = result["datalist"];
        if (this.data['EmployeeId'])
          this.onEmployeeChange();
        this.displayTips = false;
      });
    } else {
      this.employeeList = [];
      this.displayTips = true;
    }
  }

  onEmployeeChange() {
    let employeeId = this.data['EmployeeId'];
    let employee = this.employeeList.find(item => { return item['EmployeeId'] == employeeId });
    if (employee) {
      this.EsateName = this.estateNames[employee['EstateId']];
      this.PostName = this.postNames[employee['PostId']];
    }
  }

  onTimeChange() {
    if (this.data['Days'] && this.data['StartDate']) {
      let day = parseInt(this.data['Days']);
      if (day > 0)
        this.data['EndDate'] = addDays(startOfDay(new Date(this.data['StartDate'])), day);
      else
        this.data['EndDate'] = this.data['StartDate'];
    }
  }

  handleOk() {
    let isVerfy = true;
    if (isVerfy) {
      this.isLoading = true;
      if (this.data['LeaveId'] && this.data['LeaveId'] > 0) {
        this.leaveService.modify(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '假条信息修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      } else {
        this.leaveService.add(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '新增假条成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
    }
  }

  constructor(private employeeService: EmployeeService, private leaveService: LeaveService, private oprationService: OprationService) { }

  ngOnInit(): void {
    if (!this.data['LeaveId']) {
      this.data['CreateTime'] = new Date();
    }
    else if (this.data['LeaveId'] > 0) {
      this.onSearch(this.employeeName);
    }
  }
}