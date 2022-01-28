import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../_models/message";
import {MessageService} from "../../_services/message.service";
import {Observable} from "rxjs";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() username: string;
  @Input() loadMessagesFlag: Observable<boolean>;
  @ViewChild('messageForm') messageForm: NgForm;
  messages: Message[] = [];
  messageContent: string;

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadMessagesFlag.subscribe(val => {
      if (val === true) this.loadMessages()
    });
  }

  loadMessages() {
    this.messageService.getMessageThread(this.username).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    })
  }
}
