
import {isTrue, isFalse} from './test-utils';
import isEqual from 'lodash.isequal';


// Parte sintatica

export type Proposition = {
    tag: "proposition",
    value: string
};

export type Negation = {
    tag: "negation",
    exp: Expression
}

export type And = {
    tag: "and",
    exp1: Expression,
    exp2: Expression
}

export type Or = {
    tag: "or",
    exp1: Expression,
    exp2: Expression
}

export type Implication = {
    tag: "implication",
    conditional: Expression,
    conclusion: Expression
}

export type Expression =
    | Proposition
    | Negation
    | And
    | Or
    | Implication

export function proposition(s: string): Proposition {
    return {
        tag: "proposition",
        value: s
    }
}

export function not(e: Expression): Negation {
    return {
        tag: "negation",
        exp: e
    }
}

export function and(e1: Expression, e2: Expression): And {
    return {
        tag: "and",
        exp1: e1,
        exp2: e2
    }
}

export function or(e1: Expression, e2: Expression): Or {
    return {
        tag: "or",
        exp1: e1,
        exp2: e2
    }
}

export function implies(e1: Expression, e2: Expression): Implication {
    return {
        tag: "implication",
        conditional: e1,
        conclusion: e2
    }
}

// ---------------------------------------------

// Parte das regras de inferência (equivalente à semântica)

export type EmptyContext = {
    tag: "emptyContext"
};

export type ConditionalClosure = {
    tag: "conditionalClosure",
    assumption: Expression,
    context: Context
};

export type CommitValid = {
    tag: "commitValid",
    expression: Expression,
    context: Context
};

export type Context =
    | EmptyContext
    | ConditionalClosure
    | CommitValid

export function emptyContext(): EmptyContext {
    return { tag: "emptyContext" };
}

export function conditionalClosure(e: Expression, c: Context): ConditionalClosure {
    return {
        tag: "conditionalClosure",
        assumption: e,
        context: c
    }
}

export function commitValid(e: Expression, c: Context): CommitValid {
    return {
        tag: "commitValid",
        expression: e,
        context: c
    }
}

function contextMatch<T>(
    f1: (ec: EmptyContext) => T,
    f2: (cc: ConditionalClosure) => T,
    f3: (cv: CommitValid) => T
): (c: Context) => T {
    return (c: Context) => {
        switch (c.tag) {
            case "emptyContext":
                return f1(c);

            case "conditionalClosure":
                return f2(c);

            case "commitValid":
                return f3(c);

            default:
                throw new Error("Error on pattern matching Context type");
        }
    }
}

export function getExpression(i: number, c: Context): Expression | Error {
    if (i < 0) {
      throw Error("vai tomar no cu");
    }
    
    const base: (c: Context) => (Expression | Error) = 
      contextMatch(
            (_: EmptyContext) => { return Error("This context not have enough elements"); },
            (cc: ConditionalClosure) => { return justExpression(cc.assumption); },
            (cv: CommitValid) => { return justExpression(cv.expression); }
      );

    const inductionStep: (si: number) => (c: Context) => (Expression | Error) =
      (si: number) => {
          return contextMatch(  
            (_: EmptyContext) => { return Error("This context not have enough elements"); },
            (cc: ConditionalClosure) => { return getExpression(si-1, cc.context); },
            (cv: CommitValid) => { return getExpression(si-1, cv.context); }
          );
      }
        
    if (i === 0) {
        return base(c);
    } else {
        return inductionStep(i)(c);
    }
}

function justExpression(e: Expression): Expression | Error {
  return e;
}

function contextElem(e: Expression, c: Context): boolean {

    const elem: (c: Context) => boolean =
        contextMatch(
            (_: EmptyContext) => { return false },
            (cc: ConditionalClosure) => {
                if (isEqual(cc.assumption, e)) {
                    return true;
                } else {
                    return elem(cc.context);
                }
            },
            (cv: CommitValid) => {
                if (isEqual(cv.expression, e)) {
                    return true;
                } else {
                    return elem(cv.context);
                }
            }
        );

    return elem(c);
}

const contextIsClosed: (c: Context) => boolean =
    contextMatch(
        (_: EmptyContext) => {
            return true;
	},
	(_: ConditionalClosure) => {
            return false;
	},
	(cv: CommitValid) => {
	    return contextIsClosed(cv.context);
	}
    );

export function implicationIntroductionRule(e: Expression, c: Context): Context | Error {
    if (contextElem(e, c)) {

        const implicationIntroduction: (c: Context) => Context | Error =
            contextMatch(
                (_: EmptyContext) => { return Error("Can't introduct a implication outside of a closure"); },
                (cc: ConditionalClosure) => {
                    const implication = implies(cc.assumption, e);
                    return commitValid(implication, cc.context);
                },
                (cv: CommitValid) => {
                    return implicationIntroduction(cv.context);
                }
            );

        return implicationIntroduction(c);
    } else {
        return Error("The given expression is not valid in the context");
    }
}

export function implicationEliminationRule(condition: Expression, imp: Implication, c: Context): Context | Error {
    if (contextElem(condition, c) && contextElem(imp, c)) {
        if (isEqual(condition, imp.conditional)) {
            return commitValid(imp.conclusion, c);
        } else {
            return Error("Invalid use of implicationElimination rule");
        }
    } else {
        return Error("Some given expression is not valid in the context");
    }
}

export function andIntroductionRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (contextElem(e1, c) && contextElem(e2, c)) {
        return commitValid(and(e1, e2), c);
    } else {
        return Error("Some given expression is not valid in the context");
    }
}

export function andEliminationLeftRule(a: And, c: Context): Context | Error {
    if (contextElem(a, c)) {
        return commitValid(a.exp1, c);
    } else {
        return Error("The given expression is not valid in the context");
    }
}

export function andEliminationRightRule(a: And, c: Context): Context | Error {
    if (contextElem(a, c)) {
        return commitValid(a.exp2, c);
    } else {
        return Error("The given expression is not valid in the context");
    }
}

export function orIntroductionLeftRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (contextElem(e1, c)) {
        return commitValid(or(e1, e2), c);
    } else {
        return Error("The respective left expression is not valid in the context");
    }
}

export function orIntroductionRightRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (contextElem(e2, c)) {
        return commitValid(or(e1, e2), c);
    } else {
        return Error("The respective right expression is not valid in the context");
    }
}

export function orEliminationRule(o: Or, imp1: Implication, imp2: Implication, c: Context): Context | Error {
    if (contextElem(o, c) && contextElem(imp1, c) && contextElem(imp2, c)) {
        if (isEqual(o.exp1, imp1.conditional) && 
	    isEqual(o.exp2, imp2.conditional) && 
	    isEqual(imp1.conclusion, imp2.conclusion)
	   ) {
            return commitValid(imp1.conclusion, c);
        } else {
            return Error("Invalid use of or elimination rule");
        }

    } else {
        return Error("Some given expression is not valid in the context");
    }
}

export function negationIntroductionRule(imp1: Implication, imp2: Implication, c: Context): Context | Error {
    if (contextElem(imp1, c) && contextElem(imp2, c)) {
        if (isEqual(imp1.conditional, imp2.conditional) &&
	    isEqual(not(imp1.conclusion), imp2.conclusion)
	   ) {
            return commitValid(not(imp1.conditional), c);
        } else {
            return Error("Invalid use of negation introduction rule");
        }
    } else {
        return Error("Some given expression is not valid in the context");
    }
}

export function negationEliminationRule(n: Negation, c: Context): Context | Error {
    if (contextElem(n, c)) {
        if (n.exp.tag === "negation") {
            return commitValid(n.exp.exp, c)
        } else {
            return Error("Invalid use of negation elimination rule");
        }
    } else {
        return Error("The given expression is not valid in the context");
    }
}

// ------------------------------

// Teste

function extract<T>(result: T | Error): T {
    if (result instanceof Error) {
        throw result;
    } else {
        return result;
    }
}

function isValid(e: Expression, c: Context): boolean {
    return contextIsClosed(c) && contextElem(e, c);
}

const p = proposition("p");
const q = proposition("q");
const r = proposition("r");
const m = proposition("m");

function implicationIntroductionTest() {
    const premises = commitValid(p, conditionalClosure(q, emptyContext()));

    const result = extract(implicationIntroductionRule(p, premises));
    isTrue(isValid(implies(q, p), result));
}

function implicationEliminationAndIntroductionTest() {
    const premises = commitValid(p, commitValid(implies(p, q), emptyContext()));

    const result = extract(implicationEliminationRule(p, implies(p, q), premises));
    isTrue(isValid(q, result));

    const result1 = extract(andIntroductionRule(p, q, result));
    isTrue(isValid(and(p, q), result1));
}

function andEliminationTest() {
    const premises = commitValid(and(p, q), emptyContext());

    const result1 = extract(andEliminationLeftRule(and(p, q), premises));
    const result2 = extract(andEliminationRightRule(and(p, q), premises));

    isTrue(isValid(p, result1));
    isTrue(isValid(q, result2));
}

function orIntroductionTest() {
    const premises = commitValid(p, emptyContext());

    const result1 = extract(orIntroductionLeftRule(p, q, premises));
    const result2 = extract(orIntroductionRightRule(r, p, premises));

    isTrue(isValid(or(p, q), result1));
    isTrue(isValid(or(r, p), result2));
}

function orEliminationTest() {
    const premises = commitValid(or(p, q), commitValid(implies(p, r), commitValid(implies(q, r), emptyContext())));

    const result = extract(orEliminationRule(or(p, q), implies(p, r), implies(q, r), premises));
    isTrue(isValid(r, result));
}

function negationIntroductionTest() {
    const premises = commitValid(implies(not(p), q), commitValid(implies(not(p), not(q)), emptyContext()));

    const result = extract(negationIntroductionRule(implies(not(p), q), implies(not(p), not(q)), premises));
    isTrue(isValid(not(not(p)), result));

    const result1 = extract(negationEliminationRule(not(not(p)), result));
    isTrue(isValid(p, result1));
}

function exercise1() {
    const premises = commitValid(p, commitValid(implies(p, implies(q, r)), commitValid(implies(p, q), emptyContext())));

    const step1 = extract(implicationEliminationRule(p, implies(p, q), premises));
    const step2 = extract(implicationEliminationRule(p, implies(p, implies(q, r)), step1));
    const step3 = extract(implicationEliminationRule(q, implies(q, r), step2));

    isTrue(isValid(r, step3));
}

function exercise2() {
    const premises = commitValid(implies(p, q), commitValid(implies(m, or(p, q)), emptyContext()));

    const step1 = conditionalClosure(q, premises);
    const step2 = extract(implicationIntroductionRule(q, step1));

    const step3 = conditionalClosure(m, step2);
    const step4 = extract(implicationEliminationRule(m, implies(m, or(p, q)), step3));

    const step5 = extract(orEliminationRule(or(p, q), implies(p, q), implies(q, q), step4));
    const step6 = extract(implicationIntroductionRule(q, step5));

    isTrue(isValid(implies(m, q), step6));
}

function implicationReversalExercise() {
    const premises = commitValid(implies(p, q), emptyContext());

    const step1 = conditionalClosure(not(q), premises);

    const step2 = conditionalClosure(p, step1);
    const step3 = extract(implicationIntroductionRule(not(q), step2));

    const step4 = extract(negationIntroductionRule(implies(p, q), implies(p, not(q)), step3));

    const step5 = extract(implicationIntroductionRule(not(p), step4));

    isTrue(isValid(implies(not(q), not(p)), step5));
}

function booleanExponentialExercise() {
    const premises = commitValid(implies(p, q), emptyContext());

    const step1 = conditionalClosure(not(or(not(p), q)), premises);

    const step2 = conditionalClosure(p, step1);
    const step3 = extract(implicationEliminationRule(p, implies(p, q), step2));
    const step4 = extract(orIntroductionRightRule(not(p), q, step3));
    const step5 = extract(implicationIntroductionRule(or(not(p), q), step4));

    const step6 = conditionalClosure(p, step5);
    const step7 = extract(implicationIntroductionRule(not(or(not(p), q)), step6));
    const step8 = extract(negationIntroductionRule(implies(p, or(not(p), q)), implies(p, not(or(not(p), q))), step7));

    const step9 = extract(implicationIntroductionRule(not(p), step8));

    const step10 = conditionalClosure(not(or(not(p), q)), step9);

    const step11 = conditionalClosure(not(p), step10);
    const step12 = extract(orIntroductionLeftRule(not(p), q, step11));
    const step13 = extract(implicationIntroductionRule(or(not(p), q), step12));

    const step14 = conditionalClosure(not(p), step13);
    const step15 = extract(implicationIntroductionRule(not(or(not(p), q)), step14));
    const step16 = extract(negationIntroductionRule(implies(not(p), or(not(p), q)), implies(not(p), not(or(not(p), q))), step15));

    const step17 = extract(implicationIntroductionRule(not(not(p)), step16));

    const step18 = extract(negationIntroductionRule(implies(not(or(not(p), q)), not(p)), implies(not(or(not(p), q)), not(not(p))), step17));
    const step19 = extract(negationEliminationRule(not(not(or(not(p), q))), step18))

    isTrue(isValid(or(not(p), q), step19));
}

function deMorganExercise() {
    const deMorganPremise = commitValid(not(or(p, q)), emptyContext());

    const step1 = conditionalClosure(p, deMorganPremise);
    const step2 = extract(orIntroductionLeftRule(p, q, step1));
    const step3 = extract(implicationIntroductionRule(or(p, q), step2));

    const step4 = conditionalClosure(p, step3);
    const step5 = extract(implicationIntroductionRule(not(or(p, q)), step4));
    const step6 = extract(negationIntroductionRule(implies(p, or(p, q)), implies(p, not(or(p, q))), step5));

    const step7 = conditionalClosure(q, step6);
    const step8 = extract(orIntroductionRightRule(p, q, step7));
    const step9 = extract(implicationIntroductionRule(or(p, q), step8));

    const step10 = conditionalClosure(q, step9);
    const step11 = extract(implicationIntroductionRule(not(or(p, q)), step10));
    const step12 = extract(negationIntroductionRule(implies(q, or(p, q)), implies(q, not(or(p, q))), step11));

    const step13 = extract(andIntroductionRule(not(p), not(q), step12));

    isTrue(isValid(and(not(p), not(q)), step13));
}

function excludedMiddleExercise() {
    const step3 = conditionalClosure(not(or(p, not(p))), emptyContext());
    const step4 = conditionalClosure(p, step3);
    const step5 = extract(orIntroductionLeftRule(p, not(p), step4));
    const step6 = extract(implicationIntroductionRule(or(p, not(p)), step5));

    const step7 = conditionalClosure(p, step6);
    const step8 = extract(implicationIntroductionRule(not(or(p, not(p))), step7));
    const step9 = extract(negationIntroductionRule(implies(p, or(p, not(p))), implies(p, not(or(p, not(p)))), step8));
    const step10 = extract(implicationIntroductionRule(not(p), step9));

    const step11 = conditionalClosure(not(or(p, not(p))), step10);
    const step12 = conditionalClosure(not(p), step11);
    const step13 = extract(orIntroductionRightRule(p, not(p), step12));
    const step14 = extract(implicationIntroductionRule(or(p, not(p)), step13));

    const step15 = conditionalClosure(not(p), step14);
    const step16 = extract(implicationIntroductionRule(not(or(p, not(p))), step15));
    const step17 = extract(negationIntroductionRule(implies(not(p), or(p, not(p))), implies(not(p), not(or(p, not(p)))), step16));
    const step18 = extract(implicationIntroductionRule(not(not(p)), step17));
    const step19 = extract(negationIntroductionRule(implies(not(or(p, not(p))), not(p)), implies(not(or(p, not(p))), not(not(p))), step18));
    const step20 = extract(negationEliminationRule(not(not(or(p, not(p)))), step19));

    isTrue(isValid(or(p, not(p)), step20));
}

function assertNotAcceptedNotClosedClojure() {
    const premises = emptyContext();

    const step1 = conditionalClosure(p, premises);
    isFalse(isValid(p, step1));
}

implicationIntroductionTest();
implicationEliminationAndIntroductionTest();
andEliminationTest();
orIntroductionTest();
orEliminationTest();
negationIntroductionTest();


exercise1();
exercise2();
implicationReversalExercise();
booleanExponentialExercise();
deMorganExercise();
excludedMiddleExercise();
assertNotAcceptedNotClosedClojure();

console.log("propositional passed!");
