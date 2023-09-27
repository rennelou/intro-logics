
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

function elem(e: Expression, c: Context): boolean {

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
    if (elem(e, c)) {

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

function implicationElimination(condition: Expression, imp: Implication, c: Context): Context | Error {
    if (elem(condition, c) && elem(imp, c)) {
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
    if (elem(e1, c) && elem(e2, c)) {
        return commitValid(and(e1, e2), c);
    } else {
        return Error("Some given expression is not valid in the context");
    }
}

function andEliminationLeftRule(a: And, c: Context): Context | Error {
    if (elem(a, c)) {
        return commitValid(a.exp1, c);
    } else {
        return Error("The given expression is not valid in the context");
    }
}

function andEliminationRightRule(a: And, c: Context): Context | Error {
    if (elem(a, c)) {
        return commitValid(a.exp2, c);
    } else {
        return Error("The given expression is not valid in the context");
    }
}

function orIntroductionLeftRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (elem(e1, c)) {
        return commitValid(or(e1, e2), c);
    } else {
        return Error("The respective left expression is not valid in the context");
    }
}

function orIntroductionRightRule(e1: Expression, e2: Expression, c: Context): Context | Error {
    if (elem(e2, c)) {
        return commitValid(or(e1, e2), c);
    } else {
        return Error("The respective right expression is not valid in the context");
    }
}

function orEliminationRule(o: Or, imp1: Implication, imp2: Implication, c: Context): Context | Error {
    if (elem(o, c) && elem(imp1, c) && elem(imp2, c)) {
        if (isEqual(o.exp1, imp1.exp1) && isEqual(o.exp2, imp2.exp1) && isEqual(imp1.exp2, imp2.exp2)) {
            return commitValid(imp1.exp2, c);
        } else {
            return Error("The given expressions are not compatibles");
        }

    } else {
        return Error("Some given expression is not valid in the context");
    }
}

// ------------------------------

// Teste

const p = proposition("p");
const q = proposition("q");
const r = proposition("r");

const contextTest = commitValid(p, conditionalClosure(q, emptyContext()));

function test() {
    const result = implicationIntroductionRule(p, contextTest);

    if (result instanceof Error) {
        throw result;
    } else {

        if (!elem(implies(q, p), result)) {
            throw new Error("Test fail");
        }
    }
}

const contextTest1 = commitValid(p, commitValid(implies(p, q), emptyContext()));

function test1() {
    const result = implicationElimination(p, implies(p, q), contextTest1);

    if (result instanceof Error) {
        throw result;
    } else {
        if (!elem(q, result)) {
            throw new Error("Test fail");
        }

        const result1 = andIntroductionRule(p, q, result);

        if (result1 instanceof Error) {
            throw result1;
        } else {
            if (!elem(and(p, q), result1)) {
                throw Error("and Test fail");
            }
        }
    }
}

const andEliminationTestContext = commitValid(and(p, q), emptyContext());

function testAndElimination() {
    const result1 = andEliminationLeftRule(and(p, q), andEliminationTestContext);
    const result2 = andEliminationRightRule(and(p, q), andEliminationTestContext);

    if (result1 instanceof Error) {
        throw result1;
    } else {

        if (!elem(p, result1)) {
            throw new Error("Test fail");
        }
    }

    if (result2 instanceof Error) {
        throw result2;
    } else {

        if (!elem(q, result2)) {
            throw new Error("Test fail");
        }
    }
}

const orIntroductionTestContext = commitValid(p, emptyContext());

function testOrIntroduction() {
    const result1 = orIntroductionLeftRule(p, q, orIntroductionTestContext);
    const result2 = orIntroductionRightRule(r, p, orIntroductionTestContext);

    if (result1 instanceof Error) {
        throw result1;
    } else {
        if (!elem(or(p, q), result1)) {
            throw Error("or left introduction fail")
        }
    }

    if (result2 instanceof Error) {
        throw result2;
    } else {
        if (!elem(or(r, p), result2)) {
            throw Error("or right introduction fail")
        }
    }
}

const orEliminationTestContext = commitValid(or(p, q), commitValid(implies(p, r), commitValid(implies(q, r), emptyContext())));

function testOrElimination() {
    const result = orEliminationRule(or(p, q), implies(p, r), implies(q, r), orEliminationTestContext);

    if (result instanceof Error) {
        throw result;
    } else {

        if (!elem(r, result)) {
            throw new Error("Test fail");
        }
    }
}

const s: string = "Pass!";
test();
test1();
testAndElimination();
testOrIntroduction();
testOrElimination();
console.log(s);