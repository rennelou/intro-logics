# shell.nix

with import <nixpkgs> {};
let 
  build-packages = [
    # Comentado pra acelerar o build do shell
    #(agda.withPackages (ps: [
    #  ps.standard-library
    #]))
    
    # pacotes necessarios para as extensões do neovim funcionarem
    # porem é necessario o paq que não vem como um pacote nix
    tree-sitter
    lua51Packages.luautf8
    # -----------------------------
    
    nodejs
    nodePackages.pnpm
    nodePackages.eslint
    nodePackages.typescript
    nodePackages.typescript-language-server
    #comentado pra acelerar o build do shell
    #emacs
  ];

  android-packages =
    let android-nixpkgs = callPackage (import (builtins.fetchGit {
      url = "https://github.com/tadfisher/android-nixpkgs.git";
    })) {
      # Default; can also choose "beta", "preview", or "canary".
      channel = "stable";
    };
    in
    android-nixpkgs.sdk (sdkPkgs: with sdkPkgs; [
      cmdline-tools-latest
      build-tools-31-0-0
      platform-tools
      platforms-android-31
      emulator
    ]);

  # comentei as ferramentas android porque acho que com expo não precisa
  packages-shell = build-packages; # ++ (lib.toList android-packages);
  
  in
  mkShell { packages = packages-shell; }
