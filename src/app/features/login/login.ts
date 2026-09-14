import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly username = signal('');
  readonly password = signal('');
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  onSubmit(): void {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Please enter both username and password.');
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.auth.login(this.username(), this.password()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/chat']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Invalid username or password.');
      },
    });
  }
}
