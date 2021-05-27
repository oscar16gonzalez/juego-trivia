import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TriviaService } from 'src/app/services/trivia.service';

@Component({
  selector: 'app-season',
  templateUrl: './season.page.html',
  styleUrls: ['./season.page.scss'],
})
export class SeasonPage implements OnInit {
  preguntas;
  respuestas;
  questionTime;
  buton = "../../assets/img/boton-preguntas.svg"; 
  boton: boolean = true;
  date = new Date('2020-01-01 00:00:15');
  padLeft = n => "00".substring(0, "00".length - n.length) + n;
  userActive;
  constructor(private service: TriviaService,public alertController: AlertController) { }

  ngOnInit() {
    this.userActive = localStorage.getItem('username');
    let idQuestion;
    this.service.consultarPreguntas(1).then((result) => {
      this.preguntas = result['questions'];
      console.log(this.preguntas);
      for (let i = 0; i < this.preguntas.length; i++) {
        const element = this.preguntas[i];
        console.log(element.id);
        idQuestion = element.id;
      }

      console.log(idQuestion);
      this.consultarRespuestas(idQuestion);
      

    }).catch((err) => {
      console.log(err);

    });


  }

  consultarRespuestas(id){
    console.log(id);
    
    this.service.consultarRespuestas(id).then((result) => {
      console.log(result);
      this.respuestas = result['answers'];

      console.log(this.respuestas);


    }).catch((err) => {
      console.log(err);

    });
  }

  interval = setInterval(() => {
    // Asignqr el valor de segundos
    var seconds = this.padLeft(this.date.getSeconds() + "");

    this.questionTime = seconds;

    // Restarle a la fecha actual 1000 milisegundos
    this.date = new Date(this.date.getTime() - 1000);

    // Si llega a 2:45, eliminar el intervalo
    seconds == '00' ? this.timeOut(false) : this.questionTime = seconds;

  }, 1000);

  timeOut(answer) {
    !answer ? this.timeOutResponseFalse() : this.timeOutResponseTrue();
  }

  async timeOutResponseFalse() {
    clearInterval(this.interval);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Lo sentimos',
      message: `La respuesta es incorrecta`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async timeOutResponseTrue() {
    clearInterval(this.interval);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Felicidades',
      message: `la respuesta es correcta !!`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  onClick(e) {
    console.log(e);

    if (e.valid) {
      this.boton = false
      // this.buton = "../../assets/img/boton-verde.svg"
      console.log("SI");
      this.timeOutResponseTrue();
      
    }else{
      console.log("NO");
      this.timeOutResponseFalse();
      // this.buton = "../../assets/img/boton-preguntas.svg"
    }

  }
  
}
