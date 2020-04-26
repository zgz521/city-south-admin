import { Component, OnInit } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { NzModalService } from 'ng-zorro-antd';
import { PostService } from 'src/app/service/post.service';
import { AddEditComponent } from './add-edit/add-edit.component';

export interface TreeNodeInterface {
  key: number;
  title: string;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  PostId: number,
  ParentPostId: number;
  PostType: string,
  PostName: string
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit {

  constructor(private postService: PostService, private modalService: NzModalService, private oprationService: OprationService) { }

  list: Array<object>;
  category = [];
  nodes = [];
  types = {
    depart: '部门',
    post: '岗位',
  };

  generateNode(parent: any, expand?: number[]) {
    let parentId = 0;
    if (parent)
      parentId = parent['PostId']
    let list = this.list.filter(function (item) { return item['ParentPostId'] === parentId });
    if (list.length > 0) {
      if (parent)
        parent['children'] = [];
      for (let i = 0; i < list.length; i++) {
        list[i]['key'] = list[i]['PostId'];
        list[i]['title'] = list[i]['PostName'];
        list[i]['parent'] = parent;
        if (expand && expand.indexOf(list[i]['PostId']) > -1)
          list[i]['expand'] = true;
        else
          list[i]['expand'] = false;
        this.generateNode(list[i], expand);
        if (parent)
          parent['children'].push(list[i]);
        else
          this.nodes.push(list[i]);
      }
    }
  }

  generateCategory(parent: any) {
    let parentId = 0;
    if (parent)
      parentId = parent['key'];
    let list = this.list.filter(function (item) { return item['ParentPostId'] === parentId && item['PostType'] === 'depart' });
    if (list.length > 0) {
      if (parent)
        parent['children'] = [];
      for (let i = 0; i < list.length; i++) {
        let node = { key: list[i]['PostId'], title: list[i]['PostName'], parent: parent }
        this.generateCategory(node);
        if (parent)
          parent['children'].push(node);
        else
          this.category.push(node);
      }
    }
    else if (parent)
      parent['isLeaf'] = true;
  }

  getlist(expand?: number[]) {
    this.postService.getlist().subscribe(result => {
      this.list = result['datalist'];
      this.nodes = [];
      this.generateNode(null, expand);
      this.category = [];
      this.generateCategory(null);
      this.listOfMapData = this.nodes;
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });
    });
  }

  addEdit(data: TreeNodeInterface, type: string): void {
    let title = '新增';
    if (type === 'new' && data) {
      title = '在“' + data.title + '”下新增';
    }
    else if (type === 'edit') {
      title = '编辑“' + data.title + '”';
    }
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    var that = this;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: type === 'edit' ? data : data ? { PostId: data['PostId'], ParentPostId: data['PostId'], parent: data['parent'] } : {},
        category: this.category,
        type: type,
      },
      nzMaskClosable: false,
      nzFooter: null,
      nzWidth: width,
      nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
    });
    modal.afterOpen.subscribe(function () {
      modal.getContentComponent().submitOk.subscribe(function ($event) {
        modal.close();
        let expand: number[] = [];
        if ($event && $event['parent']) {
          let curNode = $event;
          if (type === 'new')
            expand.push(curNode['PostId']);
          while (curNode['parent']) {
            curNode = curNode['parent'];
            expand.push(curNode['PostId']);
          }
        }
        that.getlist(expand);
      });
      modal.getContentComponent().closed.subscribe(function () {
        modal.close();
      });
    });
  }

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要删除此记录吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.postService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '删除成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  listOfMapData: TreeNodeInterface[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0 });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  ngOnInit(): void {
    this.getlist();
  }

}
