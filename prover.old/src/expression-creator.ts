import {Expression, Proposition} from './propositional';

export {proposition, not, and, or, implies} from './propositional';

export type ExpressionBuilder = {
  propositions: Proposition[],
  auxiliarExpressions: Expression[],
}

export function addAuxiliarExpression (b: ExpressionBuilder): (e: Expression) => ExpressionBuilder {
  return (e: Expression) => {
    b.auxiliarExpressions.push(e);
    return b;
  }
}

export function getAuxiliarExpression (b: ExpressionBuilder): (i: number) => Expression | Error {
  return (i: number) => {
    if (i < 0) {
      throw Error("vai tomar no cu");
    }

    return b.auxiliarExpressions[i];
  }
}

export function getProposition(e: ExpressionBuilder): (i: number) => Proposition | Error {
  return (i: number) => {
    if (i < 0) {
      throw Error("vai tomar no cu");
    }
  
    return e.propositions[i];
  }
}

console.log("expression-creator compiled but has no tests!");
