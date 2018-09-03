 <?php
 $apiurl = $_GET["apiurl"];
   $tfrom = $_GET["from"];
   $tto = $_GET["to"];
   $itv = $_GET["interval"];
   $response = file_get_contents($apiurl."?from=".$tfrom."&to=".$tto."&interval=".$itv);
   // $response = file_get_contents($apiurl);
   echo $response;