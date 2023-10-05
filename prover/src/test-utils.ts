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

function isError<T>(mt: T | Error): mt is Error {
  return (mt as Error) !== undefined;
}

export function fmap<A, B>(f: (a: A) => B): (ma: A | Error) => B | Error {
  return (ma: A | Error) => {
    if (isError(ma)) {
      return ma;
    } else {
      return f(ma);
    }
  }
} 
