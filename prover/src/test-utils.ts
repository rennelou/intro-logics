export function isTrue(b: boolean) {
  if (!b) {
    throw new Error("Expecting true but received false");
  }
}

export function isFalse(b: boolean) {
  if (b) {
    throw new Error("Expecting false but received true");
  }
}

export function fmap<A, B>(f: (a: A) => B): (ma: A | Error) => B | Error {
  return (ma: A) => {
    if (typeof ma === "")
  }
} 
