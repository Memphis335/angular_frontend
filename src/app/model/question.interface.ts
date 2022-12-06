import { Difficulty } from "./difficulty";
import { Type } from "./type";

export interface IQuestion {
    "id": string,
    "type": Type,
    "difficulty": Difficulty,
    "category": String,
    "question": String,
    "possibleAnswers": String[],
    "answer": String,
    "correct": Boolean
}