 <?php
    $apiurl = $_GET["apiurl"];
    $tfrom = $_GET["from"];
    $tto = $_GET["to"];
    $itv = $_GET["interval"];
    $addFilter = $_GET['addfilter'];
    if($addfilter) {
    	$addfilter = '&filter='.$addFilter;
    }
    else {
    	$addfilter = '';
    }
    $response = file_get_contents($apiurl."?from=".$tfrom."&to=".$tto."&interval=".$itv.$addfilter);
    // $response = file_get_contents($apiurl);
    echo $response;