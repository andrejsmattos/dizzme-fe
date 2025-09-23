import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private activeRequests = 0;

  constructor(private spinner: NgxSpinnerService) {}

  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.loadingSubject.next(true);
      this.spinner.show();
    }
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
      this.spinner.hide();
    }
  }

  forceHide(): void {
    this.activeRequests = 0;
    this.loadingSubject.next(false);
    this.spinner.hide();
  }
}