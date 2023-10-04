import {Proposition, Expression, proposition, Context, emptyContext} from './propositional';
import {isTrue, isFalse} from './test-utils';
import isEqual from 'lodash.isequal';

export type Exercise = {
    goal: Expression,
    propositions : Proposition [],
    premises : Context
}

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

export function getProposition(i: number, e: ExerciseBuilder): Proposition {
    return e.propositions[i];
}

function test1() {
    const builder = addProposition("p", createExerciseBuilder());
    isTrue(isEqual(proposition("p"), getProposition(0, builder)));
}

test1();

console.log("exercise-creator Passed!");
