import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private messageService: MessageService) {}
  test() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Save Successful',
    });
  }
  title = 'erte-web-app';
}
