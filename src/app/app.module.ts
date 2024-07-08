import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterOutlet } from "@angular/router";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { MockBackendInterceptor } from "./shared/mock-backend/mock-backend.interceptor";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormCardComponent } from './components/form-card/form-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { AppRoutingModule } from './app-routing.module';
import { ValidationTooltipDirective } from './directives/validation-tooltip.directive';
import { FormatTimePipe } from './pipes/format-time.pipe';

@NgModule({
  declarations: [AppComponent, FormCardComponent, FormPageComponent, ValidationTooltipDirective, FormatTimePipe],
  imports: [
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    RouterOutlet,
    NgbModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
