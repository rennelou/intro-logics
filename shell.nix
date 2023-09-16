# shell.nix

with import <nixpkgs> {};

mkShell {
    name = "intro-logics-env";
    packages = [
    	haskellPackages.Agda
    ];
}