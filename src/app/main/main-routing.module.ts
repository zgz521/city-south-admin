import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { IndexComponent } from './index/index.component';
import { UserComponent } from './user/user.component';
import { AddEditComponent as UserAddEditComponent } from './user/add-edit/add-edit.component';
import { RoleComponent } from './role/role.component';
import { AddEditComponent as RoleAddEditComponent } from './role/add-edit/add-edit.component';
import { EstateComponent } from './estate/estate.component';
import { PropertyComponent } from './property/property.component';
import { AuthorComponent } from './author/author.component';
import { AddEditComponent as AuthorAddEditComponent } from './author/add-edit/add-edit.component';
import { PasswordComponent } from './user/password/password.component';
import { HouseComponent } from './house/house.component';
import { OwnerComponent } from './owner/owner.component';
import { HandHouseComponent } from './hand-house/hand-house.component';
import { ParkingComponent } from './parking/parking.component';
import { WaterandelectricityComponent } from './waterandelectricity/waterandelectricity.component';
import { ElsecostComponent } from './elsecost/elsecost.component';
import { AddEditComponent as HouseAddEditComponent } from './house/add-edit/add-edit.component';
import { AddBatchComponent as HouseAddBatchComponent } from './house/add-batch/add-batch.component';
import { AddEditComponent as OwnerAddEditComponent } from './owner/add-edit/add-edit.component';
import { CostConfigComponent } from './cost-config/cost-config.component';
import { AddEditComponent as CostConfigAddEditComponent } from './cost-config/add-edit/add-edit.component';
import { AddComponent as PropertyAddComponent } from './property/add/add.component';
import { EditComponent as PropertyEditComponent } from './property/edit/edit.component';
import { AddComponent as ParkingAddComponent } from './parking/add/add.component';
import { EditComponent as ParkingEditComponent } from './parking/edit/edit.component';
import { AddComponent as WaterAndElectricityAddComponent } from './waterandelectricity/add/add.component';
import { EditComponent as WaterAndElectricityEditComponent } from './waterandelectricity/edit/edit.component';
import { AddComponent as ElseCostAddComponent } from './elsecost/add/add.component';
import { EditComponent as ElseCostEditComponent } from './elsecost/edit/edit.component';
import { AddComponent as HandHouseAddComponent } from './hand-house/add/add.component';
import { EditComponent as HandHouseEditComponent } from './hand-house/edit/edit.component';
import { PostComponent } from './post/post.component';
import { AddEditComponent as PostAddEditComponent } from './post/add-edit/add-edit.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddEditComponent as EmployeeAddEditComponent } from './employee/add-edit/add-edit.component';
import { WorkPlanComponent } from './work-plan/work-plan.component';
import { GoodsCategoryComponent } from './goods-category/goods-category.component';
import { AddEditComponent as GoodsCategoryAddEditComponent } from './goods-category/add-edit/add-edit.component';
import { GoodsComponent } from './goods/goods.component';
import { StorageComponent } from './storage/storage.component';
import { StorageInComponent } from './storage-in/storage-in.component';
import { StorageOutComponent } from './storage-out/storage-out.component';
import { StorageCheckComponent } from './storage-check/storage-check.component';
import { ArticleComponent } from './article/article.component';
import { ComplainComponent } from './complain/complain.component';
import { RepairComponent } from './repair/repair.component';
import { AddEditComponent as GoodsAddEditComponent } from './goods/add-edit/add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'index', component: IndexComponent },
      //房产
      { path: 'estate', component: EstateComponent, children: [] },
      { path: 'house', component: HouseComponent, children: [{ path: 'add-edit', component: HouseAddEditComponent }, { path: 'add-batch', component: HouseAddBatchComponent }] },
      { path: 'owner', component: OwnerComponent, children: [{ path: 'add-edit', component: OwnerAddEditComponent }] },
      { path: 'hand-house', component: HandHouseComponent, children: [{ path: 'add', component: HandHouseAddComponent }, { path: 'edit', component: HandHouseEditComponent }] },
      //缴费
      { path: 'property', component: PropertyComponent, children: [{ path: 'add', component: PropertyAddComponent }, { path: 'edit', component: PropertyEditComponent }] },
      { path: 'parking', component: ParkingComponent, children: [{ path: 'add', component: ParkingAddComponent }, { path: 'edit', component: ParkingEditComponent }] },
      { path: 'waterandelectricity', component: WaterandelectricityComponent, children: [{ path: 'add', component: WaterAndElectricityAddComponent }, { path: 'edit', component: WaterAndElectricityEditComponent }] },
      { path: 'elsecost', component: ElsecostComponent, children: [{ path: 'add', component: ElseCostAddComponent }, { path: 'edit', component: ElseCostEditComponent }] },
      //人事
      { path: 'post', component: PostComponent, children: [{ path: 'add-edit', component: PostAddEditComponent }] },
      { path: 'employee', component: EmployeeComponent, children: [{ path: 'add-edit', component: EmployeeAddEditComponent }] },
      { path: 'work-plan', component: WorkPlanComponent },
      //库存
      { path: 'goods-category', component: GoodsCategoryComponent, children: [{ path: 'add-edit', component: GoodsCategoryAddEditComponent }] },
      { path: 'goods', component: GoodsComponent, children: [{ path: 'add-edit', component: GoodsAddEditComponent }] },
      { path: 'storage', component: StorageComponent },
      { path: 'storage-in', component: StorageInComponent },
      { path: 'storage-out', component: StorageOutComponent },
      { path: 'storage-check', component: StorageCheckComponent },
      //业主
      { path: 'article', component: ArticleComponent },
      { path: 'complain', component: ComplainComponent },
      { path: 'repair', component: RepairComponent },
      //设置
      { path: 'user', component: UserComponent, children: [{ path: 'add-edit', component: UserAddEditComponent }, { path: 'password', component: PasswordComponent }] },
      { path: 'role', component: RoleComponent, children: [{ path: 'add-edit', component: RoleAddEditComponent },] },
      { path: 'author', component: AuthorComponent, children: [{ path: 'add-edit', component: AuthorAddEditComponent },] },
      { path: 'cost-config', component: CostConfigComponent, children: [{ path: 'add-edit', component: CostConfigAddEditComponent }] },
      { path: '', redirectTo: '/main/index', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
