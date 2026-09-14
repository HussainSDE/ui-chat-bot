import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export const AUTH_TOKEN_KEY = 'chat_bot_auth_token';

export interface LoginResponse {
  token: string;
  username: string;
}

@Service()
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly tokenSignal = signal<string | null>(this.readStoredToken());
  readonly isLoggedIn = signal<boolean>(!!this.tokenSignal());

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { username, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.tokenSignal.set(null);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    this.tokenSignal.set(token);
    this.isLoggedIn.set(true);
  }

  private readStoredToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}
