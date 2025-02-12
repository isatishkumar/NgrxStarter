import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AppComponent } from './app.component';
import { HomeModule } from "./home/home.module";
import { UserEffects } from './store/user.effects';
import { UserReducer } from './store/user.reducer';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({ user: UserReducer }),
    EffectsModule.forRoot([UserEffects]),
    HomeModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    provideAnimationsAsync()
  ]
})
export class AppModule { }
