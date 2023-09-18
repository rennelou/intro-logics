
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

data Maybe (A : Set) : Set where
    nothing : Maybe A
    just    : A -> Maybe A

_+_ : Nat → Nat → Nat
zero    + y = y
(suc x) + y = suc (x + y)

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

data Not {A : Set} : A → Set where
    not : (a : A) → Not a

data _And_ {A B : Set} : A → B → Set where
    _&_ : (a : A) → (b : B) → a And b

data _Or_ {A B : Set} : A → B → Set where
    or₁ : {b : B} → (a : A) → a Or b
    or₂ : {a : A} → (b : B) → a Or b

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
orIntroduction₁ = or₁

orIntroduction₂ : {A B : Set} {a : A} → (b : B) → a Or b
orIntroduction₂ = or₂

orElimination : {A B C : Set} {a : A} {b : B} {c : C} → a Or b → If a Then c → If b Then c → C
orElimination {_} {_} {_} {_} {_} {c} _ _ _ = c

negationIntroduction : {A B : Set} {a : A} {b : B} → If a Then b → If a Then (not b) → Not a
negationIntroduction {_} {_} {a} {_} f g = not a

negationElimination : {A : Set} {a : A} → Not (not a) → A
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
expEquals (eNot (not a)) (eNot (not b)) = expEquals a b
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

andIntroduction' : Exp → Exp → Exp
andIntroduction' a b = eAnd (andIntroduction a b)

andElimination₁' : Exp → Maybe Exp
andElimination₁' (eAnd e) = just (andElimination₁ e)
andElimination₁' _ = nothing

andElimination₂' : Exp → Maybe Exp
andElimination₂' (eAnd e) = just (andElimination₂ e)
andElimination₂' _ = nothing

orIntroduction_with₁ : Exp → Exp → Exp
orIntroduction_with₁ e implict = eOr {e} {implict} (orIntroduction₁ e)

orIntroduction_with₂ : Exp → Exp → Exp
orIntroduction_with₂ e implict = eOr {implict} {e} (orIntroduction₂ e)

negationElimination' : Exp → Maybe Exp
negationElimination' (eNot (not (eNot (not x)))) = just (negationElimination (not (not x)))
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
    if expEquals a a₁ && expEquals (eNot (not b)) b₁
    then just (eNot (negationIntroduction (implication a b) (implication a (not b))))
    else nothing
negationIntroduction' _ _ = nothing

-----------------

data _⊎_ (A B : Set) : Set where
    inj₁ : A → A ⊎ B
    inj₂ : B → A ⊎ B

data Vec (A : Set) : Nat → Set where
    [] : Vec A 0
    _::_ : {n : Nat} → A → Vec A n → Vec A (suc n)
infixr 5 _::_

data Fin : Nat → Set where
  zero : {n : Nat} → Fin (suc n)
  suc  : {n : Nat} → Fin n → Fin (suc n)

lookupVec : {A : Set} {n : Nat} → Vec A n → Fin n → A
lookupVec (x :: xs) zero = x
lookupVec (x :: xs) (suc i) = lookupVec xs i

data Operation : Nat → Set where
    ie : {n : Nat} → Fin n → Fin n → Operation n
    aiOp : {n : Nat} → Fin n → Fin n → Operation n
    aeOp₁ : {n : Nat} → Fin n → Operation n
    aeOp₂ : {n : Nat} → Fin n → Operation n
    oiOp₁ : {n : Nat} → Fin n → (e : Exp) → Operation n
    oiOp₂ : {n : Nat} → Fin n → (e : Exp) → Operation n
    oeOp : {n : Nat} → Fin n → Fin n → Fin n → Operation n
    ni : {n : Nat} → Fin n →  Fin n → Operation n
    ne : {n : Nat} → Fin n → Operation n

maybeAppend : {n : Nat} {A : Set} → Maybe A → Vec A n → (Vec A n) ⊎ (Vec A (suc n))
maybeAppend nothing vec = inj₁ vec
maybeAppend (just x) vec = inj₂ (x :: vec) 

exec : {n : Nat} → Vec Exp n → Operation n → (Vec Exp n) ⊎ (Vec Exp (suc n))
exec vec (ie i i₁) = maybeAppend (implicationElimination' (lookupVec vec i) (lookupVec vec i₁)) vec
exec vec (aiOp i i₁) = inj₂ ( (andIntroduction' (lookupVec vec i) (lookupVec vec i₁)) :: vec )
exec vec (aeOp₁ i) = maybeAppend (andElimination₁' (lookupVec vec i)) vec
exec vec (aeOp₂ i) = maybeAppend (andElimination₂' (lookupVec vec i)) vec
exec vec (oiOp₁ i e) = inj₂ ( (orIntroduction (lookupVec vec i) with₁ e ) :: vec )
exec vec (oiOp₂ i e) = inj₂ ( (orIntroduction (lookupVec vec i) with₂ e ) :: vec )
exec vec (oeOp i i₁ i₂) = maybeAppend (orElimination' (lookupVec vec i) (lookupVec vec i₁) (lookupVec vec i₂) ) vec
exec vec (ni i i₁) = maybeAppend (negationIntroduction' (lookupVec vec i) (lookupVec vec i₁)) vec 
exec vec (ne i) = maybeAppend (negationElimination' (lookupVec vec i)) vec

