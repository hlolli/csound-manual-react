xquery version "1.0";
declare namespace saxon="http://saxon.sf.net/";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";
declare namespace functx = "http://www.functx.com";
declare namespace xi="http://www.w3.org/2001/XInclude";
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

declare function local:change-links
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('link')
  let $newName := xs:QName('Link')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"to"} {concat("/manual/", $node/@linkend)}
                      else $node/@*,
                  if (node-name($node) = $oldName)
                      then string-join($node, "")
                      else local:change-links($node/node())}
          else if ($node instance of document-node())
          then local:change-links($node/node())
          else $node
 };



let $n := "&#10;"
let $title := //refentrytitle
let $id := /refentry/@id
let $purpose := //refpurpose

let $refsects :=
  for $refsect in //refsect1
  let $p := for $para in $refsect/para
    (: transform the elements :)
    let $paratr1 := functx:change-element-names-deep($para,
       xs:QName('para'), xs:QName('p'))
    let $paratr2 := functx:change-element-names-deep($paratr1,
       xs:QName('emphasis'), xs:QName('em'))
    (: insert included examples :)
    let $paratr3 := functx:change-element-names-deep($paratr2,
       xs:QName('xi:include'), xs:QName('div'))
    let $paratr4 := local:change-links($paratr3)
    return <div className="manual-para">{$paratr4}</div>
  return
  <div className="manual-refsect1">
   <h1>{string($refsect/title[1])}</h1>
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
"import React from 'react';" || $n ||
"import { BrowserRouter, Link, withRouter } from 'react-router-dom';"  || $n ||
$n ||
"class " || $id || "Class" || " extends React.Component {" || $n ||
" render () {" || $n ||
"  return (<BrowserRouter> " || fn:serialize($jsx) || "</BrowserRouter>);" || $n ||
"  }" || $n ||
"}" || $n ||
"export default " || $id || "Class;"
(:
 : "export default withRouter(" || $id || "Class" || ");"
 :)
)
