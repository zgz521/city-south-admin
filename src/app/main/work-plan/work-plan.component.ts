import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { WorkPlanService } from 'src/app/service/work-plan.service';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-work-plan',
  templateUrl: './work-plan.component.html'
})
export class WorkPlanComponent implements OnInit {

  datalist: Array<object>;
  estatelist: Array<object>;
  times: Array<object>;
  estateNamse: any = {};
  postlist: Array<object>;
  postNames: any = {};
  category = [];
  days: any[] = [];
  isLoading: boolean = false;
  selectData = {
    SearchDate: new Date()
  };

  generateCategory(parent: any) {
    let parentId = 0;
    if (parent)
      parentId = parent['key'];
    let list = this.postlist.filter(function (item) { return item['ParentPostId'] === parentId });
    if (list.length > 0) {
      if (parent)
        parent['children'] = [];
      for (let i = 0; i < list.length; i++) {
        let node = { key: list[i]['PostId'], title: list[i]['PostName'], postType: list[i]['PostType'], parent: parent }
        this.generateCategory(node);
        if (parent)
          parent['children'].push(node);
        else
          this.category.push(node);
      }
    }
    else if (parent) {
      parent['isLeaf'] = true;
      let items = [];
      let node = parent;
      items.push(node['title']);
      while (node['parent']) {
        node = node['parent']
        items.push(node['title']);
      }
      let name = {};
      this.postNames[parent['key']] = items.reverse().join(' / ');
    }
  }

  getCategory() {
    this.postService.getlist().subscribe(result => {
      this.postlist = result['datalist'];
      this.category = [];
      this.generateCategory(null);
    });
  }

  setWork(employeeId: number, day: number, isWork: boolean, no: number, configId: number, configNo: number) {
    this.datalist[no]['WorkTimes'][day - 1][configNo] = isWork;
    let dayIsWork = false;
    //configId
    if (this.selectData['Fk3Id']) {
      let selectConfigNo = 0;
      for (let i = 0; i < this.times.length; i++) {
        if (this.times[i]['ConfigId'] === this.selectData['Fk3Id']) {
          selectConfigNo = i;
          break;
        }
      }
      dayIsWork = this.datalist[no]['WorkTimes'][day - 1][selectConfigNo];
    }
    else {
      dayIsWork = !this.datalist[no]['WorkTimes'][day - 1].every(item => { return item === false });
    }
    this.datalist[no]['Works'][day - 1] = dayIsWork;
    let y = this.selectData.SearchDate.getFullYear().toString();
    let m = (this.selectData.SearchDate.getMonth() + 1).toString();
    let d = day.toString();
    m = m[1] ? m : ('0' + m);
    d = d[1] ? d : ('0' + d);
    let workDate = [y, m, d].join('-');
    this.workPlanService.set({ EmployeeId: employeeId, WorkDate: workDate, IsWork: isWork, ConfigId: configId }).subscribe(result => {
    });
  }

  getlist() {
    this.isLoading = true;
    this.workPlanService.getlist(this.selectData).subscribe(result => {
      this.times = result['times'];
      this.times.forEach(item => {
        let start = item['TimeStart'].split(':');
        start.splice(2, 1);
        item['TimeStart'] = start.join(':');
        let end = item['TimeEnd'].split(':');
        end.splice(2, 1);
        item['TimeEnd'] = end.join(':');
      });
      this.datalist = result['datalist'];
      this.days = result['days'];
      this.isLoading = false;
    });
  }

  getEstate() {
    this.estateService.select().subscribe(result => {
      this.estatelist = result['datalist'];
      this.estatelist.splice(0, 0, { EstateId: 0, EstateName: '总公司' });
      this.estatelist.forEach(item => {
        this.estateNamse[item['EstateId']] = item['EstateName'];
      });
    });
  }

  constructor(private modalService: NzModalService, private estateService: EstateService, private workPlanService: WorkPlanService, private postService: PostService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getCategory();
    this.getlist();
    this.getEstate();
  }

}