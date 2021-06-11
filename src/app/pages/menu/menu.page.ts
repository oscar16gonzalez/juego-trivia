import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TriviaService } from 'src/app/services/trivia.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
categoria;
  constructor(private service: TriviaService, public router: Router) { }

  ngOnInit() {
    this.service.consultarCategorias(1).then((result) => {
      console.log("CATEGORIA --- " ,result);
      this.categoria = result['categories'];
      
    }).catch((err) => {
      console.log(err);
      
    });

    // this.service.consultarTemporadas(1).then((result) => {
    //   debugger
    //   console.log("TEMPORADAS --- " ,result);
    //   this.categoria = result;
      
    // }).catch((err) => {
    //   console.log(err);
      
    // });
  }

  season(idCategoria){
    console.log("E: ", idCategoria);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: idCategoria
      }
    };
    this.router.navigate(['/season'], navigationExtras)
  }

}
