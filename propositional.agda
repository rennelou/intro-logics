open import Relation.Binary.PropositionalEquality using (_≡_; refl; cong)
open import Data.Maybe using (Maybe; just; nothing; _>>=_)
open import Agda.Builtin.Bool using (Bool; true; false)
open import Agda.Builtin.String using (String; primStringEquality)
open import Data.Nat using (ℕ; zero; suc; _+_; _<_)
open import Data.Fin using (Fin; zero; suc; fromℕ<″; fromℕ; fromℕ<)
open import Data.Vec using (Vec; []; _∷_; lookup)

open import Relation.Nullary
open import Relation.Nullary.Decidable
open import Relation.Binary.Core

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

lookupVec : {A : Set} {n : ℕ} → Vec A n → Fin n → A
lookupVec (x ∷ xs) zero = x
lookupVec (x ∷ xs) (suc i) = lookupVec xs i

data Operation : ℕ → Set where
    ie : {n : ℕ} → Fin n → Fin n → Operation n
    aiOp : {n : ℕ} → Fin n → Fin n → Operation n
    aeOp₁ : {n : ℕ} → Fin n → Operation n
    aeOp₂ : {n : ℕ} → Fin n → Operation n
    oiOp₁ : {n : ℕ} → Fin n → (e : Exp) → Operation n
    oiOp₂ : {n : ℕ} → Fin n → (e : Exp) → Operation n
    oeOp : {n : ℕ} → Fin n → Fin n → Fin n → Operation n
    ni : {n : ℕ} → Fin n →  Fin n → Operation n
    ne : {n : ℕ} → Fin n → Operation n

maybeAppend : {n : ℕ} {A : Set} → Maybe A → Vec A n → Maybe (Vec A (suc n))
maybeAppend nothing vec = nothing
maybeAppend (just x) vec = just (x ∷ vec) 

exec : {n : ℕ} → Vec Exp n → Operation n → Maybe (Vec Exp (suc n))
exec vec (ie i i₁) = maybeAppend (implicationElimination' (lookupVec vec i) (lookupVec vec i₁)) vec
exec vec (aiOp i i₁) = just ( (andIntroduction' (lookupVec vec i) (lookupVec vec i₁)) ∷ vec )
exec vec (aeOp₁ i) = maybeAppend (andElimination₁' (lookupVec vec i)) vec
exec vec (aeOp₂ i) = maybeAppend (andElimination₂' (lookupVec vec i)) vec
exec vec (oiOp₁ i e) = just ( (orIntroduction (lookupVec vec i) with₁ e ) ∷ vec )
exec vec (oiOp₂ i e) = just ( (orIntroduction (lookupVec vec i) with₂ e ) ∷ vec )
exec vec (oeOp i i₁ i₂) = maybeAppend (orElimination' (lookupVec vec i) (lookupVec vec i₁) (lookupVec vec i₂) ) vec
exec vec (ni i i₁) = maybeAppend (negationIntroduction' (lookupVec vec i) (lookupVec vec i₁)) vec 
exec vec (ne i) = maybeAppend (negationElimination' (lookupVec vec i)) vec

p : Exp
p = eSimple (proposition "p")

q : Exp
q = eSimple (proposition "q")

r : Exp
r = eSimple (proposition "r")

inital : Vec Exp 3
inital = p ∷ eImplication( implication p (eImplication (implication q r))) ∷ eImplication (implication p q) ∷ []

exercitio1 :
    ( do
        passo1 ← exec inital (ie (fromℕ< {0} (0 < 3)) (fromℕ< {2} _))
        passo2 ← exec passo1 (ie (fromℕ< {1} _) (fromℕ< {2} _))
        passo3 ← exec passo2 (ie (fromℕ< {1} _) (fromℕ< {0} _))
        just (lookup passo3 (fromℕ< {0} _) ) 
    ) ≡ just r
exercitio1 = refl


-- agora é colocar assumption
 