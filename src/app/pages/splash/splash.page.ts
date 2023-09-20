import { Component, OnInit, ElementRef,ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements AfterViewInit {
  @ViewChild('Logo') Logo!: ElementRef;

  constructor(private router: Router,
              private aniCtrl: AnimationController) { }
  
  ngAfterViewInit(): void {
      const mi_animacion=this.aniCtrl.create()
      .addElement(this.Logo.nativeElement)
      .duration(2000)
      .afterClearStyles(['filter'])
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.5)' },
        { offset: 1, transform: 'scale(1)' },
      ]);
      mi_animacion.play();
  }

  ngOnInit() {
    setTimeout(()=>{
      this.router.navigate(['/login']);
    },2400);
  }

}
