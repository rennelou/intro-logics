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


