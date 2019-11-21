import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {TrendingComponent} from './trending/trending.component';
import {LikedComponent} from './liked/liked.component';
import {RecommendationComponent} from './recommendation/recommendation.component';
import {PostedComponent} from './posted/posted.component';
import {CategoryComponent} from './category/category.component';
import { EditProfileComponent} from './edit-profile/edit-profile.component';
import {ViewProfileComponent} from './view-profile/view-profile.component';
import { SearchComponent} from './search/search.component';
import {NotfoundComponent} from './notfound/notfound.component';
import {PostDetailComponent} from './post-detail/post-detail.component';
import {ActivitiesComponent} from './activities/activities.component';
import { GraphComponent } from './graph/graph.component';
import {CompanyRegisterComponent} from './company-register/company-register.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CompanyRegisterStepperComponent } from './company-register-stepper/company-register-stepper.component';
import { FooterComponent } from './footer/footer.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';


const routes: Routes = [
  {path: '', redirectTo: '/trending', pathMatch : 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'trending', component: TrendingComponent},
  {path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard]},
  {path: 'recommended', component: RecommendationComponent},
  {path: 'posted', component: PostedComponent, canActivate: [AuthGuard]},
  {path: 'category/:categoryName', component: CategoryComponent},
  {path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuard]},
  {path: 'viewProfile', component: ViewProfileComponent, canActivate: [AuthGuard]},
  {path: 'search/:query', component: SearchComponent},
  {path: 'graph', component: GraphComponent},
  {path: '404', component: NotfoundComponent},
  {path: 'postDetail/:postId', component: PostDetailComponent},
  {path: 'orgRegister', component: CompanyRegisterComponent},
  {path: 'terms', component: TermsAndConditionsComponent},
  {path: 'privacy', component: PrivacyPolicyComponent},
  {path: 'orgRegister1', component: CompanyRegisterStepperComponent},
  {path: 'footer', component: FooterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponents = [RegisterComponent];
