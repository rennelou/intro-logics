
import isEqual from 'lodash.isequal';

// Parte sintatica

type Proposition = {
    tag: "proposition",
    value: string
};

type Negation = {
    tag: "negation",
    exp: Expression
}

type And = {
    tag: "and",
    exp1: Expression,
    exp2: Expression
}

type Or = {
    tag: "or",
    exp1: Expression,
    exp2: Expression
}

type Implication = {
    tag: "implication",
    exp1: Expression,
    exp2: Expression
}

type Expression =
    | Proposition
    | Negation
    | And
    | Or
    | Implication

function proposition(s: string): Proposition {
    return {
        tag: "proposition",
        value: s
    }
}

function not(e: Expression): Negation {
    return {
        tag: "negation",
        exp: e
    }
}

function and(e1: Expression, e2: Expression): And {
    return {
        tag: "and",
        exp1: e1,
        exp2: e2
    }
}

function or(e1: Expression, e2: Expression): Or {
    return {
        tag: "or",
        exp1: e1,
        exp2: e2
    }
}

function implies(e1: Expression, e2: Expression): Implication {
    return {
        tag: "implication",
        exp1: e1,
        exp2: e2
    }
}

function expressionMatch<T>(
    f1: (p: Proposition) => T,
    f2: (n: Negation) => T,
    f3: (a: And) => T,
    f4: (o: Or) => T,
    f5: (i: Implication) => T
): (e: Expression) => T {
    return (e: Expression) => {
        switch (e.tag) {
            case "proposition":
                return f1(e);
            case "negation":
                return f2(e);
            case "and":
                return f3(e);
            case "or":
                return f4(e);
            case "implication":
                return f5(e);
            default:
                throw new Error("Error pattern matching Expression type");
        }
    };
}

// ---------------------------------------------

// Parte das regras de inferência (equivalente à semântica)

type EmptyContext = {
    tag: "emptyContext"
};

type ConditionalClosure = {
    tag: "conditionalClosure",
    assumption: Expression,
    context: Context
};

type CommitValid = {
    tag: "commitValid",
    expression: Expression,
    context: Context
};

type Context =
    | EmptyContext
    | ConditionalClosure
    | CommitValid

function emptyContext(): EmptyContext {
    return { tag: "emptyContext" };
}

function conditionalClosure(e: Expression, c: Context): ConditionalClosure {
    return {
        tag: "conditionalClosure",
        assumption: e,
        context: c
    }
}

function commitValid(e: Expression, c: Context): CommitValid {
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

function isValid(e: Expression, c: Context): boolean {

    const _elem: (c: Context) => boolean =
        contextMatch(
            (_: EmptyContext) => { return false },
            (cc: ConditionalClosure) => {
                if (isEqual(cc.assumption, e)) {
                    return true;
                } else {
                    return _elem(cc.context);
                }
            },
            (cv: CommitValid) => {
                if (isEqual(cv.expression, e)) {
                    return true;
                } else {
                    return _elem(cv.context);
                }
            }
        );

    return _elem(c);
}

function implicationIntroductionRule(e: Expression, c: Context): Context | Error {
    if (isValid(e, c)) {

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

function implicationEliminationRule(condition: Expression, imp: Implication, c: Context): Context | Error {
    if (isValid(condition, c) && isValid(imp, c)) {
        if (isEqual(condition, imp.exp1)) {
            return commitValid(imp.exp2, c);
        } else {
            return Error("Invalid use of implicationElimination rule");
        }
    } else {
        return Error("Some given expression is not valid in the context");
    }
}

function andIntroductionRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (isValid(e1, c) && isValid(e2, c)) {
        return commitValid(and(e1, e2), c);
    } else {
        return Error("Some given expression is not valid in the context");
    }
}

function andEliminationLeftRule(a: And, c: Context): Context | Error {
    if (isValid(a, c)) {
        return commitValid(a.exp1, c);
    } else {
        return Error("The given expression is not valid in the context");
    }
}

function andEliminationRightRule(a: And, c: Context): Context | Error {
    if (isValid(a, c)) {
        return commitValid(a.exp2, c);
    } else {
        return Error("The given expression is not valid in the context");
    }
}

function orIntroductionLeftRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (isValid(e1, c)) {
        return commitValid(or(e1, e2), c);
    } else {
        return Error("The respective left expression is not valid in the context");
    }
}

function orIntroductionRightRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (isValid(e2, c)) {
        return commitValid(or(e1, e2), c);
    } else {
        return Error("The respective right expression is not valid in the context");
    }
}

function orEliminationRule(o: Or, imp1: Implication, imp2: Implication, c: Context): Context | Error {
    if (isValid(o, c) && isValid(imp1, c) && isValid(imp2, c)) {
        if (isEqual(o.exp1, imp1.exp1) && isEqual(o.exp2, imp2.exp1) && isEqual(imp1.exp2, imp2.exp2)) {
            return commitValid(imp1.exp2, c);
        } else {
            return Error("Invalid use of or elimination rule");
        }

    } else {
        return Error("Some given expression is not valid in the context");
    }
}

function negationIntroductionRule(imp1: Implication, imp2: Implication, c: Context): Context | Error {
    if (isValid(imp1, c) && isValid(imp2, c)) {
        if (isEqual(imp1.exp1, imp2.exp1) && isEqual(not(imp1.exp2), imp2.exp2)) {
            return commitValid(not(imp1.exp1), c);
        } else {
            return Error("Invalid use of negation introduction rule");
        }
    } else {
        return Error("Some given expression is not valid in the context");
    }
}

function negationEliminationRule(n: Negation, c: Context): Context | Error {
    if (isValid(n, c)) {
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

function isTrue(b: boolean) {
    if (!b) {
        throw Error("Expect true");
    }
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

const s: string = "Pass!";
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

console.log(s);