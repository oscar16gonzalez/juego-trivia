import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  constructor(public router: Router,) { }

  ngOnInit() {

      this.regresarMenu();
    
  }


  regresarMenu(){
    setTimeout(() => {
      this.router.navigate(['/menu']);
    }, 6000);
  }

}
