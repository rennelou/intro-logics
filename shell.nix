# shell.nix

with import <nixpkgs> {};

mkShell {
  packages = [
    (agda.withPackages (ps: [
      ps.standard-library
    ]))
    nodejs
    nodePackages.pnpm
    emacs
  ];
}
