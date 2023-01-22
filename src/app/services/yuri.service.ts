import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from '../interfaces/class';
import { Pipe } from '../interfaces/pipe';

const yuri_location = 'http://localhost:8888/';

@Injectable({
  providedIn: 'root'
})
export class YuriService {

  constructor(private http: HttpClient) { }

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(yuri_location+"classes");
  }

  getPipes(): Observable<Pipe[]> {
    return this.http.get<Pipe[]>(yuri_location+"pipes");
  }
}
