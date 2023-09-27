
data Nat : Set where
    zero : Nat
    suc  : Nat → Nat
{-# BUILTIN NATURAL Nat #-}

_+_ : Nat → Nat → Nat
zero    + y = y
(suc x) + y = suc (x + y)

halve : Nat → Nat
halve zero = zero
halve (suc zero) = zero
halve (suc (suc n)) = suc (halve n)

_*_ : Nat → Nat → Nat
a * zero = zero
a * suc b = a + (a * b)

data Bool : Set where
    true  : Bool
    false : Bool

not : Bool → Bool
not true = false
not false = true

_&&_ : Bool → Bool → Bool
true && true = true
_    && _    = false

_||_ : Bool → Bool → Bool
false || false = false
_     || _     = true

id₁ : {A : Set} → A → A
id₁ x = x

data List (A : Set) : Set where
    []   : List A
    _::_ : A -> List A -> List A

length : {A : Set} → List A → Nat
length [] = zero
length (x :: list) = suc (length list)

_++_ : {A : Set} → List A → List A → List A
l ++ [] = l
l ++ (x :: m) = (x :: l) ++ m

map : {A B : Set} → (A → B) → List A → List B
map f [] = []
map f (x :: l) = (f x) :: map f l

data Maybe (A : Set) : Set where
    nothing : Maybe A
    just : A -> Maybe A

lookup : {A : Set} → List A → Nat → Maybe A
lookup [] _ = nothing
lookup (x :: l) zero = just x
lookup (x :: l) (suc n) = lookup l n

data _×_ (A B : Set) : Set where
    _,_ : A -> B -> A × B
infixr 4 _,_

fst : {A B : Set} → A × B -> A
fst (x , y) = x

snd : {A B : Set} → A × B -> B
snd (x , y) = y

data Σ (A : Set) (B : A → Set) : Set where
    _,_ : (x : A) → B x → Σ A B

_×'_ : (A : Set) → (B : Set) → Set
A ×' B = Σ A (λ _ → B)

fstΣ : {A : Set} {B : A → Set} → Σ A B → A
fstΣ (x , y) = x

sndΣ : {A : Set} {B : A → Set} → (z : Σ A B) → B (fstΣ z)
sndΣ (x , y) = y 

convert : {A : Set} {B : Set} → A × B -> A ×' B
convert (x , y) = (x , y)

convert' : {A : Set} {B : Set} → A ×' B → A × B
convert' (x , y) = (x , y)

data Vec (A : Set) : Nat → Set where
    [] : Vec A 0
    _::_ : {n : Nat} → A → Vec A n → Vec A (suc n)
infixr 5 _::_

List' : (A : Set) → Set
List' A = Σ Nat (Vec A)

[]' : {A : Set} → List' A
[]' = (0 , [])

_::'_ : {A : Set} → A → List' A → List' A
a ::' (x , x₁) = (suc x , a :: x₁)

convertList : {A : Set} → List A → List' A
convertList [] = []'
convertList (x :: l) = x ::' (convertList l)

convertVec : {n : Nat} {A : Set} → Vec A n → List A
convertVec [] = []
convertVec (x :: v) = x :: (convertVec v)

convertList' : {A : Set} → List' A → List A
convertList' (.0 , []) = []
convertList' (.(suc _) , x :: x₁) = x :: (convertVec x₁)

data _⊎_ (A B : Set) : Set where
    left : A → A ⊎ B
    right : B → A ⊎ B

orElimination : {A B C : Set} → (A → C) → (B → C) → A ⊎ B → C
orElimination f g (left x) = f x
orElimination f g (right x) = g x

data ⊤ : Set where
    tt : ⊤

data ⊥ : Set where