
infix 4 _≡_
data _≡_ {a} {A : Set a} (x : A) : A → Set a where
  refl : x ≡ x
{-# BUILTIN EQUALITY _≡_  #-}

cong : ∀ {A B : Set} (f : A → B) {x y : A} → x ≡ y → f x ≡ f y
cong f refl  =  refl

data Bool : Set where
    false true : Bool
{-# BUILTIN BOOL Bool #-}
{-# BUILTIN TRUE true #-}
{-# BUILTIN FALSE false #-}

data Nat : Set where
    zero : Nat
    suc : Nat → Nat
{-# BUILTIN NATURAL Nat #-}

postulate String : Set
{-# BUILTIN STRING String #-}

primitive primStringEquality : String → String → Bool

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

primitive primEraseEquality : ∀ {a} {A : Set a} {x y : A} → x ≡ y → x ≡ y

primTrustMe : ∀ {a} {A : Set a} {x y : A} → x ≡ y
primTrustMe {x = x} {y} = primEraseEquality unsafePrimTrustMe
                            where postulate unsafePrimTrustMe : x ≡ y
  
------------

data Maybe (A : Set) : Set where
    nothing : Maybe A
    just    : A -> Maybe A

data _×_ (A B : Set) : Set where
    _,_ : A -> B -> A × B
infixr 4 _,_

proj₁ : {A B : Set} → A × B -> A
proj₁ (x , y) = x

proj₂ : {A B : Set} → A × B -> B
proj₂ (x , y) = y

data _⊎_ (A B : Set) : Set where
    inj₁ : A → A ⊎ B
    inj₂ : B → A ⊎ B

cases : {A B C : Set} → A ⊎ B → (A → C) → (B → C) → C
cases (inj₁ x) f g = f x
cases (inj₂ x) f g = g x

data Vec (A : Set) : Nat → Set where
    [] : Vec A 0
    _::_ : {n : Nat} → A → Vec A n → Vec A (suc n)
infixr 5 _::_

data _And_ {A B : Set} : A → B → Set where
    _&_ : (a : A) → (b : B) → a And b

data _Or_ {A B : Set} : A → B → Set where
    or₁ : {b : B} → (a : A) → a Or b
    or₂ : {a : A} → (b : B) → a Or b

data Implication {A B : Set} : A → B → Set where
    implication : (conditional : A) → (conclusion : B) → Implication conditional conclusion

data Proposition : String → Set where
    proposition : (s : String) → Proposition s

data Exp : Set where
    eSimple : {s : String} → (p : Proposition s) → Exp
    eNot : Exp → Exp
    eAnd : {e e₁ : Exp} → e And e₁ → Exp
    eOr  : {e e₁ : Exp} → e Or e₁ → Exp
    eImplication : {cond conc : Exp} → Implication cond conc → Exp

eqString : (a b : String) → Maybe (a ≡ b)
eqString a b = if primStringEquality a b
               then just primTrustMe
               else nothing

--testEqString : {a : String} → (eqString a a) ≡ (just (a ≡ a))
--testEqString = refl

propositionalEquals : {s₁ s₂ : String} → (a : Proposition s₁) → (b : Proposition s₂) → Bool
propositionalEquals (proposition s₁) (proposition s₂) = primStringEquality s₁ s₂

expEquals : Exp → Exp → Bool
expEquals (eSimple p) (eSimple p₁) = propositionalEquals p p₁
expEquals (eNot a) (eNot b) = expEquals a b
expEquals (eAnd (x & x₁)) (eAnd (x₂ & x₃)) = expEquals x x₂ && expEquals x₁ x₃
expEquals (eOr (or₁ x)) (eOr (or₁ x₁)) = expEquals x x₁
expEquals (eOr (or₂ x)) (eOr (or₂ x₁)) = expEquals x x₁
expEquals (eImplication (implication e x)) (eImplication (implication e₁ x₁)) = expEquals e e₁ && expEquals x x₁
expEquals _ _ = false

eqExp : (a b : Exp) → Maybe (a ≡ b)
eqExp a b = if expEquals a b
               then just primTrustMe
               else nothing

testPropositionalEquals : propositionalEquals (proposition "test") (proposition "test") ≡ true
testPropositionalEquals = refl

--testEqExp : {a : Exp} → (eqExp a a) ≡ just (a ≡ a)
--testEqExp = refl

implicationElimination : {conc : Exp} → (cond : Exp) → Implication cond conc → Exp
implicationElimination _ (implication x y) = y

andIntroduction : (a : Exp) → (b : Exp) → a And b
andIntroduction = _&_

andElimination₁ : {a b : Exp} → a And b → Exp
andElimination₁ (a & b) = a

andElimination₂ : {a b : Exp} → a And b → Exp
andElimination₂ (a & b) = b

orIntroduction₁ : {b : Exp} → (a : Exp) → a Or b
orIntroduction₁ = or₁

orIntroduction₂ : {a : Exp} → (b : Exp) → a Or b
orIntroduction₂ = or₂

orElimination : {a b c : Exp} → a Or b → Implication a c → Implication b c → Exp
orElimination {_} {_} {c} _ _ _ = c 