import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { ShareModule } from '../share/share.module';
import { MainComponent } from './main.component';
import { IndexComponent } from './index/index.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { AddEditComponent as UserAddEditComponent } from './user/add-edit/add-edit.component';
import { AddEditComponent as RoleAddEditComponent } from './role/add-edit/add-edit.component';
import { EstateComponent } from './estate/estate.component';
import { PropertyComponent } from './property/property.component';
import { AuthorComponent } from './author/author.component';
import { AddEditComponent as AuthorAddEditComponent} from './author/add-edit/add-edit.component';
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
import { GoodsComponent } from './goods/goods.component';
import { StorageComponent } from './storage/storage.component';
import { StorageInComponent } from './storage-in/storage-in.component';
import { StorageOutComponent } from './storage-out/storage-out.component';
import { StorageCheckComponent } from './storage-check/storage-check.component';
import { ArticleComponent } from './article/article.component';
import { ComplainComponent } from './complain/complain.component';
import { RepairComponent } from './repair/repair.component';
import { AddEditComponent as GoodsCategoryAddEditComponent } from './goods-category/add-edit/add-edit.component';
import { AddEditComponent as GoodsAddEditComponent } from './goods/add-edit/add-edit.component';
import { CarComponent } from './car/car.component';
import { LeaveComponent } from './leave/leave.component';
import { AddEditComponent as LeaveAddEditComponent } from './leave/add-edit/add-edit.component';
import { AddEditComponent as ArticleAddEditComponent } from './article/add-edit/add-edit.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IntroductComponent as EstateIntroductComponent } from './estate/introduct/introduct.component';

@NgModule({
  declarations: [
    MainComponent,
    IndexComponent,
    UserComponent,
    UserAddEditComponent,
    RoleComponent,
    RoleAddEditComponent,
    EstateComponent,
    PropertyComponent,
    AuthorComponent,
    AuthorAddEditComponent,
    PasswordComponent,
    HouseComponent,
    OwnerComponent,
    HandHouseComponent,
    ParkingComponent,
    WaterandelectricityComponent,
    ElsecostComponent,
    HouseAddEditComponent,
    HouseAddBatchComponent,
    OwnerAddEditComponent,
    CostConfigComponent,
    CostConfigAddEditComponent,
    PropertyAddComponent,
    PropertyEditComponent,
    ParkingAddComponent,
    ParkingEditComponent,
    WaterAndElectricityAddComponent,
    WaterAndElectricityEditComponent,
    ElseCostAddComponent,
    ElseCostEditComponent,
    HandHouseAddComponent,
    HandHouseEditComponent,
    PostComponent,
    PostAddEditComponent,
    EmployeeComponent,
    EmployeeAddEditComponent,
    WorkPlanComponent,
    GoodsCategoryComponent,
    GoodsComponent,
    StorageComponent,
    StorageInComponent,
    StorageOutComponent,
    StorageCheckComponent,
    ArticleComponent,
    ComplainComponent,
    RepairComponent,
    GoodsCategoryAddEditComponent,
    GoodsAddEditComponent,
    CarComponent,
    LeaveComponent,
    LeaveAddEditComponent,
    ArticleAddEditComponent,
    EstateIntroductComponent
  ],
  imports: [
    ShareModule,
    MainRoutingModule,
    CKEditorModule
  ],
  exports: [
    MainRoutingModule
  ]
})
export class MainModule { }
