# shell.nix

with import <nixpkgs> {};

mkShell {
  packages = [
    (agda.withPackages (ps: [
      ps.standard-library
    ]))
    
    # pacotes necessarios para as extensões do neovim funcionarem
    # porem é necessario o paq que não vem como um pacote nix
    tree-sitter
    lua51Packages.luautf8
    # -----------------------------
    
    nodejs
    nodePackages.pnpm
    emacs
  ];
}
