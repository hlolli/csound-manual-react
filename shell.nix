# A script for converting csound-manual to react
# java -cp $SAXON_JAR net.sf.saxon.Query -s:"./text.xml" -q:"transformer.xqy" -o:"result.js" && cat result.js
with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "csound-manual-to-react";
  src = pkgs.fetchFromGitHub {
    owner = "hlolli";
    repo = "manual";
    rev = "96b56e3516a5f1a9a70a9ec1f3b179680aa52ef5";
    sha256 = "sha256-whEQa97qrjZgq7MIleyeyHpUF6xAQAdHejzMXtkwEO0=";
  };

  buildInputs = with pkgs; [ saxon-he clojure ];
  shellHook = ''
    export SAXON_JAR=${ saxon-he }/share/java/saxon9he.jar
    clojure -Sverbose -Scp $(clojure -Spath):${ saxon-he }/share/java/saxon9he.jar -M -m clj.upload-manual $src || exit 1
    exit 0
  '';
}
