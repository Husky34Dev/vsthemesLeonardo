import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent
    // Añade aquí otros componentes que hayas creado
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
    ColorPickerModule, // Importa el módulo desde ngx-color-picker
    HttpClientModule
  ],
  providers: [
    // Remueve `provideAnimationsAsync` si no es necesario
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
