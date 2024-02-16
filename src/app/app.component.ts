import { Component, HostListener, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  timeoutId: any;
  sessionTimeoutMessageAdded: boolean = false;
  isLoggedIn: boolean = false; // Tambahkan properti untuk menandai status login
  sessionTimeout: number = 600000; // Waktu sesi dalam milidetik (10 menit)

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cek apakah pengguna sudah login sebelum mengatur timeout sesi
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn; // Set properti isLoggedIn sesuai dengan status login
      if (isLoggedIn) {
        this.setSessionTimeout();
      }
    });
  }

  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  resetSessionTimeout(): void {
    clearTimeout(this.timeoutId);
    if (this.isLoggedIn) {
      // Hanya set timeout jika pengguna sudah login
      this.setSessionTimeout();
    }
  }

  setSessionTimeout(): void {
    this.timeoutId = setTimeout(() => {
      if (!this.sessionTimeoutMessageAdded) {
        // Periksa apakah pesan sudah ditambahkan
        this.messageService.add({
          severity: 'warn',
          summary: 'Sesi Berakhir',
          detail: 'Sesi Anda telah berakhir karena tidak aktif.',
        });
        this.authService.clearSection();
        this.sessionTimeoutMessageAdded = true; // Setelah ditambahkan, tandai bahwa pesan sudah ditambahkan
      }
    }, this.sessionTimeout); // 10 seconds timeout
  }
}
