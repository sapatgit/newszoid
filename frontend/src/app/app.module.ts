import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule, MatGridListModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatNativeDateModule, MatProgressBarModule, MatSelectModule,
  MatStepperModule, MatTabsModule, MatSnackBarModule,
  MatToolbarModule, MatBadgeModule,
} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatVideoModule } from 'mat-video';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import {DatePipe} from '@angular/common';
import { UploadComponent } from './upload/upload.component';
import { TrendingComponent } from './trending/trending.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { LikedComponent } from './liked/liked.component';
import { PostedComponent } from './posted/posted.component';
import { PostComponent } from './post/post.component';
import { CategoryComponent } from './category/category.component';
import { EditProfileComponent} from './edit-profile/edit-profile.component';
import { SearchComponent } from './search/search.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import {ViewProfileComponent} from './view-profile/view-profile.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivitiesComponent } from './activities/activities.component';
import { FlaggedComponent } from './flagged/flagged.component';
import { WatchedComponent } from './watched/watched.component';
import { SearchMobileComponent } from './search-mobile/search-mobile.component';
import { EditpostComponent } from './editpost/editpost.component';
import { PostDataComponent } from './post-data/post-data.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {BottomSheetNewsZoid} from '../app/navbar/navbar.component';
import { GraphComponent } from './graph/graph.component';
import {MatChipsModule} from '@angular/material/chips';
import { CompanyRegisterComponent } from './company-register/company-register.component';


import {MatPaginatorModule} from '@angular/material/paginator';

import {MatExpansionModule} from '@angular/material/expansion';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FlagPostComponent } from './flag-post/flag-post.component';
import { CompanyRegisterStepperComponent } from './company-register-stepper/company-register-stepper.component';
import { SubscriptionPageComponent } from './subscription-page/subscription-page.component';


import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FooterComponent } from './footer/footer.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GoogleMapsModule } from '@angular/google-maps';
import {AuthGuardService} from './services/auth-guard.service';
import {AuthService} from './services/auth.service';
import {JWT_OPTIONS, JwtHelperService, JwtModule, JwtModuleOptions} from '@auth0/angular-jwt';
// @ts-ignore

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

const JWT_Module_Options: JwtModuleOptions = {
  config: {
    tokenGetter: tokenGetter
  }
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    UploadComponent,
    TrendingComponent,
    RecommendationComponent,
    LikedComponent,
    PostedComponent,
    PostComponent,
    CategoryComponent,
    EditProfileComponent,
    SearchComponent,
    SearchbarComponent,
    ViewProfileComponent,
    NotfoundComponent,
    PostDetailComponent,
    ActivitiesComponent,
    FlaggedComponent,
    WatchedComponent,
    SearchMobileComponent,
    EditpostComponent,
    PostDataComponent,
    BottomSheetNewsZoid,
    GraphComponent,
    CompanyRegisterComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    FlagPostComponent,
    CompanyRegisterStepperComponent,
    SubscriptionPageComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatProgressBarModule,
    MatCardModule,
    MatGridListModule,
    MatVideoModule,
    MatCheckboxModule,
    MatSelectModule,
    FlexLayoutModule,
    MatTabsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatChipsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    AngularFontAwesomeModule,
    GoogleMapsModule,
    JwtModule.forRoot(JWT_Module_Options)
  ],
  entryComponents: [
    LoginComponent,
    UploadComponent,
    EditpostComponent,
    BottomSheetNewsZoid,
    FlagPostComponent
  ],
  providers: [DatePipe, CategoryComponent, GraphComponent, AuthGuardService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
