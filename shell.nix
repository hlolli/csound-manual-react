# A script for converting csound-manual to react
# java -cp $SAXON_JAR net.sf.saxon.Query -s:"./text.xml" -q:"transformer.xqy" -o:"result.js" && cat result.js
with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "csound-manual-to-react";
  src = pkgs.fetchFromGitHub {
    owner = "csound";
    repo = "manual";
    rev = "70ae6ceb3a7d002ceaa2d737f95adf2c4e46d1de";
    sha256 = "00gc6szc7pc6xp9nkkvw6wkky6qd67x7aabcsjkhnxz4agibn3gq";
  };

  buildInputs = with pkgs; [ saxon-he clojure ];
  shellHook = ''
    export SAXON_JAR=${ saxon-he }/share/java/saxon9he.jar
    clojure -Sverbose -Scp $(clojure -Spath):${ saxon-he }/share/java/saxon9he.jar -M -m clj.build-manual $src || exit 1
    exit 0
  '';
}
