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

export function extract<T>(result: T | Error): T {
  if (result instanceof Error) {
    throw result;
  } else {
    return result;
  }
}

export function fmap<A, B>(f: (a: A) => B): (ma: A | Error) => B | Error {
  return (ma: A | Error) => {
    if (ma instanceof Error) {
      return ma;
    } else {
      return f(ma);
    }
  }
} 
