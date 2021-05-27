import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  readonly WEB_URL: string = environment.serverUrl;
  private httpOptions: any;


  constructor(private _http: HttpClient, private routes:Router) {
    try {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    } catch (Exception) { }
   }


  getUser(nickname): Promise<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
    console.log(this.WEB_URL);
    console.log(this.WEB_URL.concat(`/api/player/getByNickname/${nickname}`));
    
    return this._http.get(this.WEB_URL.concat(`/api/player/getByNickname/${nickname}`), httpOptions).toPromise();
  }


 createUsers(data){
    return this._http.post(this.WEB_URL.concat(`/api/player/simpleStore`), data).toPromise();
  }
  
  consultarPreguntas(id){
    return this._http.get(this.WEB_URL.concat(`/api/question/getByCategoryId/${id}`)).toPromise();
  }

  consultarRespuestas(id){
    return this._http.get(this.WEB_URL.concat(`/api/answer/getByQuestionId/${id}`)).toPromise();
  }

  consultarCategorias(id){
    return this._http.get(this.WEB_URL.concat(`/api/category/getByBoardId/${id}`)).toPromise();
  }

  consultarTemporadas(id){
    console.log(id);
    
    return this._http.get(this.WEB_URL.concat(`/api/board/getAll/active=${id}`)).toPromise();
  }

}

