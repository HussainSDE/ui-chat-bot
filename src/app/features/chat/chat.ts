import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { Chat as ChatApi } from '../../core/chat';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-chat',
  styleUrl: './chat.css',
  templateUrl: './chat.html',
})
export class Chat {
  private readonly chatApi = inject(ChatApi);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly draft = signal('');
  readonly isSending = signal(false);
  readonly messages = signal<ChatMessage[]>([]);

  sendMessage(): void {
    const text = this.draft().trim();
    if (!text || this.isSending()) {
      return;
    }

    this.messages.update((current) => [...current, { sender: 'user', text }]);
    this.draft.set('');
    this.isSending.set(true);

    this.chatApi.sendMessage(text).subscribe({
      next: (response) => {
        this.messages.update((current) => [...current, { sender: 'bot', text: response.reply }]);
        this.isSending.set(false);
      },
      error: () => {
        this.messages.update((current) => [
          ...current,
          { sender: 'bot', text: 'Something went wrong reaching the chat bot.' },
        ]);
        this.isSending.set(false);
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
