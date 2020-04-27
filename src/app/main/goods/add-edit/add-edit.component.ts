import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { GoodsService } from 'src/app/service/goods.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() data: object;
  @Input() category: Array<object>;
  @Input() categoryNames: any;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  curCategorytId: number | null = null;
  expandKeys = [];
  cityList: any[] | null = null;
  cityItem: any[] | null = null;
  categorytList: any[] = [];
  categoryItem: any[] | null = null;
  street: string = '';
  errors: object = {}

  cancel() { this.closed.emit(); }

  handleOk() {
    this.isLoading = true;
      if (this.data['GoodsId'] && this.data['GoodsId'] > 0) {
        this.goodsService.modify(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '物资信息修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      } else {
        this.goodsService.add(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '物资新增成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
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

  transferNode(nodes: any[], categoryList: any[], parent?: any) {
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
      categoryList.push(newItem);
    });
  }

  onCategoryChanges() {
    this.data['CategoryId'] = this.categoryItem[this.categoryItem.length - 1];
  }

  constructor(private goodsService: GoodsService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.transferNode(this.category, this.categorytList);
    if (this.data['GoodsId']) {
      this.curCategorytId = this.data['CategoryId'];
      let node = this.findNode(this.categorytList, this.data['CategoryId']);
      let categoryItem = [];
      if (node) {
        categoryItem.push(node['value']);
        while (node['parent']) {
          node = node['parent'];
          categoryItem.push(node['value']);
        }
      }
      this.categoryItem = categoryItem.reverse();
    }
  }

}
