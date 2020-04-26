import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { RoleService } from 'src/app/service/role.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() data: object;
  @Output() closed = new EventEmitter();
  authos: Array<object>;

  getauthors() {
    let id = this.data['RoleId'] ? this.data['RoleId'] : 0;
    this.roleService.getauthors(id).subscribe(result => {
      this.authos = result['authors'];
      this.authos = this.authos.map(item => {
        return {
          ...item,
          options: item['children'].map(row => {
            return {
              label: row['AuthorName'],
              value: row['AuthorId'],
              checked: row['Checked']
            }
          })
        }
      });
    });
  }

  submitForm(): void {
    let authorInRoles = [];
    this.authos.forEach(item => {
      let checkedIds = item['options'].filter(function (row: any) { return row['checked'] }).map(function (row: any) {
        return row['value'];
      });
      if (checkedIds.length > 0)
        checkedIds.push(item['AuthorId']);
      authorInRoles = authorInRoles.concat(checkedIds);
    });
    this.data['AuthorIds'] = authorInRoles;
    if (this.data['RoleId'] && this.data['RoleId'] > 0) {
      this.roleService.modify(this.data).subscribe(result => {
        this.oprationService.tips(result, '角色信息修改成功');
        if (result['code'] == 'success')
            this.closed.emit();
      });
    } else {
      this.roleService.add(this.data).subscribe(result => {
        this.oprationService.tips(result, '新增角色成功');
        if (result['code'] == 'success')
            this.closed.emit();
      });
    }
  }

  constructor(private roleService: RoleService, private oprationService: OprationService) { }

  ngOnInit(): void {
    if (!this.data['RoleId']) {
      this.data['RoleName'] = '';
      this.data['Remark'] = '';
    }
    this.getauthors();
  }
}