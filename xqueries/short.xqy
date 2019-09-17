xquery version "1.0";
declare namespace saxon="http://saxon.sf.net/";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";
declare option saxon:output "method=text";


let $purpose := //refpurpose

for $purp in $purpose
  return string($purp/string())
