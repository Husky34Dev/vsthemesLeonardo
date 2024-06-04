import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

// Módulos de Angular Material y Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

// Módulo de selección de color desde `ngx-color-picker`
import { ColorPickerModule } from 'ngx-color-picker';

// Otros módulos
import { HttpClientModule } from '@angular/common/http';
import { EditorComponent } from './editor/editor.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { UserComponent } from './user/user.component';
import { ThemesComponent } from './themes/themes.component';
import { ThemeListComponent } from './theme-list/theme-list.component';
import { FaqModalComponent } from './faq-modal/faq-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    RegisterComponent,
    LoginComponent,
    LandingComponent,
    UserComponent,
    ThemesComponent,
    ThemeListComponent,
    FaqModalComponent, 
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    ColorPickerModule, 
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
