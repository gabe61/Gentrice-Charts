<?php
$sample_json = '{
            "took" : 34,
            "timed_out" : false,
            "_shards" : {
                "total" : 4,
                "successful" : 4,
                "skipped" : 0,
                "failed" : 0
            },
            "hits" : {
                "total" : 36942,
                "max_score" : 0.0,
                "hits" : [ ]
            },
            "aggregations" : {
                "q" : {
                    "meta" : {
                        "type" : "split"
                    },
                    "buckets" : {
                        "*" : {
                            "doc_count" : 36942,
                            "time_buckets" : {
                                "meta" : {
                                    "type" : "time_buckets"
                                },
                                "buckets" : []
                            },
                            "L7_PROTO_NAME" : {
                                "meta" : {
                                    "type" : "split"
                                },
                                "doc_count_error_upper_bound" : 336,
                                "sum_other_doc_count" : 14163,
                                "buckets" : [
                                    {
                                        "key" : "Gentrice-L2TP",
                                        "doc_count" : 13802,
                                        "time_buckets" : {
                                            "meta" : {
                                                "type" : "time_buckets"
                                            },
                                            "buckets" : []
                                        }
                                    },
                                    {
                                        "key" : "Syslog",
                                        "doc_count" : 9529,
                                        "time_buckets" : {
                                            "meta" : {
                                                "type" : "time_buckets"
                                            },
                                            "buckets" : []
                                        }
                                    },
                                    {
                                        "key" : "SSL",
                                        "doc_count" : 9529,
                                        "time_buckets" : {
                                            "meta" : {
                                                "type" : "time_buckets"
                                            },
                                            "buckets" : []
                                        }
                                    },
                                    {
                                        "key" : "DNS",
                                        "doc_count" : 9529,
                                        "time_buckets" : {
                                            "meta" : {
                                                "type" : "time_buckets"
                                            },
                                            "buckets" : []
                                        }
                                    },
                                    {
                                        "key" : "Unknown",
                                        "doc_count" : 9529,
                                        "time_buckets" : {
                                            "meta" : {
                                                "type" : "time_buckets"
                                            },
                                            "buckets" : []
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }';


$sample_json = json_decode($sample_json, true);


$interval = $_GET['interval'];
$from = (int)$_GET['from'];
$to = (int)$_GET['to'];

$chart = $_GET['chart'];

$ts = '';
if (strpos('m', $interval) !== FALSE) {
    $ts = 60 * (int)(str_replace('m', '', $interval));
} else if (strpos('h', $interval) !== FALSE) {
    $ts = 3600 * (int)(str_replace('h', '', $interval));
} else {
    $ts = (int)(str_replace('s', '', $interval));
}
$ts *= 1000;

for ($i = $from; $i <= $to; $i += $ts) {
    $y = (float)rand() / (float)getrandmax() * 200000;
    if ($y >= 190000) $y = $y * 10;

    if ($chart == 'flow') {
        $sample_json['aggregations']['q']['buckets']['*']['time_buckets']['buckets'][] = array(
            "key_as_string" => (int)($i / 1000) . '',
            "key" => $i,
            "doc_count" => $y,
            "count" => [
                "value" => (float)($y)
            ]
        );
    }
    else if ($chart == 'top5') {
        for ($j = 0; $j < 5; $j++) {
            $y = (float)rand() / (float)getrandmax() * 200000;
            if ($y >= 190000) $y *= 10;
            $sample_json['aggregations']['q']['buckets']['*']['L7_PROTO_NAME']['buckets'][$j]['time_buckets']['buckets'][] = array(
                "key_as_string" => (int)($i / 1000) . '',
                "key" => $i,
                "doc_count" => $y,
                "sum(IN_BYTES)" => [
                    "value" => (float)($y)
                ]
            );
        }
    }
    else if ($chart == 'in') {
        $sample_json['aggregations']['q']['buckets']['*']['time_buckets']['buckets'][] = array(
            "key_as_string" => (int)($i / 1000) . '',
            "key" => $i,
            "doc_count" => $y,
            "sum(IN_BYTES)" => [
                "value" => (float)($y)
            ]
        );
    }
    else if ($chart == 'out') {
        $sample_json['aggregations']['q']['buckets']['*']['time_buckets']['buckets'][] = array(
            "key_as_string" => (int)($i / 1000) . '',
            "key" => $i,
            "doc_count" => $y,
            "sum(OUT_BYTES)" => [
                "value" => (float)($y)
            ]
        );
    }
}
header('Content-Type: application/json');
echo json_encode($sample_json);
//$res_flow = $sample_json['aggregations']['q']['buckets']['*']['time_buckets']['buckets'];
//// console.log(chart_pool.flow);
//
//$data_flow = [];
//$day = "t";
//for ($i = 0; $i < count($res_flow); $i++) {
//    $data_flow[] = array(
//                            'date1' => $res_flow[$i]['key'],
//                            'value1' => $res_flow[$i]['count']['value']
//                        );
//                    }
//echo json_encode($data_flow);
////    echo '<pre>';
////    print_r($sample_json);
////    exit;