import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/dashboard']);
    }
    return true;
  }
}