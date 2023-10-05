import {Proposition, Expression, proposition, not, Context, emptyContext, commitValid, getExpression} from './propositional';
import {isTrue, isFalse, fmap} from './test-utils';
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

export function addProposition(e: ExerciseBuilder): (s: string) => ExerciseBuilder {
    return (s: string) => {
      const p = proposition(s);
      e.propositions.push(p);
      return e;
    }
}

export function getProposition(e: ExerciseBuilder): (i: number) => Proposition | Error {
  return (i: number) => {
    if (i < 0) {
      throw Error("vai tomar no cu");
    }
  
    return e.propositions[i];
  }
}

export function addPremise (b: ExerciseBuilder): (e: Expression) => ExerciseBuilder {
    return (e: Expression) => {
      b.premises = commitValid(e, b.premises);
      return b;
    }
}

export function getPremise (b: ExerciseBuilder): (i: number) => Expression | Error {
  return (i: number) => { return getExpression(i, b.premises); }
}

function test1() {
    const builder = addProposition (createExerciseBuilder ()) ("p");
    isTrue(isEqual(proposition ("p"), getProposition (builder) (0)));
}

function test2() {
  const builder = addProposition (createExerciseBuilder()) ("p");
  const proposition0 = fmap (not) (getProposition (builder) (0));
  fmap (addPremise (builder)) (proposition0);
  isFalse(isEqual(not(proposition("p")), getPremise (builder) (0)));
}

test1();
test2();

console.log("exercise-creator Passed!");
