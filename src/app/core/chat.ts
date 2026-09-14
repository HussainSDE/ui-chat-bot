import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatResponse {
  reply: string;
}

@Service()
export class Chat {
  private readonly http = inject(HttpClient);

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${environment.apiBaseUrl}/chat`, { message });
  }
}
