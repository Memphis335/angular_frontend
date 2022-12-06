import { Component, OnInit } from '@angular/core';
import { IQuestion } from '../model/question.interface';
import { QuizService } from '../services/quiz.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation, AppearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  public questions$: Observable<IQuestion[]> | undefined;
  answer: any;
  checked = false;
  quizForm: FormGroup = new FormGroup({});

  constructor(private qService: QuizService, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.questions$ = this.qService.getQuestions().pipe(tap(questions => {
      questions.forEach((q) => {
        this.quizForm.addControl(q.id, new FormControl('', [Validators.required]))
      })
    }));
  }

  checkAnswers(){
    let answers: any[] = [];
    this.questions$?.pipe(map(questions => {
      questions.forEach((question: IQuestion) => {
        let answer = {
          "id": question.id,
          "answer": this.quizForm.controls[question.id].value
        };
        answers.push(answer);
      });
    }));
    
    this.qService.checkAnswers(answers).subscribe((result) => {
      this.markAnswers(result);
    });
  }

  markAnswers(results: any[]){
    this.checked = true;
    let numCorrect = 0;
    results.forEach(answer => {
      this.questions$?.pipe(map(questions => {
        let question = questions.find(q => q.id == answer.id);
        if(question){
          question.correct = answer.answerResult;
          answer.answerResult ? numCorrect++ : numCorrect;
        }
      }));
    });

    this.openConfirmBox(numCorrect);
  }

  questionRequired(id: string) {
    return this.quizForm.controls[id].invalid && this.quizForm.controls[id].touched;
  }

  openConfirmBox(score: number) {
    const newConfirmBox = new ConfirmBoxInitializer();

    newConfirmBox.setTitle('Your Score');
    newConfirmBox.setMessage(`You got ${score}/5 correct!`);

    newConfirmBox.setConfig({
      layoutType: DialogLayoutDisplay.INFO, // SUCCESS | INFO | NONE | DANGER | WARNING
      animationIn: AppearanceAnimation.BOUNCE_IN, // BOUNCE_IN | SWING | ZOOM_IN | ZOOM_IN_ROTATE | ELASTIC | JELLO | FADE_IN | SLIDE_IN_UP | SLIDE_IN_DOWN | SLIDE_IN_LEFT | SLIDE_IN_RIGHT | NONE
      animationOut: DisappearanceAnimation.BOUNCE_OUT, // BOUNCE_OUT | ZOOM_OUT | ZOOM_OUT_WIND | ZOOM_OUT_ROTATE | FLIP_OUT | SLIDE_OUT_UP | SLIDE_OUT_DOWN | SLIDE_OUT_LEFT | SLIDE_OUT_RIGHT | NONE
      buttonPosition: 'right'
    });

    newConfirmBox.setButtonLabels('Try again', 'Cancel');

    newConfirmBox.openConfirmBox$().subscribe(resp => {
      if(resp.clickedButtonID == 'try again'){
        this.load();
      }
    });
}
}
