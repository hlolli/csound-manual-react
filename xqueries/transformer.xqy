xquery version "1.0";
declare namespace saxon="http://saxon.sf.net/";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";
declare option saxon:output "method=text";


let $n := "&#10;"
let $title := //refentrytitle
let $id := /refentry/@id
let $purpose := //refpurpose

(:
 : let $all := fn:string-join(//*/(concat(name(.), ' > ')))
 :)

let $jsx :=
  <div>
    <div id="title">
      <h1>{$title/string()}</h1>
    </div>
    <div id="purpose">
      <p>{$purpose/string()}</p>
    </div>

  </div>

return string(
"import React from 'react';" || $n ||
$n ||
"function " || $id || "()" || "{" || $n ||
"  return" || fn:serialize($jsx) || ";" || $n ||
"}" || $n ||
"export default " || $id || ";"
)
