import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interfaz-chofer',
  templateUrl: './interfaz-chofer.page.html',
  styleUrls: ['./interfaz-chofer.page.scss'],
})
export class InterfazChoferPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  configuraciones() {
    this.router.navigate(['/configuraciones'])
  }

  InterfazChofer() {
    this.router.navigate(['/home'])
  }



}
