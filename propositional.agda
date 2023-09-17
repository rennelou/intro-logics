postulate String : Set
{-# BUILTIN STRING String #-}

data ⊤ : Set where
    tt : ⊤

data ⊥ : Set where

data _×_ (A B : Set) : Set where
    _,_ : A -> B -> A × B
infixr 4 _,_

fst : {A B : Set} → A × B -> A
fst (x , y) = x

snd : {A B : Set} → A × B -> B
snd (x , y) = y

data _⊎_ (A B : Set) : Set where
    left : A → A ⊎ B
    right : B → A ⊎ B

cases : {A B C : Set} → A ⊎ B → (A → C) → (B → C) → C
cases (left x) f g = f x
cases (right x) f g = g x

negationIntroduction : {A B : Set} → (A → B) → (A → (B → ⊥)) → (A → ⊥)
negationIntroduction f g = λ a → (g a) (f a)

data P : Set where

data Q : Set where

data R : Set where


exercicio1 : (P → (Q → R)) → (P → Q) → (P → R)
exercicio1 f g = λ p → (f p) (g p)

obvio : P × Q → Q ⊎ R
obvio p = left (snd p)

excludedMiddle : {P : Set} → (P ⊎ (P → ⊥) → ⊥) → ⊥
excludedMiddle f = f (fst {!   !})