(ns clj.build-manual
  (:require [saxon :as xml]
            [clojure.data.json :as json]
            [clojure.java.io :as io]
            [clojure.string :as string])
  (:import [org.apache.commons.text StringEscapeUtils]))

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

(def loading-spinner
  "From: https://loading.io/css/"
  "<div style={{height: '100vh', width: '100vw', display: 'flex', justifyContent: 'space-around', alignContents: 'center'}}><style>{`.lds-ring {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  }
  .lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
  }
  @keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
  }
  `}</style>
  <div className='lds-ring'><div></div><div></div><div></div><div></div></div></div>")

(def index-js-prefix
  (str "import React, { Component, Suspense, lazy } from 'react';\n"
       "import { Redirect } from 'react-router';"
       "import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';\n"
       "import Styles from './styles.jsx';\n"
       (format "const loadingSpinner = %s;\n" loading-spinner)
       "class ManualIndex extends Component {
             constructor(props) {
               super(props);
               this.routerRef = React.createRef();
               this.handleIframeMessage = this.handleIframeMessage.bind(this);
           }
          shouldComponentUpdate(nextProps, nextState) {
             if ((Object.entries(nextProps).length === 0) && !nextState) {
               return false;
             } else {
               return true;
             }
          }
          handleIframeMessage(data) {
            let history;
            try {
              history = this.routerRef.current.history;
            } catch (e) {}
           if ((typeof data.data === 'string') && (data.data.length > 0) && history) {
             history.push('/manual/' + data.data);
           }
          }
          componentWillUnmount() { window.removeEventListener('message', this.handleIframeMessage); }
          componentDidMount() { window.addEventListener('message', this.handleIframeMessage); }
          render() {
            const CodeMirrorPainter = this.props.codeMirrorPainter || <></>;
            return (
             <div className='manual-wrapper'>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 17}} className='manual-header'>
                <a onClick={() => this.routerRef.current.history.goBack()}>Back</a>
                <a onClick={() => this.routerRef.current.history.push('/manual/main')}>Home</a>
                <a onClick={() => this.routerRef.current.history.goForward()}>Forward</a>
              </div>
              <hr />
              <Router ref={this.routerRef}>
                <Styles theme={this.props.theme} />
                <CodeMirrorPainter theme={this.props.theme} />
                "
       "<Suspense fallback={loadingSpinner}>"
       "
       <Switch>"
       ))

(def index-js-suffix
  (str "    <Route path='/manual/main' component={React.lazy(() => import(/* webpackChunkName: 'main' */'./main.jsx'))} />
        <Route path='/manual' exact component={React.lazy(() => import( /* webpackChunkName: 'main' */'./main.jsx'))} />
        <Route component={() => <h1>404 not found</h1>} />
       </Switch>
       </Suspense>
       </Router>
       </div>
       );
  }
}\n"
       "export default ManualIndex;"))

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
           index-js ""
           synopsis-js ""
           main-js ""]
      (if-not rest
        (do (spit (io/file out-dir "index.jsx")
                  (str index-js-prefix
                       index-js
                       index-js-suffix))
            (spit (io/file out-dir "synopsis.jsx")
                  (str "export default {\n"
                       synopsis-js
                       "\n }"))
            (spit (io/file out-dir "main.jsx")
                  (format manual-main main-js))
            (io/copy (io/file "resources/styles.jsx")
                     (io/file out-dir "styles.jsx"))
            (io/copy (io/file "resources/manual_editor.jsx")
                     (io/file out-dir "manual_editor.jsx")))
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
              index-entry (str (format "<Route path='/manual/%s' component={%s} />\n"
                                       ;; (StringEscapeUtils/escapeHtml4 opname)
                                       (if (#{"*" "/"} opname) modulename opname)
                                       (str "() => {
                                                const LazyComp = React.lazy(() =>
                                                  import( /* webpackChunkName: '" modulename "' */'./" filename "'));
                                                return (<LazyComp Csound={this.props.Csound} theme={this.props.theme} />);
                                              }"
                                            ))
                               (when (and (not= id opname) (not= "/" opname))
                                 ;; (prn id opname)
                                 (format "<Route path='/manual/%s' component={%s} />\n"
                                         id
                                         (str "() => {
                                                const LazyComp = React.lazy(() =>
                                                  import( /* webpackChunkName: '" modulename "' */'./" filename "'));
                                                return (<LazyComp Csound={this.props.Csound} theme={this.props.theme} />);
                                               }"))))
              main-entry (format "{name: '%s', url: '/manual/%s', short: '%s', type: '%s'},\n" opname modulename short-desc (name type))
              synopsis-entry (str "\"" opname "\": {synopsis: " (json/write-str synopsis) ", id: " "'" id "'" ", type: " "'" (name type) "'"  "},")]
          (spit (.getPath (io/file out-dir filename))
                (-> parsed-xml
                    xquery-jsx
                    remove-xml-comments
                    stringify-screens
                    replace-quote-tags
                    fix-pipes
                    (quote-curlues modulename)
                    fix-csound-prop
                    ;; (quote-double-curlies modulename)
                    ;; simple-unescape
                    ;; StringEscapeUtils/unescapeHtml4
                    ))
          (recur rest
                 (str index-js "\n" index-entry)
                 (str synopsis-js "\n" synopsis-entry)
                 (str main-js main-entry)))))))
