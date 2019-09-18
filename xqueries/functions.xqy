xquery version "1.0";
module namespace f = "https://www.github.com/hlolli";
declare namespace saxon="http://saxon.sf.net/";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";
declare namespace xi="http://www.w3.org/2001/XInclude";

declare function f:change-links
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
                      else f:change-links($node/node())}
          else if ($node instance of document-node())
          then f:change-links($node/node())
          else $node
 };

declare function f:change-ulinks
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('ulink')
  let $newName := xs:QName('a')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"href"} {concat("http://www.csounds.com/manual/html/", $node/@url)}
                      else $node/@*,
                  if (node-name($node) = $oldName)
                      then string-join($node, "")
                      else f:change-ulinks($node/node())}
          else if ($node instance of document-node())
          then f:change-ulinks($node/node())
          else $node
 };

declare function f:change-programlisting
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('programlisting')
  let $newName := xs:QName('div')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-programlisting"}
                      else $node/@*,
                  f:change-programlisting($node/node())}
          else if ($node instance of document-node())
          then f:change-programlisting($node/node())
          else $node
 };

declare function f:change-informalexample
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('informalexample')
  let $newName := xs:QName('div')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-informalexample"}
                      else $node/@*,
                  f:change-informalexample($node/node())}
          else if ($node instance of document-node())
          then f:change-informalexample($node/node())
          else $node
 };

declare function f:change-example
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('example')
  let $newName := xs:QName('div')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-example"}
                      else $node/@*,
                  f:change-example($node/node())}
          else if ($node instance of document-node())
          then f:change-example($node/node())
          else $node
 };

declare function f:change-member
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('member')
  let $newName := xs:QName('div')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-member"}
                      else $node/@*,
                  f:change-member($node/node())}
          else if ($node instance of document-node())
          then f:change-member($node/node())
          else $node
 };

declare function f:change-itemizedlist
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('itemizedlist')
  let $newName := xs:QName('ul')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-itemizedlist"}
                      else $node/@*,
                  f:change-itemizedlist($node/node())}
          else if ($node instance of document-node())
          then f:change-itemizedlist($node/node())
          else $node
 };

declare function f:change-orderedlist
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('orderedlist')
  let $newName := xs:QName('ol')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-orderedlist"}
                      else $node/@*,
                  f:change-orderedlist($node/node())}
          else if ($node instance of document-node())
          then f:change-orderedlist($node/node())
          else $node
 };

declare function f:change-listitem
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('listitem')
  let $newName := xs:QName('li')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-listitem"}
                      else $node/@*,
                  f:change-listitem($node/node())}
          else if ($node instance of document-node())
          then f:change-listitem($node/node())
          else $node
 };

declare function f:change-simplelist
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('simplelist')
  let $newName := xs:QName('div')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-simplelist"}
                      else $node/@*,
                  f:change-simplelist($node/node())}
          else if ($node instance of document-node())
          then f:change-simplelist($node/node())
          else $node
 };

declare function f:change-command
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('command')
  let $newName := xs:QName('span')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-command"}
                      else $node/@*,
                  f:change-command($node/node())}
          else if ($node instance of document-node())
          then f:change-command($node/node())
          else $node
 };

declare function f:change-title
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('title')
  let $newName := xs:QName('h3')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-title-elem"}
                      else $node/@*,
                  f:change-title($node/node())}
          else if ($node instance of document-node())
          then f:change-title($node/node())
          else $node
 };

declare function f:change-synopsis
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('synopsis')
  let $newName := xs:QName('pre')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-synopsis"}
                      else $node/@*,
                  f:change-synopsis($node/node())}
          else if ($node instance of document-node())
          then f:change-synopsis($node/node())
          else $node
 };

(:
 : "{unescape(`" || replace(fn:string(fn:unparsed-text(replace(concat("../manual/", $node/@href), ".xml", ""))), "\\", "\\\\") || "`)}"
 :)

declare function f:include-example
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('xi:include')
  let $newName := xs:QName('ManualEditor')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then (attribute {"className"} {"manual-example-code"},
                            attribute {"value"} {replace(fn:unparsed-text(replace(concat("../manual/", $node/@href), ".xml", "")), "&#xA;", "&#xD;")})
                      else $node/@*,
                  if (node-name($node) = $oldName)
                      then ""
                      else f:include-example($node/node())}
          else if ($node instance of document-node())
          then f:include-example($node/node())
          else $node
 };

declare function f:change-literallayout
  ( $nodes as node()*)  as node()* {
  let $oldName := xs:QName('literallayout')
  let $newName := xs:QName('div')
  for $node in $nodes
   return if ($node instance of element())
          then element
                 {if (node-name($node) = $oldName)
                      then $newName
                      else node-name($node) }
                 {if (node-name($node) = $oldName)
                      then attribute {"className"} {"manual-literallayout"}
                      else $node/@*,
                  f:change-literallayout($node/node())}
          else if ($node instance of document-node())
          then f:change-literallayout($node/node())
          else $node
 };
