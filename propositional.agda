postulate String : Set
{-# BUILTIN STRING String #-}

data Soundness (A : Set) : Set where
    sounds : Soundness A

data Falsity (A : Set) : Set where
    falses : Falsity A

data _×_ (A B : Set) : Set where
    _,_ : A -> B -> A × B
infixr 4 _,_

data _⊎_ (A B : Set) : Set where
    left : A → A ⊎ B
    right : B → A ⊎ B

fst : {A B : Set} → A × B -> A
fst (x , y) = x

snd : {A B : Set} → A × B -> B
snd (x , y) = y

negationElimination : {A : Set} → Falsity (Falsity A) → Soundness A
negationElimination _ = sounds 

negationIntroduction : {A B : Set} → (A → Soundness B) → (A → Falsity B) → Falsity A
negationIntroduction _ _ = falses

andIntroduction : {A B : Set} → Soundness A → Soundness B → Soundness (A × B)
andIntroduction _ _ = sounds

andElimination₁ : {A B : Set} → Soundness (A × B) -> Soundness A
andElimination₁ - = sounds

andElimination₂ : {A B : Set} → Soundness (A × B) -> Soundness B
andElimination₂ _ = sounds

orIntroduction₁ : {A B : Set} → Soundness A → Soundness (A ⊎ B)
orIntroduction₁ _ = sounds

orIntroduction₂ : {A B : Set} → Soundness A → Soundness (A ⊎ B)
orIntroduction₂ _ = sounds

orElimination : {A B C : Set} → (A → C) → (B → C) → Soundness (A ⊎ B) → Soundness C
orElimination _ _ _ = sounds



data P : Set where

data Q : Set where

data R : Set where


exercicio1 : (Soundness P → (Soundness Q → Soundness R)) → (Soundness P → Soundness Q) → (Soundness P → Soundness R)
exercicio1 f g = λ p → (f p) (g p)

obvio : Soundness (P × Q) → Soundness (Q ⊎ R)
obvio p = orIntroduction₁ (andElimination₂ p)

id : {X : Set} → X → X
id x = x

step11 : {X : Set} → Soundness X → Soundness (X ⊎ (Falsity X))
step11 x = orIntroduction₁ x

step1 : {X : Set} → Falsity (X ⊎ Falsity (X)) → Falsity X
step1 ~pOr~p = negationIntroduction ({! (λ x → orIntroduction₁ x) !}) (λ p → ~pOr~p)




excludedMiddle : {X : Set} → (Soundness X) ⊎ (Falsity X)
excludedMiddle = {!   !} 