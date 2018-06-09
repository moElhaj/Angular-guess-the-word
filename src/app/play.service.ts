import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iword } from './word';

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  private url: string = "../assets/words.json";

  constructor(private http:HttpClient) { }

  get(): Observable<Iword[]>{
    return this.http.get<Iword[]>(this.url).pipe();
  }
}
