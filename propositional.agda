postulate String : Set
{-# BUILTIN STRING String #-}

data Bool : Set where
    true  : Bool
    false : Bool

_&&_ : Bool → Bool → Bool
true && true = true
_    && _    = false

_||_ : Bool → Bool → Bool
false || false = false
_     || _     = true

data Nat : Set where
    zero : Nat
    suc  : Nat → Nat
{-# BUILTIN NATURAL Nat #-}

_+_ : Nat → Nat → Nat
zero    + y = y
(suc x) + y = suc (x + y)

data Vec (A : Set) : Nat → Set where
    [] : Vec A 0
    _::_ : {n : Nat} → A → Vec A n → Vec A (suc n)
infixr 5 _::_

data Maybe (A : Set) : Set where
    nothing : Maybe A
    just    : A -> Maybe A

data Proposition : String → Set where
    proposition : (s : String) → Proposition s

data Compose : Set where
    simple : {s : String} → (p : Proposition s) → Compose
    not : Compose → Compose
    andIntroduction : Compose → Compose → Compose
    orIntroduction₁ : Compose → Compose
    orIntroduction₂ : Compose → Compose
    implication : Compose → Compose → Compose

if_then_else_ : {A : Set} → Bool → A → A → A
if true then x else y = x
if false then x else y = y

composeEquals : Compose → Compose → Bool
composeEquals p₁ p₂ = {!   !}

implicationElimination : (p : Compose) → Compose → Maybe Compose
implicationElimination a (implication b c) = if composeEquals a b then just c else nothing
implicationElimination _ _ = nothing

andElimination₁ : Compose → Maybe Compose
andElimination₁ (andIntroduction x y) = just x
andElimination₁ _ = nothing

andElimination₂ : Compose → Maybe Compose
andElimination₂ (andIntroduction x y) = just y
andElimination₂ _ = nothing

orElimination : Compose → Compose → Compose → Maybe Compose
orElimination (orIntroduction₁ p) f g = implicationElimination p f
orElimination (orIntroduction₂ p) f g = implicationElimination p g
orElimination _ _ _ = nothing

negationIntroduction : Compose → Compose → Maybe Compose
negationIntroduction (implication f f₁) (implication g (not g₁)) = if (composeEquals f g) && (composeEquals f₁ g₁) then just (not f) else nothing
negationIntroduction _ _ = nothing

negationElimination : Compose → Maybe Compose
negationElimination (not (not p)) = just p
negationElimination _ = nothing
