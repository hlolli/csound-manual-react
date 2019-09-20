xquery version "1.0";
declare namespace saxon="http://saxon.sf.net/";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";
declare namespace functx = "http://www.functx.com";
declare namespace xi="http://www.w3.org/2001/XInclude";
import module namespace f = "https://www.github.com/hlolli" at "./xqueries/functions.xqy";
declare option saxon:output "method=text";


declare function functx:if-empty
  ( $arg as item()? ,
    $value as item()* )  as item()* {

  if (string($arg) != '')
  then data($arg)
  else $value
 } ;

declare function functx:change-element-names-deep
  ( $nodes as node()* ,
    $oldNames as xs:QName* ,
    $newNames as xs:QName* )  as node()* {

  if (count($oldNames) != count($newNames))
  then error(xs:QName('functx:Different_number_of_names'))
  else
   for $node in $nodes
   return if ($node instance of element())
          then element
                 {functx:if-empty
                    ($newNames[index-of($oldNames,
                                           node-name($node))],
                     node-name($node)) }
                 {$node/@*,
                  functx:change-element-names-deep($node/node(),
                                           $oldNames, $newNames)}
          else if ($node instance of document-node())
          then functx:change-element-names-deep($node/node(),
                                           $oldNames, $newNames)
          else $node
 };

let $n := "&#10;"
let $title := //refentrytitle
let $id := /refentry/@id
let $purpose := //refpurpose
(:
 : let $synopsis := //synopsis
 :)

let $refsects :=
  for $refsect in //refsect1
  let $p := for $para in $refsect/para
    (: transform the elements :)
    let $paratr1 := functx:change-element-names-deep($para,
       xs:QName('para'), xs:QName('div'))
    let $paratr2 := functx:change-element-names-deep($paratr1,
       xs:QName('emphasis'), xs:QName('em'))
    (: insert included examples :)
    let $paratr3 := f:include-example($paratr2)
    let $paratr4 := f:change-links($paratr3)
    let $paratr5 := f:change-programlisting($paratr4)
    let $paratr6 := f:change-informalexample($paratr5)
    let $paratr7 := f:change-ulinks($paratr6)
    let $paratr8 := f:change-example($paratr7)
    let $paratr9 := f:change-member($paratr8)
    let $paratr10 := f:change-simplelist($paratr9)
    let $paratr11 := f:change-itemizedlist($paratr10)
    let $paratr12 := f:change-orderedlist($paratr11)
    let $paratr13 := f:change-listitem($paratr12)
    let $paratr14 := f:change-command($paratr13)
    let $paratr15 := f:change-title($paratr14)
    let $paratr16 := f:change-synopsis($paratr15)
    let $paratr17 := f:change-literallayout($paratr16)
    let $paratr18 := f:change-imagedata($paratr17)
    let $paratr19 := f:change-textobject($paratr18)
    let $paratr20 := f:change-phrase($paratr19)
    let $paratr21 := f:change-caption($paratr20)
    let $paratr22 := f:change-mediaobject($paratr21)
    let $paratr23 := f:change-imageobject($paratr22)
    let $paratr24 := f:change-informaltable($paratr23)
    let $paratr25 := f:change-tgroup($paratr24)
    let $paratr26 := f:change-row($paratr25)
    let $paratr27 := f:change-entry($paratr26)
    let $paratr28 := f:change-subscript($paratr27)
    let $paratr29 := f:change-superscript($paratr28)

    return <div className="manual-para">{$paratr29}</div>
  let $s := for $synop in $refsect/synopsis
    let $synoptr1 := f:change-command($synop)
    let $synoptr2 := f:change-synopsis($synoptr1)
    return <div className="manual-synopsis-container">{$synoptr2}</div>
  return
  <div className="manual-refsect1">
   <h1>{string($refsect/title[1])}</h1>
   {$s}
   {$p}
  </div>

let $jsx :=
  <div>
    <div id="title">
      <h1>{$title/string()}</h1>
    </div>
    <div id="purpose">
      <p>{$purpose/string()}</p>
    </div>
    {$refsects}
  </div>

return string(
'import React from "react";' || $n ||
'import { Link, withRouter } from "react-router-dom";'  || $n ||
'import ManualEditor from "./manual_editor.jsx";' || $n ||
"import unescape from 'unescape';" || $n ||
$n ||
"class " || $id || "Class" || " extends React.Component {" || $n ||
" componentDidMount () { document.scrollingElement.scrollTop = 0; }" || $n ||
" render () {" || $n ||
"  return ( " || fn:serialize($jsx) || ");" || $n ||
"  }" || $n ||
"}" || $n ||
(:
 : "export default " || $id || "Class;"
 :)
"export default withRouter(" || $id || "Class" || ");"
)
