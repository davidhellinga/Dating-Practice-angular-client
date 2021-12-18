import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {MemberListComponent} from "./members/member-list/member-list.component";
import {MemberDetailComponent} from "./members/member-detail/member-detail.component";
import {MessagesComponent} from "./messages/messages.component";
import {AuthGuard} from "./_guards/auth.guard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path:'',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children:[
      {path: 'members', component: MemberListComponent},
      {path: 'members/:id', component: MemberDetailComponent},
      {path: 'lists', component: MemberListComponent},
      {path: 'messages', component: MessagesComponent},
      {path: '**', redirectTo:'/', pathMatch: 'full'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}