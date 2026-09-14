import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { Chat as ChatApi } from '../../core/chat';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  sentAt: Date;
}

@Component({
  imports: [FormsModule, DatePipe],
  selector: 'app-chat',
  styleUrl: './chat.css',
  templateUrl: './chat.html',
})
export class Chat implements AfterViewChecked {
  private readonly chatApi = inject(ChatApi);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  @ViewChild('scrollAnchor') private scrollAnchor?: ElementRef<HTMLDivElement>;
  private shouldScroll = false;

  readonly draft = signal('');
  readonly isSending = signal(false);
  readonly messages = signal<ChatMessage[]>([]);

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.shouldScroll = false;
      this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  sendMessage(): void {
    const text = this.draft().trim();
    if (!text || this.isSending()) {
      return;
    }

    this.pushMessage({ sender: 'user', text, sentAt: new Date() });
    this.draft.set('');
    this.isSending.set(true);
    this.shouldScroll = true;

    this.chatApi.sendMessage(text).subscribe({
      next: (response) => {
        this.pushMessage({ sender: 'bot', text: response.reply, sentAt: new Date() });
        this.isSending.set(false);
      },
      error: () => {
        this.pushMessage({
          sender: 'bot',
          text: 'Something went wrong reaching the chat bot.',
          sentAt: new Date(),
        });
        this.isSending.set(false);
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private pushMessage(message: ChatMessage): void {
    this.messages.update((current) => [...current, message]);
    this.shouldScroll = true;
  }
}
