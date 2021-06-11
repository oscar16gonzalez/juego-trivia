import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TriviaService } from 'src/app/services/trivia.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalPage } from '../modal/modal.page';

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
  balones = "../../assets/img/balon.svg";
  boton: boolean = true;
  date = new Date('2020-01-01 00:00:20');
  padLeft = n => "00".substring(0, "00".length - n.length) + n;
  userActive;
  questionsList = [];
  questionActual = 1;
  idQuestion;
  continueNext;
  iconoBalon;
  animacion;
  animavionJugador;
  myNumeroAleatorio;
  myArray = [this.balones, this.balones, this.balones, this.balones, this.balones];
  myArrayCPU = [this.balones, this.balones, this.balones, this.balones, this.balones];
  animacionesFallo = [
    // '../../../assets/gifs/Ataja-D.gif',
    // '../../../assets/gifs/Ataja-I.gif',
    // '../../../assets/gifs/fallaste1.gif',
    '../../../assets/gifs/Palo-IS.gif',
    '../../../assets/gifs/Palo-DS.gif'
  ]
  animacionesGol = [
    '../../../assets/gifs/Cabeza-IS.gif',
    '../../../assets/gifs/Gol-DS.gif',
    '../../../assets/gifs/Gol-IS.gif'
  ]
  puntaje = 0
  puntajeCPU = 0
  prueba: boolean = false;
  category;
  intervalArquero
  indice = 0;

  constructor(private service: TriviaService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    public router: Router,
    public modalController: ModalController
    // private nativeAudio: NativeAudio
  ) {

    this.route.queryParams.subscribe(params => {
      this.category = params.data;


    });

  }

  ngOnInit() {

    // this.nativeAudio.preloadSimple('error', '../../assets/sonidos/error.wav');
    // this.nativeAudio.preloadSimple('error', 'assets/sonidos/fallo_gol-2.wav');
    // this.nativeAudio.preloadSimple('correct', 'assets/audio/correct.wav');
    this.userActive = localStorage.getItem('username');
    this.preguntasRespuestas();

  }

  preguntasRespuestas() {
    // this.nativeAudio.play('error');

    this.service.consultarPreguntas(this.category).then((result) => {
      if (result['questions'].length > 0) {
        if (this.questionActual < 6) {
          this.questionsList = result['questions'].slice(result['questions'].length - 5);
          this.consultarRespuestas(this.questionsList[this.questionActual - 1].id);
        }
      } else {
        this.categoriaSinPreguntas();

      }
    }).catch((err) => {
      console.log(err);

    });
  }


  consultarRespuestas(id) {
    this.service.consultarRespuestas(id).then((result) => {
      console.log(result);
      this.respuestas = result['answers'];
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
    this.saveQuestion(true, answer)
  }

  async categoriaSinPreguntas() {
    // clearInterval(this.interval);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Lo sentimos',
      message: `Esta categoria no contiene preguntas`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/menu']);
          }
        }
      ]
    });
    await alert.present();
  }

  async partidoTerminado() {

    if (this.puntaje > this.puntajeCPU) {
      alert("Partido Ganado");
      const dataPartido = {
        usuario: this.userActive,
        categoria: this.category,
        golesUsuario: this.puntaje,
        golesCPU: this.puntajeCPU,
        partidoGanado: true
      }
      this.presentModal();

      console.log(dataPartido);

      this.animavionJugador = "../../../assets/gifs/Animación-de-Celebración-sin-Escenario.gif"
    } else if (this.puntaje === this.puntajeCPU) {
      alert("Partido Empatado");
      this.animavionJugador = "../../../assets/gifs/Animación-de-Celebración-sin-Escenario.gif"
    } else {
      this.animavionJugador = "../../../assets/gifs/Jugador-Pierde.gif"
      alert("Perdiste");
    }

    setTimeout(() => {
      this.router.navigate(['/menu']);
    }, 6000);
  }


  saveQuestion(e, response) {

    this.myNumeroAleatorio = Math.floor(Math.random() * 2)
    if (this.myNumeroAleatorio === 1) {
      setTimeout(() => {
        this.puntajeCPU++
        this.myArrayCPU[this.indice] = "../../assets/img/balon-verde.svg"
      }, 4000);
    } else {
      setTimeout(() => {
        this.myArrayCPU[this.indice] = "../../assets/img/balon-rojo.svg"
      }, 4000);
    }


    if (this.questionActual < 6) {
     
      if (response.valid) {
        this.date = new Date('2020-01-01 00:00:20');
        this.animavionJugador = "../../../assets/gifs/Jugador-gol-D.gif"
        this.animacionesRandom(this.animacionesGol);

        setTimeout(() => {
          this.myArray[this.indice] = "../../assets/img/balon-verde.svg"
          this.indice++
          this.puntaje++;
          this.iconoBalon = "../../assets/img/balon-verde.svg";
          // this.myArray.push(this.iconoBalon);
          this.animacion = " ";
          this.animavionJugador = " ";

        }, 4000);

      } else {

        this.date = new Date('2020-01-01 00:00:20');
        this.animavionJugador = "../../../assets/gifs/Jugaador-Falla-D.gif"
        this.animacionesRandom(this.animacionesFallo);

        setTimeout(() => {
          this.iconoBalon = "../../assets/img/balon-rojo.svg";
          this.myArray[this.indice] = "../../assets/img/balon-rojo.svg"
          this.indice++
          this.animacion = " ";
          this.animavionJugador = " ";
        }, 4000);
      }

      if (this.questionsList.length === this.questionActual) {
        clearInterval(this.interval);
        setTimeout(() => {
          this.partidoTerminado();
        }, 4000);
      }

      if (this.questionActual === 5) {
      } else {
        this.questionActual++;
        this.preguntasRespuestas();
      }
    }

  }

  animacionesRandom(arrayAnimaciones) {

    var item = arrayAnimaciones.find((_, i, ar) => Math.random() < 1 / (ar.length - i));
    this.animacion = item;
    console.log(item);
  }

  menu() {
    this.router.navigate(['/menu']);
  }

  presentModal() {
    this.router.navigate(['/modal']);
  }
}
