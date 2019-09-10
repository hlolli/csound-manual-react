(ns clj.build-manual
  (:require [saxon :as xml]
            [clojure.java.io :as io]
            [clojure.string :as string]))

(def entities
  (str
   ;; Symbols
   "<!ENTITY ccedil \"ç\">
    <!ENTITY shy \"-\">
    <!ENTITY num \"#\">
    <!ENTITY tilde \"~\">
    <!ENTITY plusmn \"±\">
    <!ENTITY eacute \"é\">
    <!ENTITY le \"≤\">
    <!ENTITY circ \"^\">
    <!ENTITY nbsp \"\">
    <!ENTITY verbar \"||\">
    <!ENTITY dollar \"$\">
    <!ENTITY plus \"+\">
    <!ENTITY ast \"*\">
    <!ENTITY sol \"/\">
    <!ENTITY minus \"-\">
    <!ENTITY percnt \"&#37;\">
    <!ENTITY pi \"π\">
    <!ENTITY lambda \"λ\">
    <!ENTITY auml \"ä\">
    <!ENTITY beta \"β\">
"
   "\n"
   ;; Authors
   "<!ENTITY namebarry \"Barry L. Vercoe\">
  <!ENTITY namedavid \"David M. Boothe\">
  <!ENTITY namegabriel \"Gabriel Maldonado\">
  <!ENTITY namehans \"Hans Mikelson\">
  <!ENTITY nameistvan \"Istvan Varga\">
  <!ENTITY namejohn \"John ffitch\">
  <!ENTITY namekanata \"Kanata Motohashi\">
  <!ENTITY namekevin \"Kevin Conder\">
  <!ENTITY nameluis \"Luis Jure\">
  <!ENTITY namematt \"Matt Ingalls\">
  <!ENTITY nameoeyvind \"Oyvind Brandtsegg\">
  <!ENTITY namemichael \"Michael Gogins\">
  <!ENTITY namemike \"Mike Berry\">
  <!ENTITY nameparis \"Paris Smaragdis\">
  <!ENTITY nameperry \"Perry Cook\">
  <!ENTITY namerasmus \"Rasmus Ekman\">
  <!ENTITY namerichard \"Richard Dobson\">
  <!ENTITY namesean \"Sean Costello\">
  <!ENTITY namesteven \"Steven Yi\">
  <!ENTITY nameandres \"Andr&eacute;s Cabrera\">
  <!ENTITY nameanthony \"Anthony Kozar\">
  <!ENTITY namepinot \"Fran&ccedil;ois Pinot\">
  <!ENTITY namevictor \"Victor Lazzarini\">
  <!ENTITY namepeter \"Peter Brinkmann\">
  <!ENTITY nametito \"Tito Latini\">
  <!ENTITY namepaul \"Paul Batchelor\">
  <!ENTITY nameeduardo \"Eduardo Moguillansky\">"))

(defn remove-bom [dirty-string]
  (.replace dirty-string "\uFEFF" ""))

(defn xml-compiler [file]
  (xml/compile-xml
   (remove-bom
    (str
     "<?xml version=\"1.0\"?>\n"
     "<!DOCTYPE refentry [\n"
     entities
     "\n]>\n"
     (slurp file)))))

(def remove-xmls
  #{"top.xml" "topXO.xml" "splitrig.txt"
    "LinkMetro.xml"})

(def index-js-prefix "export default {")
(def index-js-suffix "}")

(def xquery-jsx
  (xml/compile-xquery
   (slurp (io/file "xqueries/transformer.xqy"))))

(def xquery-synopsis
  (xml/compile-xquery
   (slurp (io/file "xqueries/synopsis.xqy"))))

(defn clean-synopsis [synopsis]
  (let [;; ensure vec
        synopsis (if (string? synopsis)
                   [synopsis] (vec synopsis))]
    (->> synopsis
         (map #(.replace % "\n" ""))
         (map #(.replace % "\t" " "))
         (map #(.replace % "\\" ""))
         (map #(string/replace % #"\s+" " ")))))

(defn -main [& args]
  (let [opcodes-dir (rest (file-seq (io/file "manual/opcodes")))
        opcodes-dir (remove #(remove-xmls (.getName %)) opcodes-dir)
        parsed-xmls (map #(hash-map :parsed-xml
                                    (do (println "xml-compiling:" (.getName %))
                                        (xml-compiler %)) :file %) opcodes-dir)
        out-dir (io/file "tmp")]
    (loop [[{:keys [parsed-xml file]} & rest] parsed-xmls
           index-js ""]
      (when rest
        (let [filename (.replace (.getName file) ".xml" ".jsx")]
          (prn (clean-synopsis (xquery-synopsis parsed-xml)))
          (spit (.getPath (io/file out-dir filename))
                (xquery-jsx parsed-xml))
          (recur rest
                 index-js))))))
