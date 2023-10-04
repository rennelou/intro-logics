import {Proposition, Expression, proposition, not, Context, emptyContext, commitValid, getExpression} from './propositional';
import {isTrue, isFalse} from './test-utils';
import isEqual from 'lodash.isequal';

export type Exercise = {
    goal: Expression,
    propositions : Proposition [],
    premises : Context
}

// Esse arquivo faz mais sentido como um objeto
export type ExerciseBuilder = {
    propositions : Proposition [],
    premises : Context
}

export function createExerciseBuilder(): ExerciseBuilder {
    return {
        propositions : [],
	      premises : emptyContext()
    };
}

export function addProposition(s: string, e: ExerciseBuilder): ExerciseBuilder {
    const p = proposition(s);
    e.propositions.push(p);
    return e;
}

export function getProposition(i: number, e: ExerciseBuilder): Proposition | Error {
  if (i < 0) {
    throw Error("vai tomar no cu");
  }

  return e.propositions[i];
}

export function addPremise(e: Expression, b: ExerciseBuilder): ExerciseBuilder {
    b.premises = commitValid(e, b.premises);
    return b;
}

export function getPremise(i: number, b:  ExerciseBuilder): Expression | Error {
  return getExpression(i, b.premises);
}

function test1() {
    const builder = addProposition("p", createExerciseBuilder());
    isTrue(isEqual(proposition("p"), getProposition(0, builder)));
}

function test2() {
  const builder = addProposition("p", createExerciseBuilder());
  addPremise(not(getProposition(0, builder)), builder);
  isFalse(isEqual(not(proposition("p"), getPremise(0, builder))));
}

test1();

console.log("exercise-creator Passed!");
