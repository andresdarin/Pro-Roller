import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private _http: HttpClient) { }

  sendMessage(body) {
    // desa
    // return this._http.post('http://localhost:3005/formProRoller', body);

    //prod
    return this._http.post('https://proroller.uy/formProRoller/', body);
  }

}