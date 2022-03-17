import {Component, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../_models/member";
import {MembersService} from "../../_services/members.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "@kolkov/ngx-gallery";
import {TabDirective, TabsetComponent} from "ngx-bootstrap/tabs";
import {BehaviorSubject} from "rxjs";
import {PresenceService} from "../../_services/presence.service";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  loadMessages = new BehaviorSubject(false);

  constructor(private memberService: MembersService, private route: ActivatedRoute, public presence: PresenceService, private router: Router) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    })
    this.galleryImages = this.getImages()
    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
  }


  getImages(): NgxGalleryImage[] {
    const imgUrls = [];
    for (const photo of this.member.photos) {
      imgUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imgUrls;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages') {
      if (this.loadMessages.subscribe(val => val !== true)) this.loadMessages.next(true);
    } else if (this.loadMessages.subscribe(val => val !== false)) this.loadMessages.next(false);
  }

  async selectTab(tabName: string | number) {
    if (typeof tabName === "string") this.memberTabs.tabs.find(tab => tab.heading === tabName).active = true;
    else this.memberTabs.tabs[tabName].active = true;
  }
}
