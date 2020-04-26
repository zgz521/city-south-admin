import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from 'src/app/service/employee.service';
import { OprationService } from 'src/app/service/opration.service';

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
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  curPostId: number | null = null;
  expandKeys = [];
  cityList: any[] | null = null;
  cityItem: any[] | null = null;
  postList: any[] = [];
  postItem: any[] | null = null;
  street: string = '';
  errors: object = {}
  postHistory: any[];

  cancel() { this.closed.emit(); }

  handleOk() {
    let isVerfy = this.checkValue(this.data['Phone'], 'phone') && this.checkValue(this.data['UrgentContactPhone'], 'phone2', true) && this.checkValue(this.data['CardId'], 'cardid', true);
    if (isVerfy) {
      this.isLoading = true;
      if (this.data['EmployeeId'] && this.data['EmployeeId'] > 0) {
        console.log(this.data);
        this.employeeService.modify(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '员工信息修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      } else {
        this.employeeService.add(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '新增员工成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
    }
  }

  changeHouseNo() {
    let HouseNo = '';
    if (this.data['Building'] && this.data['Building'] !== '')
      HouseNo += '-' + this.data['Building'];
    if (this.data['Unit'] && this.data['Unit'] !== '')
      HouseNo += '-' + this.data['Unit'];
    if (this.data['Floor'] && this.data['Floor'] !== '')
      HouseNo += '-' + this.data['Floor'];
    if (this.data['No'] && this.data['No'] !== '')
      HouseNo += '-' + this.data['No'];
    if (HouseNo.length > 0)
      HouseNo = HouseNo.substring(1);
    this.data['HouseNo'] = HouseNo;
  }

  checkValue($event: string, field: string, ignore?: boolean) {
    return this.oprationService.checkValue($event, field, this.errors, ignore);
  }

  findNode(nodes: any, id: number): any {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]['value'] === id) {
        return nodes[i]
      }
      else if (nodes[i]['children'] && nodes[i]['children'].length > 0) {
        let node = this.findNode(nodes[i]['children'], id);
        if (node)
          return node;
      }
    }
  }

  transferNode(nodes: any[], postList: any[], parent?: any) {
    nodes.forEach(item => {
      let newItem = { value: item['key'], label: item['title'] };
      if (parent)
        newItem['parent'] = parent;
      if (item['children'] && item['children'].length > 0) {
        newItem['children'] = [];
        this.transferNode(item['children'], newItem['children'], newItem);
      } else {
        newItem['isLeaf'] = true;
      }
      postList.push(newItem);
    });
  }

  onAddressChanges() {
    this.data['Address'] = this.cityItem.concat([this.street]).join('|');
    console.log(this.data['Address']);
  }

  onPostChanges() {
    this.data['PostId'] = this.postItem[this.postItem.length - 1];
  }

  getPostHistory() {
    this.employeeService.postHistory(this.data['EmployeeId']).subscribe(result => {
      this.postHistory = result['datalist'];
    });
  }

  constructor(private employeeService: EmployeeService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.employeeService.getCity().subscribe(result => {
      this.cityList = result;
    });
    this.transferNode(this.category, this.postList);
    if(this.data['EmployeeId']){
      this.getPostHistory();
    }
    if (this.data['PostId']) {
      this.curPostId = this.data['PostId'];
      let node = this.findNode(this.postList, this.data['PostId']);
      let postItem = [];
      if (node) {
        postItem.push(node['value']);
        while (node['parent']) {
          node = node['parent'];
          postItem.push(node['value']);
        }
      }
      this.postItem = postItem.reverse();
    }
    if (this.data['Address']) {
      let cityItem = this.data['Address'].split('|');
      this.street = cityItem.splice(cityItem.length - 1, 1)[0];
      this.cityItem = cityItem
    }
  }
}