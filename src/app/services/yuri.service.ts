import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from '../interfaces/class';

const yuri_location = 'http://localhost:8888/';

@Injectable({
  providedIn: 'root'
})
export class YuriService {

  constructor(private http: HttpClient) { }

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(yuri_location+"classes");
  }
}
