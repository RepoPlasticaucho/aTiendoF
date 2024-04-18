import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from "src/app/services/authentication.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-navegation-facturador',
  templateUrl: './navegation-facturador.component.html',
  styleUrls: ['./navegation-facturador.component.css']
})
export class NavegationFacturadorComponent {

  transaccionesExpandidas = false;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private location: Location) {}

  logout() {
    this.authService.logout();
    this.location.replaceState('/');
    window.location.reload();
  }

}
