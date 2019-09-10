# A script for converting csound-manual to react
# java -cp $SAXON_JAR net.sf.saxon.Query -s:"./text.xml" -q:"transformer.xqy" -o:"result.js" && cat result.js
with import <nixpkgs> {};

let transformer = ./transformer.xqy;
    builder = ./build.clj;
in stdenv.mkDerivation {
  name = "csound-manual-to-react";

  src = pkgs.fetchFromGitHub {
    owner = "csound";
    repo = "manual";
    rev = "777b29e476c57fdb685d1423e6c909fb9239d2a7";
    sha256 = "12n11fngdfclh4wvfzz9dpmlgjyc04nwajhjqgqlxlj0797rpdpb";
  };

  buildInputs = with pkgs; [ saxon-he clojure ];
  shellHook = ''
    export SAXON_JAR=${ saxon-he }/share/java/saxon9he.jar
  '';
  buildPhase = ''
    pwd
    mkdir ./build
    echo 666
    clojure -Scp ${ saxon-he }/share/java/saxon9he.jar -m ${builder} $src
  '';
  installPhase = ''
    mkdir -p $out/lib
    cp $src/build/* $out/lib
  '';
}
