import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomInterceptorModule } from './custom-interceptor.module';

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      CoreModule
   ],
   providers: [
      {
         provide: HTTP_INTERCEPTORS,
         useClass: CustomInterceptorModule,
         multi: true
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
