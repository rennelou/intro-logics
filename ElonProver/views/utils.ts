import { Proposition, Expression, Negation, And, Or, Implication, expressionMatch } from '../prover/propositional';

export function propositionPrint(p: Proposition): string {
  return p.value;  
}

export const expressionPrint: (e: Expression) => string =
  expressionMatch(
    propositionPrint,
    (n: Negation) => { return "not " + expressionPrint(n.exp); },
    (a: And) => { return expressionPrint(a.exp1) + " and " + expressionPrint(a.exp2); },
    (o: Or) =>  { return expressionPrint(o.exp1) + " or " + expressionPrint(o.exp2); },
    (imp: Implication) => { return "if " + expressionPrint(imp.conditional) + " then " + expressionPrint(imp.conclusion); }
  );


