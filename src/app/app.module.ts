import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule} from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {environment} from '../environments/environment.prod'
import { HomeComponent } from './home/home.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule} from '@angular/material/dialog'
import { MovieDetailsDialog } from './utils/dialog-view';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MovieDetailsDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    HttpClientModule,
    MatPaginator,
    MatTooltipModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [
   provideAnimationsAsync()
  ],
  bootstrap: [AppComponent, HomeComponent]
})
export class AppModule { }
