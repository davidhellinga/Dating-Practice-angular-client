import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../_models/message";
import {MessageService} from "../../_services/message.service";
import {Observable} from "rxjs";
import {NgForm} from "@angular/forms";
import {User} from "../../_models/user";
import {take} from "rxjs/operators";
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, OnDestroy {
  @Input() username: string;
  @Input() loadMessagesFlag: Observable<boolean>;
  @ViewChild('messageForm') messageForm: NgForm;
  messages: Message[] = [];
  messageContent: string;
  user: User;

  constructor(public messageService: MessageService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMessagesFlag.subscribe(val => {
      console.log(val)
      if (val === true) this.connectToMessageHub()
      if (val === false) this.disconnectFromMessageHub()
    });
  }

  connectToMessageHub() {
    console.log("Connecting")
    this.messageService.createHubConnection(this.user, this.username);
  }

  disconnectFromMessageHub() {
    console.log("Disconnecting")
    this.messageService.stopHubConnection();
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    })
  }

  ngOnDestroy(): void {
    this.disconnectFromMessageHub();
  }
}
