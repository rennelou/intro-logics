open import Relation.Binary.PropositionalEquality using (_≡_; refl; cong)
open import Data.Maybe using (Maybe; just; nothing; map; _>>=_)
open import Agda.Builtin.Bool using (Bool; true; false)
open import Agda.Builtin.String using (String; primStringEquality)
open import Data.Nat using (ℕ; zero; suc; _+_; _<_)
open import Data.Fin using (Fin; zero; suc; fromℕ<″; fromℕ; fromℕ<)
open import Data.Vec using (Vec; []; _∷_; lookup)
open import Data.List using (List; []; _∷_)
open import Data.Product using (_×_; _,_)

open import Relation.Nullary
open import Relation.Nullary.Decidable
open import Relation.Binary.Core

module Propositional where

    private
        _&&_ : Bool → Bool → Bool
        true && true = true
        _    && _    = false

        if_then_else : {A : Set} → Bool → A → A → A
        if true then a else b  = a
        if false then a else b = b

        assertIfThenElse₁ : {A : Set} → (a b : A) → if true then a else b ≡ a
        assertIfThenElse₁ _ _ = refl

        assertIfThenElse₂ : {A : Set} → (a b : A) → if false then a else b ≡ b
        assertIfThenElse₂ _ _ = refl

        ------------

        data Not {A : Set} : A → Set where
            notCreation : (a : A) → Not a

        data _And_ {A B : Set} : A → B → Set where
            _&_ : (a : A) → (b : B) → a And b

        data _Or_ {A B : Set} : A → B → Set where
            orCreation₁ : {b : B} → (a : A) → a Or b
            orCreation₂ : {a : A} → (b : B) → a Or b

        data If_Then_ {A B : Set} : A → B → Set where
            implication : (conditional : A) → (conclusion : B) → If conditional Then conclusion

        implicationElimination : {A B : Set} {e₁ : B} → (e : A) → If e Then e₁ → B
        implicationElimination _ (implication _ e₁) = e₁

        andIntroduction : {A B : Set} → (a : A) → (b : B) → a And b
        andIntroduction = _&_

        andElimination₁ : {A B : Set} {a : A} {b : B} → a And b → A
        andElimination₁ (a & _) = a

        andElimination₂ : {A B : Set} {a : A} {b : B} → a And b → B
        andElimination₂ (_ & b) = b

        orIntroduction₁ : {A B : Set} {b : B} → (a : A) → a Or b
        orIntroduction₁ = orCreation₁

        orIntroduction₂ : {A B : Set} {a : A} → (b : B) → a Or b
        orIntroduction₂ = orCreation₂

        orElimination : {A B C : Set} {a : A} {b : B} {c : C} → a Or b → If a Then c → If b Then c → C
        orElimination {_} {_} {_} {_} {_} {c} _ _ _ = c

        negationIntroduction : {A B : Set} {a : A} {b : B} → If a Then b → If a Then (notCreation b) → Not a
        negationIntroduction {_} {_} {a} {_} f g = notCreation a

        negationElimination : {A : Set} {a : A} → Not (notCreation a) → A
        negationElimination {_} {a} _ = a

        ------------------------------------------

        data Proposition : String → Set where
            proposition : (s : String) → Proposition s

        data Exp : Set where
            eSimple : {s : String} → (p : Proposition s) → Exp
            eNot : {e : Exp} → Not e → Exp
            eAnd : {e e₁ : Exp} → e And e₁ → Exp
            eOr  : {e e₁ : Exp} → e Or e₁ → Exp
            eImplication : {e e₁ : Exp} → If e Then e₁ → Exp

        propositionalEquals : {s₁ s₂ : String} → (a : Proposition s₁) → (b : Proposition s₂) → Bool
        propositionalEquals (proposition s₁) (proposition s₂) = primStringEquality s₁ s₂

        expEquals : Exp → Exp → Bool
        expEquals (eSimple p) (eSimple p₁) = propositionalEquals p p₁
        expEquals (eNot (notCreation a)) (eNot (notCreation b)) = expEquals a b
        expEquals (eAnd (x & x₁)) (eAnd (x₂ & x₃)) = expEquals x x₂ && expEquals x₁ x₃
        expEquals (eOr (orCreation₁ x)) (eOr (orCreation₁ x₁)) = expEquals x x₁
        expEquals (eOr (orCreation₂ x)) (eOr (orCreation₂ x₁)) = expEquals x x₁
        expEquals (eImplication (implication e x)) (eImplication (implication e₁ x₁)) = expEquals e e₁ && expEquals x x₁
        expEquals _ _ = false


        testPropositionalEquals : propositionalEquals (proposition "test") (proposition "test") ≡ true
        testPropositionalEquals = refl


        andIntroduction' : Exp → Exp → Exp
        andIntroduction' a b = eAnd (andIntroduction a b)

        andElimination₁' : Exp → Maybe Exp
        andElimination₁' (eAnd e) = just (andElimination₁ e)
        andElimination₁' _ = nothing

        andElimination₂' : Exp → Maybe Exp
        andElimination₂' (eAnd e) = just (andElimination₂ e)
        andElimination₂' _ = nothing

        -- esta ocorrendo algo zuado, como eu tenho sempre as expressões a ideia de or esta checando o left ou right
        -- no nivel de qual expressão é valida no context. apos isso eu so preciso do orIntroduction_with₁. Ta zuado a tipagem desse
        -- codigo

        orIntroduction_with₁ : Exp → Exp → Exp
        orIntroduction_with₁ e implict = eOr {e} {implict} (orIntroduction₁ e)

        negationElimination' : Exp → Maybe Exp
        negationElimination' (eNot (notCreation (eNot (notCreation x)))) = just (negationElimination (notCreation (notCreation x)))
        negationElimination' _ = nothing

        ----- ver se melhora usando identity types e substituição no lugar de recriar os objetos

        implicationElimination' : Exp → Exp → Maybe Exp
        implicationElimination' e (eImplication (implication cond conc)) =
            if expEquals e cond 
            then just (implicationElimination cond (implication cond conc))
            else nothing
        implicationElimination' _ _ = nothing

        orElimination' : Exp → Exp → Exp → Maybe Exp
        orElimination' (eOr {a} {b} o) (eImplication {a₁} {r} _) (eImplication {b₁} {r₁} _) = 
            if (expEquals a a₁ && expEquals b b₁) && expEquals r r₁ 
            then just (orElimination o (implication a r) (implication b r))
            else nothing
        orElimination' _ _ _ = nothing

        negationIntroduction' : Exp → Exp → Maybe Exp
        negationIntroduction' (eImplication {a} {b} x) (eImplication {a₁} {b₁} x₁) =
            if expEquals a a₁ && expEquals (eNot (notCreation b)) b₁
            then just (eNot (negationIntroduction (implication a b) (implication a (notCreation b))))
            else nothing
        negationIntroduction' _ _ = nothing

        -----------------

    data Context : Set where
        empty : Context
        openConditionalClosure : Exp → Context → Context
        commitValid : Exp → Context → Context
    
        
    commit : Maybe Exp → Context → Maybe Context
    commit m c = Data.Maybe.map (λ x → commitValid x c) m
    
    contextElem : Exp → Context → Bool
    contextElem e empty = false
    contextElem e (commitValid x c) = if (expEquals e x) then true else (contextElem e c)
    contextElem e (openConditionalClosure x c) = if (expEquals e x) then true else (contextElem e c)
    
    implicationIntroduction : Exp → Context → Maybe Context
    implicationIntroduction e empty = nothing
    implicationIntroduction e (openConditionalClosure x c) = just (commitValid (eImplication (implication x e)) c)
    implicationIntroduction e (commitValid x c) = implicationIntroduction e c
    
    ----
    
    implicationIntroductionRule : Exp → Context → Maybe Context
    implicationIntroductionRule e c =
        if (contextElem e c)
        then implicationIntroduction e c
        else nothing
    
    implicationEliminationRule : Exp → Exp → Context → Maybe Context
    implicationEliminationRule e e₁ c =
        if (contextElem e c) && (contextElem e₁ c)
        then commit (implicationElimination' e e₁) c
        else nothing
    
    andIntroductionRule : Exp → Exp → Context → Maybe Context
    andIntroductionRule a b c =
        if (contextElem a c) && (contextElem b c)
        then just (commitValid (eAnd (andIntroduction a b)) c)
        else nothing
    
    andEliminationRule₁ : Exp → Context → Maybe Context
    andEliminationRule₁ e c = 
        if (contextElem e c)
        then commit (andElimination₁' e) c
        else nothing
    
    andEliminationRule₂ : Exp → Context → Maybe Context
    andEliminationRule₂ e c =
        if (contextElem e c)
        then commit (andElimination₂' e) c
        else nothing
    
    orIntroductionRule₁ : Exp → Exp → Context → Maybe Context
    orIntroductionRule₁ e e₁ c =
        if (contextElem e c)
        then just (commitValid (orIntroduction e with₁ e₁) c)
        else nothing
    
    orIntroductionRule₂ : Exp → Exp → Context → Maybe Context
    orIntroductionRule₂ e e₁ c =
        if (contextElem e₁ c)
        then just (commitValid (orIntroduction e with₁ e₁) c)
        else nothing
    
    orEliminationRule : Exp → Exp → Exp → Context → Maybe Context
    orEliminationRule e e₁ e₂ c =
        if ((contextElem e c) && (contextElem e₁ c)) && (contextElem e₂ c)
        then commit (orElimination' e e₁ e₂) c
        else nothing
    
    negationIntroductionRule : Exp → Exp → Context → Maybe Context
    negationIntroductionRule e e₁ c =
        if (contextElem e c) && (contextElem e₁ c)
        then commit (negationIntroduction' e e₁) c
        else nothing
    
    negationEliminationRule : Exp → Context → Maybe Context
    negationEliminationRule e c =
        if (contextElem e c)
        then commit (negationElimination' e) c
        else nothing
    
    -------
    
    createProposition : String → Exp
    createProposition s = eSimple (proposition s)

    _append_ : Exp → Context → Context
    _append_ = commitValid
    infixr 10 _append_
    
    _implies_ : Exp → Exp → Exp
    a implies b = eImplication (implication a b)
    
    _and_ : Exp → Exp → Exp
    _and_ = andIntroduction'
    
    _or_ : Exp → Exp → Exp
    _or_ = orIntroduction_with₁
    
    not : Exp → Exp
    not e = eNot (notCreation e)
    

-- Exercicios

    private
        p : Exp
        p = eSimple (proposition "p")
        
        q : Exp
        q = eSimple (proposition "q")
        
        r : Exp
        r = eSimple (proposition "r")
        
        m : Exp
        m = eSimple (proposition "m")
        
        exercicio1Premises : Context
        exercicio1Premises =
            p append (p implies (q implies r)) append (p implies q) append empty
        
        exercitio1 :
            ( do
                passo1 ← implicationEliminationRule p (p implies q) exercicio1Premises
                passo2 ← implicationEliminationRule p (p implies (q implies r)) passo1
                passo3 ← implicationEliminationRule q (q implies r) passo2
                just (contextElem r passo3)
            ) ≡ just true
        exercitio1 = refl
        
        exercicio2Premises : Context
        exercicio2Premises = 
            (p implies q) append (m implies (orIntroduction p with₁ q)) append empty
        
        exercicio2 :
            ( do
                let step1 = openConditionalClosure q exercicio2Premises
                step2 ← implicationIntroductionRule q step1
                let step3 = openConditionalClosure m step2
                step4 ← implicationEliminationRule m (m implies (p or q)) step3
                step5 ← orEliminationRule (p or q) (p implies q) (q implies q) step4
                step6 ← implicationIntroductionRule q step5
                just (contextElem (m implies q) step6)
            ) ≡ just true
        exercicio2 = refl
        
        implicationCreationExercise :
            ( do
                let step1 = openConditionalClosure p empty
                let step2 = openConditionalClosure q step1
                step3 ← implicationIntroductionRule p step2
                step4 ← implicationIntroductionRule (q implies p) step3
                just (contextElem (p implies (q implies p)) step4)
            ) ≡ just true
        implicationCreationExercise = refl
        
        
        implicationReversalPremises : Context
        implicationReversalPremises = (p implies q) append empty
        
        implicationReversalExercise :
            ( do
                let step1 = openConditionalClosure (not q) implicationReversalPremises
                let step2 = openConditionalClosure p step1
                step3 ← implicationIntroductionRule (not q) step2
                step4 ← negationIntroductionRule (p implies q) (p implies (not q)) step3
                step5 ← implicationIntroductionRule (not p) step4
                just (contextElem ((not q) implies (not p)) step5)
            ) ≡ just true
        implicationReversalExercise = refl
        
        functionTypeToBooleanPremises : Context
        functionTypeToBooleanPremises = (p implies q) append empty
        
        functionTypeToBooleanExercise :
            ( do
                let step1 = openConditionalClosure (not (not p or q)) functionTypeToBooleanPremises
                let step2 = openConditionalClosure p step1
                step3 ← implicationEliminationRule p (p implies q) step2
                step4 ← orIntroductionRule₂ (not p) q step3
                step5 ← implicationIntroductionRule ((not p) or q) step4
                let step6 = openConditionalClosure p step5
                step7 ← implicationIntroductionRule (not (not p or q)) step6
                step8 ← negationIntroductionRule (p implies (not p or q)) (p implies (not (not p or q))) step7
                step9 ← implicationIntroductionRule (not p) step8
                let step10 = openConditionalClosure (not (not p or q)) step9
                let step11 = openConditionalClosure (not p) step10
                step12 ← orIntroductionRule₁ (not p) q step11
                step13 ← implicationIntroductionRule ((not p) or q) step12
                let step14 = openConditionalClosure (not p) step13
                step15 ← implicationIntroductionRule (not (not p or q)) step14
                step16 ← negationIntroductionRule (not p implies (not p or q)) (not p implies (not (not p or q))) step15
                step17 ← implicationIntroductionRule (not (not p)) step16
                step18 ← negationIntroductionRule ((not (not p or q)) implies not p) ((not (not p or q)) implies (not (not p))) step17
                step19 ← negationEliminationRule (not (not (not p or q))) step18
                just (contextElem (not p or q) step19)
            ) ≡ just true
        functionTypeToBooleanExercise = refl
        
        deMorganPremise : Context
        deMorganPremise = (not (p or q)) append empty
        
        deMorganExercise :
            ( do
                let step1 = openConditionalClosure p deMorganPremise
                step2 ← orIntroductionRule₁ p q step1
                step3 ← implicationIntroductionRule (p or q) step2
                let step4 = openConditionalClosure p step3
                step5 ← implicationIntroductionRule (not (p or q)) step4
                step6 ← negationIntroductionRule (p implies (p or q)) (p implies (not (p or q))) step5
                let step7 = openConditionalClosure q step6
                step8 ← orIntroductionRule₂ p q step7
                step9 ← implicationIntroductionRule (p or q) step8
                let step10 = openConditionalClosure q step9
                step11 ← implicationIntroductionRule (not (p or q))  step10
                step12 ← negationIntroductionRule (q implies (p or q)) (q implies (not (p or q))) step11
                step13 ← andIntroductionRule (not p) (not q) step12
                just (contextElem (not p and not q) step13)
            ) ≡ just true
        deMorganExercise = refl
        
        exculdedMiddleExercise :
            ( do
                let step1 = openConditionalClosure p empty
                step2 ← implicationIntroductionRule p step1
                let step3 = openConditionalClosure (not (p or not p)) step2
                let step4 = openConditionalClosure p step3
                step5 ← orIntroductionRule₁ p (not p) step4
                step6 ← implicationIntroductionRule (p or not p) step5
                let step7 = openConditionalClosure p step6
                step8 ← implicationIntroductionRule (not (p or not p)) step7
                step9 ← negationIntroductionRule (p implies (p or not p)) (p implies (not (p or not p))) step8
                step10 ← implicationIntroductionRule (not p) step9
                let step11 = openConditionalClosure (not (p or not p)) step10
                let step12 = openConditionalClosure (not p) step11
                step13 ← orIntroductionRule₂ p (not p) step12
                step14 ← implicationIntroductionRule (p or not p) step13
                let step15 = openConditionalClosure (not p) step14
                step16 ← implicationIntroductionRule (not (p or not p)) step15
                step17 ← negationIntroductionRule (not p implies (p or not p)) (not p implies (not (p or not p))) step16
                step18 ← implicationIntroductionRule (not (not p)) step17
                step19 ← negationIntroductionRule ((not (p or not p)) implies not p) ((not (p or not p)) implies (not (not p))) step18
                step20 ← negationEliminationRule (not (not (p or not p))) step19
                just (contextElem (p or not p) step20)
        
            ) ≡ just true
        exculdedMiddleExercise = refl
        