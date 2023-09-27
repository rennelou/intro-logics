# shell.nix

with import <nixpkgs> {};

mkShell {
  packages = [
    agda
    nodejs
    nodePackages.pnpm
  ];
}
