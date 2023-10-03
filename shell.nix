# shell.nix

with import <nixpkgs> {};

mkShell {
  packages = [
    (agda.withPackages (ps: [
      ps.standard-library
    ]))
    tree-sitter
    lua51Packages.luautf8
    nodejs
    nodePackages.pnpm
    emacs
  ];
}
