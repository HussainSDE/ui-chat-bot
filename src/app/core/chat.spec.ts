import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Chat } from './chat';

describe('Chat', () => {
  let service: Chat;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Chat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
