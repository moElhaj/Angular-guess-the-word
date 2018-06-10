import { Component, OnInit } from '@angular/core';
import { PlayService } from '../play.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  public words = [];
  public len : number;
  public word;
  public index;
  public guesses = [];
  public gameOver: string;
  public letters = [];
  public letterToGuess = [];
  public letterStaging = [];
  public correct = 0;
  public chances = 3;
  public score = 0;
  public chosenLetter = [];
  public numbers = [];
  

  constructor(private api:PlayService) {}

  ngOnInit() {
    this.api.get().subscribe(data => this.words = data);
  }

  start(){
    if (this.guesses.length == this.words.length) {
      this.gameOver = "Game Over";
    } else {
      this.len = this.words.length;
      this.index =  Math.floor(Math.random() * Math.floor(this.len));
      this.check(this.index);
    }
  }

  check(index){
    let n = this.guesses.includes(index);
    if (n) {
      this.start();
    } else {
      this.guesses.push(this.index);
      this.word = this.words[this.index];
      this.getLetters();
    }
  }

  getLetters(){
    this.letters = this.word['word'].split('');
    this.letterStaging = this.letters.slice();
    let alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");

    for (let index = 0; index < 6; index++) {
      const element = Math.floor(Math.random() * 25) + 1;
      if (!this.letters.includes(alphabet[element])) {
        this.letterStaging.push(alphabet[element]);
      } 
    }

    for (let index = 0; index < this.letterStaging.length; index++) {
      if(this.letterToGuess.indexOf(this.letterStaging[index]) == -1){
        this.letterToGuess.push(this.letterStaging[index])
      } 
    }

   
    this.letterToGuess = this.shuffle(this.letterToGuess);
    this.numbers = Array(this.chances).fill(4);
  }

  newGame(){
    location.reload();
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  guess(letter, i, word){
    let m = this.chosenLetter.includes(letter);
    if (!m) {
      this.chosenLetter.push(letter);
      let n = this.letters.includes(letter);
      var idxs = [];
          
      if (this.chances > 0) {
        if (n) {
          let btn = document.getElementById("btn"+i);
          
          for (var j = this.letters.length - 1; j >= 0; j--) {
              if (this.letters[j] === letter) {
                  idxs.push(j);
              }
          }

          for (let index = 0; index < idxs.length; index++) {
            var cont = (<HTMLInputElement>document.getElementById("cont"+idxs[index]));
            cont.placeholder = letter;
            this.correct = this.correct + 1; 
          }

          btn.className = "btn btn-success";

          if (this.correct == this.letters.length) {
            this.score = this.score + 1;
            this.clear();
          }

        } else {
          var btn = document.getElementById("btn"+i);
          btn.className = "btn btn-danger";
          this.chances = this.chances - 1;
          this.numbers = Array(this.chances).fill(4);
          if (this.chances == 0) {
            this.clear();   
           }
        } 
      } else {
        this.clear();
      }   
    }
    return;
  }

  clear(){
    for (let index = 0; index < this.letters.length; index++) {
      var cont = (<HTMLInputElement>document.getElementById("cont"+[index]));
      cont.placeholder = '';     
    }

    for (let index = 0; index < this.letterToGuess.length; index++) {
      var btn = document.getElementById("btn"+index);
      btn.className = "btn btn-light";     
    }

    this.chosenLetter.length = 0;

    this.chances = 3;
    this.numbers = Array(this.chances).fill(4);
    this.correct = 0;
    this.start();
  }
}