postulate String : Set
{-# BUILTIN STRING String #-}

data Soundness (A : Set) : Set where
    sounds : Soundness A

data Falsity (A : Set) : Set where
    falses : Falsity A

data _And_ (A B : Set) : Set where
    _,_ :  Soundness A ->  Soundness B -> A And B
infixr 4 _,_

andElimination₁ : {A B : Set} → A And B -> Soundness A
andElimination₁ (x , y) = x

andElimination₂ : {A B : Set} → A And B -> Soundness B
andElimination₂ (x , y) = y

data _Or_ (A B : Set) : Set where
    orIntroduction₁ : Soundness A → A Or B
    orIntroduction₂ : Soundness B → A Or B

orElimination : {A B C : Set} → (Soundness A → Soundness C) → (Soundness B → Soundness C) → A Or B → Soundness C
orElimination f g (orIntroduction₁ x) = f x
orElimination f g (orIntroduction₂ x) = g x

negationElimination : {A : Set} → Falsity (Falsity A) → Soundness A
negationElimination _ = sounds 

negationIntriduction : {A B : Set} → (A → Falsity B) → (A → Soundness B) → Falsity A
negationIntriduction _ _ = falses

exercicio1 : {P Q R : Set} → (Soundness P → (Soundness Q → Soundness R)) → (Soundness P → Soundness Q) → (Soundness P → Soundness R)
exercicio1 f g = λ p → (f p) (g p)

obvio : {P Q R : Set} → Soundness P And Soundness Q → Soundness Q Or Soundness R
obvio x = orIntroduction₁ (andElimination₂ x)

excludedMiddle : (P : Set) → Soundness P Or Falsity P
excludedMiddle p = {!   !}