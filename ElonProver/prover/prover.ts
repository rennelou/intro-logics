import {Expression, Proposition, Context,  isValid} from './propositional';

export {
  implicationIntroductionRule,
  implicationEliminationRule,
  andIntroductionRule,
  andEliminationLeftRule,
  andEliminationRightRule,
  orIntroductionLeftRule,
  orIntroductionRightRule,
  orEliminationRule,
  negationIntroductionRule,
  negationEliminationRule
} from './propositional';

export type Prover = {
  goal: Expression,
  propositions : Proposition [],
  context : Context
}

export function commit(p: Prover, c: Context | Error): Prover | Error {
  if (c instanceof Error) {
    return c;
  } else {
    p.context = c;
    return p;
  }
}

export function goalReached(p: Prover): boolean {
  return isValid(p.goal, p.context)
}
