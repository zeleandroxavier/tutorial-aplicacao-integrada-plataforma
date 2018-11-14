import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Adicione esta linha 
import { FormsModule } from '@angular/forms'; // Adicione esta linha
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Adicione esta linha
    FormsModule // Adicione esta linha
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
