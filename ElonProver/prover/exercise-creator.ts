import {Proposition, Expression, proposition, Context, emptyContext, commitValid, contextToList} from './propositional';
import {ExpressionBuilder} from './expression-creator';
import {Prover} from './prover';

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

export function createExpressionBuilder (b: ExerciseBuilder): ExpressionBuilder {
  return {
    propositions: b.propositions,
    auxiliarExpressions: contextToList (b.premises)
  }
} 

export function addProposition (e: ExerciseBuilder): (s: string) => ExerciseBuilder {
  return (s: string) => {
    const p = proposition(s);
    e.propositions.push(p);
    return e;
  }
}

export function addPremise (b: ExerciseBuilder): (e: Expression) => ExerciseBuilder {
  return (e: Expression) => {
    b.premises = commitValid(e, b.premises);
    return b;
  }
}

export function createProver (b: ExerciseBuilder, goal: Expression): Prover {
  return {
    goal: goal,
    propositions: b.propositions,
    context: b.premises
  };
}

console.log("exercise-creator Compiled but has not tests!");
