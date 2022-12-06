import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuestion } from '../model/question.interface';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private BACKEND_URL = `${environment.BACKEND}/api`;

  constructor(private http: HttpClient) {}

    /**
     * 
     * @returns An array of Questions
     */
    public getQuestions(): Observable<IQuestion[]>{
        return this.http.get<IQuestion[]>(this.BACKEND_URL + "/questions");
    }

    /**
     * 
     * @param answers List of Answers to check
     * @returns An array of results
     */
    public checkAnswers(answers: any[]): Observable<any>{
      return this.http.post(this.BACKEND_URL + "/checkanswers", answers);
    }
}
