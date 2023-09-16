postulate String : Set
{-# BUILTIN STRING String #-}

data Soundness (A : Set) : Set where
    sounds : Soundness A

data Falsity (A : Set) : Set where
    falses : Falsity A

negationElimination : {A : Set} → Falsity (Falsity A) → Soundness A
negationElimination _ = sounds 

negationIntroduction : {A B : Set} → (A → Soundness B) → (A → Falsity B) → Falsity A
negationIntroduction _ _ = falses


data _And_ (A B : Set) : Set where
    _&_ :  A -> B -> A And B
infixr 4 _&_

andElimination₁ : {A B : Set} → A And B -> A
andElimination₁ (x & y) = x

andElimination₂ : {A B : Set} → A And B -> B
andElimination₂ (x & y) = y

data _Or_ (A B : Set) : Set where
    orIntroduction₁ : A → A Or B
    orIntroduction₂ : B → A Or B

orElimination : {A B C : Set} → (A → C) → (B → C) → A Or B → C
orElimination f g (orIntroduction₁ x) = f x
orElimination f g (orIntroduction₂ x) = g x



data P : Set where

data Q : Set where

data R : Set where


exercicio1 : (Soundness P → (Soundness Q → Soundness R)) → (Soundness P → Soundness Q) → (Soundness P → Soundness R)
exercicio1 f g = λ p → (f p) (g p)

obvio : Soundness P And Soundness Q → Soundness Q Or Soundness R
obvio p = orIntroduction₁ (andElimination₂ p)

id : {X : Set} → X → X
id x = x

step11 : {X : Set} → Soundness X → Soundness (X Or (Falsity X))
step11 x = {!   !}

step1 : {X : Set} → Falsity (X Or Falsity (X)) → Falsity X
step1 ~pOr~p = negationIntroduction ({!   !}) (λ p → ~pOr~p)




excludedMiddle : {X : Set} → Soundness X Or Falsity X
excludedMiddle = {!   !} 