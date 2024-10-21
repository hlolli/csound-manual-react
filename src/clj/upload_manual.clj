(ns clj.upload-manual
  (:require [saxon :as xml]
            [clojure.data.json :as json]
            [clojure.java.io :as io]
            [clojure.string :as string]
            [firestore-clj.core :as f])
  (:import [org.apache.commons.text StringEscapeUtils]))

;; (def db (f/default-client "csound-ide"))
;; (def db (f/default-client "csound-ide-dev"))

;; (def manual-coll (f/coll db "manual"))

;; (println manual-coll)

;; (Process/exit 0)

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
  <!ENTITY nameeduardo \"Eduardo Moguillansky\">
  <!ENTITY namedave \"Dave Seidel\">"))

(defn delete-directory-recursive
  "Recursively delete a directory."
  [^java.io.File file]
  (when (.isDirectory file)
    (doseq [file-in-dir (.listFiles file)]
      (delete-directory-recursive file-in-dir)))
  (io/delete-file file))

(defn store-assets
  [^java.io.File from ^java.io.File to]
  (let [files-in-dir (.listFiles from)]
    (doseq [f files-in-dir]
      (when (and
             (.exists f)
             (.isFile f)
             (not (string/ends-with? (.getName f) ".csd")))
        (io/copy f (io/file to (.getName f)))))))

(defn remove-bom [dirty-string]
  (.replace dirty-string "\uFEFF" ""))

(defn quote-double-curlies [str]
  (-> str
      (string/replace "{{" "{`{{")
      (string/replace "}}" "}}`}")))

(defn xml-compiler [file]
  (xml/compile-xml
   (quote-double-curlies
    (remove-bom
     (str
      "<?xml version=\"1.0\"?>\n"
      "<!DOCTYPE refentry [\n"
      entities
      "\n]>\n"
      (slurp file))))))

(def remove-xmls
  #{"top.xml" "topXO.xml" "splitrig.txt"
    "LinkMetro.xml" "template.xml"})

(def xquery-jsx
  (xml/compile-xquery
   (slurp (io/file "xqueries/transformer.xqy"))))

(def xquery-id
  (xml/compile-xquery
   (slurp (io/file "xqueries/id.xqy"))))

(def xquery-opname
  (xml/compile-xquery
   (slurp (io/file "xqueries/opname.xqy"))))

(def xquery-synopsis
  (xml/compile-xquery
   (slurp (io/file "xqueries/synopsis.xqy"))))

(def xquery-short-desc
  (xml/compile-xquery
   (slurp (io/file "xqueries/short.xqy"))))

(defn clean-synopsis [synopsis]
  (let [;; ensure vec
        synopsis (if (string? synopsis)
                   [synopsis] (vec synopsis))]
    (->> synopsis
         (map #(.replace % "\n" ""))
         (map #(.replace % "\t" " "))
         (map #(.replace % "\\" ""))
         (map #(string/replace % #"\s+" " ")))))

(defn clean-short-desc [short-desc]
  (let [;; ensure vec
        short-desc (if (string? short-desc)
                     [short-desc] (vec short-desc))]
    (->> short-desc
         (map #(.replace % "\n" ""))
         (map #(.replace % "\t" " "))
         (map #(.replace % "\\" ""))
         (map #(.replace % "'" "\\'"))
         (map #(string/replace % #"\s+" " "))
         (string/join " ")
         string/trim)))

(defn remove-xml-comments [str]
  (string/replace str #"(?s)<!--.*?-->" ""))

(defn stringify-screens [str]
  (-> str
      (string/replace "<screen>" "<pre className=\"manual-screen\">{`")
      (string/replace "</screen>" "`}</pre>")))

(defn replace-quote-tags [str]
  (-> str
      (string/replace "<quote>" "“")
      (string/replace "</quote>" "”")))

(defn quote-curlues [str modulename]
  (if (or (= modulename "leftbrace") (= modulename "rightbrace"))
    (-> str
        (string/replace "<em>{" "<em>&#123;")
        (string/replace "</em>}" "</em>&#125;")
        (string/replace "{</em>" "&#123;</em>")
        (string/replace "{ statement" "&#123; statement")
        (string/replace "{ Statement" "&#123; Statement")
        (string/replace "{</span>" "&#123;</span>")
        (string/replace "} statement" "&#125; statement"))
    str))

(defn fix-pipes [str]
  (-> str
      (clojure.string/replace #"(?<!\|)(\|\|)(?![\|])" "|")
      (clojure.string/replace #"(?<!\|)(\|\|\|\|)(?![\|])" "||")))

(defn fix-csound-prop [str]
  (-> str
      (string/replace "Csound=\"{this.props.Csound}\"" "Csound={this.props.Csound}")
      (string/replace "\"{this.state.currentExample}\"" "{this.state.currentExample}")
      (string/replace "\"{this.props.theme}\"" "{this.props.theme}")
      (string/replace "\"{this.setCurrentExample}\"" "{this.setCurrentExample}")))

(def manual-main
  (slurp "resources/manual_main.jsx"))

(defn scoregens []
  (let []))

(defn -main [manual-path & args]

  (let [opcodes-dir (rest (file-seq (io/file (str manual-path "/opcodes"))))
        opcodes-dir (remove #(remove-xmls (.getName %)) opcodes-dir)
        parsed-xmls (map #(hash-map :parsed-xml
                                    (do (println "xml-compiling:" (.getName %))
                                        (xml-compiler %)) :file %
                                    :type :opcode) opcodes-dir)
        parsed-xmls (sort-by #(.getName (:file %)) (into [] parsed-xmls))
        scoregen-dir (rest (file-seq (io/file (str manual-path "/scoregens"))))
        scoregen-dir (remove #(remove-xmls (.getName %)) scoregen-dir)
        parsed-scoregen-xmls (map #(hash-map :parsed-xml
                                             (do (println "xml-compiling:" (.getName %))
                                                 (xml-compiler %)) :file %
                                             :type :scoregen) scoregen-dir)
        parsed-scoregen-xmls (sort-by #(.getName (:file %)) (into [] parsed-scoregen-xmls))
        out-dir (io/file "tmp")
        assets-dir (io/file "assets")]
    (when (.exists out-dir)
      (delete-directory-recursive out-dir))
    (when (.exists assets-dir)
      (delete-directory-recursive assets-dir))
    (.mkdirs out-dir)
    (.mkdirs assets-dir)
    (store-assets (io/file (str manual-path "/examples")) assets-dir)
    (loop [[{:keys [parsed-xml file type]} & rest]
           ;; (into (take 40 parsed-xmls)  parsed-scoregen-xmls)
           (into parsed-xmls parsed-scoregen-xmls)
           ;; (sort-by #(.getName (:file %)) (take 40 parsed-xmls))
           ;; index-js ""
           ;; synopsis-js ""
           ;; main-js ""
           static-json []
           ]
      (if-not rest
        (do
          (spit (.getPath (io/file out-dir "static-manual-index.json")) (json/write-str static-json))
          (println "DONE")
          )
        (let [filename (.replace (.getName file) ".xml" ".jsx")
              modulename (.replace (.getName file) ".xml" "")
              opname (xquery-opname parsed-xml)
              opname (if (= :scoregen type)
                       (-> opname
                           fix-pipes
                           (string/replace " statement" "")
                           (string/replace "function table" "f")
                           (string/replace "advance" "a")
                           (string/replace "tempo" "t")
                           (string/replace "repeat" "r")
                           (string/replace "mark" "m")
                           (string/replace "denote" "d")
                           (string/replace "note" "i"))
                       opname)
              id (xquery-id parsed-xml)
              synopsis (clean-synopsis (xquery-synopsis parsed-xml))
              short-desc (clean-short-desc (xquery-short-desc parsed-xml))
              ;; main-entry (format "{name: '%s', url: '/manual/%s', short: '%s', type: '%s'},\n" opname modulename short-desc (name type))
              ]
              ;; synopsis-entry (str "\"" opname "\": {synopsis: " (json/write-str synopsis) ", id: " "'" id "'" ", type: " "'" (name type) "'"  "},")]
          (println id)
          ;; (f/set! (f/doc manual-coll id)
          ;;         {"html"        (-> parsed-xml
          ;;                            xquery-jsx
          ;;                            remove-xml-comments
          ;;                            stringify-screens
          ;;                            replace-quote-tags
          ;;                            fix-pipes
          ;;                            (quote-curlues modulename)
          ;;                            fix-csound-prop
          ;;                          )
          ;;          })

          (recur rest
                 (conj static-json { "id" id "short_desc" short-desc "synopsis" synopsis "type" type "opname" opname })
                 ;; (str synopsis-js "\n" synopsis-entry)
                 ;; (str main-js main-entry)
                 )
          )))))
