<?php

//initilize the page
require_once 'init.web.php';

/*---------------- PHP Custom Scripts ---------

YOU CAN SET CONFIGURATION VARIABLES HERE BEFORE IT GOES TO NAV, RIBBON, ETC.
E.G. $page_title = "Custom Title" */

$page_title = "Dashboard";

/* ---------------- END PHP Custom Scripts ------------- */

//include header
//you can add your custom css in $page_css array.
//Note: all css files are inside css/ folder
$page_css[] = "your_style.css";
$page_css[] = "../js/datetime-picker/css/bootstrap-datetimepicker.min.css";
$page_css[] = "select2.css";
include("inc/header.php");

//include left panel (navigation)
//follow the tree in inc/config.ui.php
$page_nav["dashboard"]["sub"]["analytics"]["active"] = true;
include("inc/nav.php");

$chart_pool = array(
   'chart' => [
       'flow' => 'Flow-Count',
       'top5' => 'Protocol-Top5',
       'in' => 'NetFlow-In',
       'out' => 'NetFlow-Out'
   ],
   'table' => [
       'src' => 'Top Sources',
       'desc' => 'Top Description',
       'srcport' => 'Top Sources Ports',
       'descport' => 'Top Description Ports'
   ]
);

$apiUrl = array(
    'flow' => 'http://192.168.10.133:60080/api/visualize/Overview-Flow-Count',
    'top5' => 'http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5',
    'in' => 'http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In',
    'out' => 'http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out',

    'src' => 'http://192.168.10.133:60080/api/visualize/Top-NetFlow-Src-IP',
    'desc' => 'http://192.168.10.133:60080/api/visualize/Top-NetFlow-Desc-IP',
    'srcport' => 'http://192.168.10.133:60080/api/visualize/Top-NetFlow-Src-Port',
    'descport' => 'http://192.168.10.133:60080/api/visualize/Top-NetFlow-Desc-Port'
);

$quick_filter = array(
    array(
        '15m' => 'Last 15 minutes',
        '30m' => 'Last 30 minutes',
        '1h' => 'Last 1 hour',
        '4h' => 'Last 4 hours',
        '12h' => 'Last 12 hours',
        '7d' => 'Last 7 days'
    ),
    array(
        'today' => 'Today',
        'week' => 'This Week',
        'month' => 'This Month',
        'year' => 'This year',
        'weekday' => 'Week to day',
        'monthday' => 'Month to date',
        'yearday' => 'Year to date'
    ),
    array(
        '30d' => 'Last 30 days',
        '60d' => 'Last 60 days',
        '90d' => 'Last 90 days',
        '6mm' => 'Last 6 months',
        '1y' => 'Last 1 years',
        '2y' => 'Last 2 years',
        '5y' => 'Last 5 years'
    )
);


function render_pool($type = 'chart') {
    global $chart_pool;
    foreach($chart_pool[$type] as $key => $chart) {
        ?>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="<?php echo $key;?>" data-type="<?php echo $type;?>" id="checkbox-<?php echo $key;?>">
            <label class="form-check-label" for="checkbox-<?php echo $key;?>">
                <?php echo $chart;?>
            </label>
        </div>
        <?php
    }
}
?>
<!-- ==========================CONTENT STARTS HERE ========================== -->
<!-- MAIN PANEL -->
<div id="main" role="main">
	<?php
		//configure ribbon (breadcrumbs) array("name"=>"url"), leave url empty if no url
		//$breadcrumbs["New Crumb"] => "http://url.com"
		include("inc/ribbon.php");
	?>

	<!-- MAIN CONTENT -->
	<div id="content">

		<div class="row">
			<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
				<h1 class="page-title txt-color-blueDark"><i class="fa-fw fa fa-home"></i> Dashboard <span>> My Dashboard</span></h1>
			</div>
			<div class="col-xs-12 col-sm-5 col-md-5 col-lg-8">
                <div class="ml-auto pull-right">
                    <button type="button" class="btn btn-info btn-lg" id="btn-chart-filter">Today</button>
                    <button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#chart-type-container">Select Graph</button>
                    <div id="chart-type-container" class="modal fade" role="dialog" aria-hidden="true">
                        <div class="modal-dialog">
                            <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-body" id="chartTypeContainer">
                                    <div class="div-container">
                                        <h2 class="chart-pool">Chart</h2>
                                        <?php render_pool('chart');?>
                                        <h2 class="chart-pool">Table</h2>
                                        <?php render_pool('table');?>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
			</div>
		</div>
        <!-- widget grid -->
		<section id="widget-grid-1" class="">

			<!-- row -->
			<div class="row" style="margin: 0; padding: 0; float: right;">
				<article class="col-sm-12" id="chart-filter-panel">
					<!-- new widget -->
					<div class="jarviswidget" data-widget-sortable="false" data-widget-togglebutton="false" data-widget-editbutton="false" data-widget-fullscreenbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false" style="z-index: 99999999999">
						<header>
							<ul class="nav nav-tabs pull-right in" id="myTab">
								<li class="active">
									<a data-toggle="tab" href="#s1"><i class="fa fa-clock-o"></i> <span class="hidden-mobile hidden-tablet">Quick</span></a>
								</li>

								<li>
									<a data-toggle="tab" href="#s2"><span class="hidden-mobile hidden-tablet">Relative</span></a>
								</li>

								<li>
									<a data-toggle="tab" href="#s3"><span class="hidden-mobile hidden-tablet">Absolute</span></a>
								</li>
                                <li>
                                    <a data-toggle="tab" href="#s4"><span class="hidden-mobile hidden-tablet">Recent</span></a>
                                </li>
							</ul>

						</header>

						<!-- widget div-->
						<div class="no-padding">
							<!-- end widget edit box -->

							<div class="widget-body">
								<!-- content -->
								<div id="myTabContent" class="tab-content">
									<div class="tab-pane fade active in padding-10 no-padding-bottom" id="s1">
                                        <div id="time-range">
                                            <?php
                                                foreach($quick_filter as $cate_item) {
                                            ?>
                                            <div>
                                                <?php
                                                    foreach($cate_item as $v => $title) {
                                                ?>
                                                <div class="time-range-catetory">
                                                    <a class="text-primary" value="<?php echo $v;?>"><?php echo $title;?></a>
                                                </div>
                                                <?php }?>
                                            </div>
                                            <?php }?>
                                        </div>
									</div>
									<!-- end s1 tab pane -->

									<div class="tab-pane fade" id="s2">
                                        <div class="row" style="margin: 30px;">
                                            <div class="col-md-6" type="from">
                                                <div>
                                                    <b>From</b>
                                                </div>
                                                <div class="calculated-time">
                                                </div>
                                                <div>
                                                    <form class="form-inline">
                                                        <div class="form-group mx-sm-3 mb-4">
                                                            <input type="number" class="form-control" placeholder="Input number">
                                                        </div>
                                                        <select class="form-control mb-2">
                                                            <option value="h">Hour ago</option>
                                                            <option value="m">Minute ago</option>
                                                            <option value="s">Second ago</option>
                                                        </select>
                                                    </form>
                                                </div>
                                                <div class="form-check" style="margin-top: 20px;">
                                                    <input type="checkbox" class="form-check-input" id="from-round-chkbox">
                                                    <label class="form-check-label" for="from-round-chkbox">Round to the <span>Hour</span></label>
                                                </div>
                                            </div>
                                            <div class="col-md-6" type="to">
                                                <div>
                                                    <b>To</b>
                                                </div>
                                                <div class="calculated-time">
                                                </div>
                                                <div>
                                                    <form class="form-inline">
                                                        <div class="form-group mx-sm-3 mb-4">
                                                            <input type="number" class="form-control" placeholder="Input number">
                                                        </div>
                                                        <select class="form-control mb-2">
                                                            <option value="h">Hour ago</option>
                                                            <option value="m">Minute ago</option>
                                                            <option value="s">Second ago</option>
                                                        </select>
                                                    </form>
                                                </div>
                                                <div class="form-check" style="margin-top: 20px;">
                                                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                                                    <label class="form-check-label" for="exampleCheck1">Round to the <span>Hour</span></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="pull-right" style="margin-bottom: 10px;">
                                            <button class="btn btn-primary btn-lg" style="margin-right: 20px;" onclick="time_range_render_chart();">Go</button>
                                        </div>
									</div>
									<!-- end s2 tab pane -->

									<div class="tab-pane fade" id="s3" style="padding: 20px;">
                                        <div class="row" style="margin-bottom: 10px;">
                                            <div class="col-md-6" align="center"><h4>From</h4></div>
                                            <div class="col-md-6" align="center"><h4>To</h4></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6" style="border-right: 1px solid #eee">
                                                <div id="datetimepicker_from"></div>
                                            </div>
                                            <div class="col-md-6">
                                                <div id="datetimepicker_to"></div>
                                            </div>
                                        </div>                                        
                                        <div class="pull-right" style="margin-top: 20px; margin-right: 10px; margin-bottom: 20px;">
                                            <button class="btn btn-success btn-lg" onclick="absolute_time_range();">Go</button>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="s4" style="padding: 20px;"></div>
									<!-- end s3 tab pane -->
								</div>
								<!-- end content -->
							</div>

						</div>
						<!-- end widget div -->
					</div>
					<!-- end widget -->

				</article>
			</div>
            <div class="well">
                <span id="add-filter-panel"></span>
                <button class="btn btn-default" onclick="open_new_filter();">Add Filter <i class="fa fa-plus"></i></button>
            </div>
            <!-- NEW WIDGET START -->
            <div id="chart-widgets-container">
                <article class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                </article>
                <article class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                </article>
            </div>
            <!-- WIDGET END -->
		</section>
		<!-- end widget grid -->

	</div>
	<!-- END MAIN CONTENT -->
    <div class="modal fade" id="dialog-add-filter">
        <div class="modal-dialog" role="document">
            <div class="modal-content" style="width: 800px; margin-left: calc(50% - 400px)">
                <div class="modal-header">
                    <h5 class="modal-title" id="add-filter-title">Add Filter</h5>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="filter-category">Filter</label>
                        <div class="row">
                            <div class="col-md-5">
                                <select id="filter-category" class="form-control" data-placeholder="Fields...">
                                    <option value=""></option>
                                    <option value="ip">IP</option>
                                    <option value="ipv4_src">IPV4_SRC</option>
                                    <option value="ipv6_src">IPV6_SRC</option>
                                    <option value="ipv4_dst">IPV4_DST</option>
                                    <option value="ipv6_dst">IPV6_DST</option>
                                    <option value="src_port">SRC_PORT</option>
                                    <option value="dst_port">DST_PORT</option>
                                    <option value="transport">Transport</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select id="filter-operator" data-placeholder="Operators...">
                                    <option value=""></option>
                                    <option value="IS">IS</option>
                                </select>
                            </div>
                            <div class="col-md-3 filter-value-area">
                                <input id="filter-value" class="form-control" placeholder="IP address" data-role="ipv4_src,ipv6_src,ipv4_dst,ipv6_dst,src_port,dst_port" />
                                <select class="form-control" data-placeholder="Transport..." id="transport" data-role="transport">
                                    <option value=""></option>
                                    <option value="1">ICMP</option>
                                    <option value="6">TCP</option>
                                    <option value="17">UDP</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-5">
                            <label for="filter-label">Label</label>
                            <input type="text" class="form-control" placeholder="Optional" id="filter-label">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="pull-left" id="shortcut-filter-trash" style="display: none;">
                        <button type="button" class="btn btn-danger" onclick="shortcut_filter_trash();"><i class="fa fa-trash"></i></button>
                    </div>
                    <div class="pull-right">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="filter_save()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END MAIN PANEL -->

<!-- ==========================CONTENT ENDS HERE ========================== -->

<?php
	include("inc/footer.php");
?>

<?php
	//include required scripts
	include("inc/scripts.php");
?>

<!-- PAGE RELATED PLUGIN(S)
<script src="..."></script>-->
<!-- Flot Chart Plugin: Flot Engine, Flot Resizer, Flot Tooltip -->
<script src="<?php echo ASSETS_URL; ?>/js/plugin/flot/jquery.flot.cust.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/flot/jquery.flot.resize.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/flot/jquery.flot.time.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/flot/jquery.flot.tooltip.min.js"></script>

<!-- Vector Maps Plugin: Vectormap engine, Vectormap language -->
<script src="<?php echo ASSETS_URL; ?>/js/plugin/vectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/vectormap/jquery-jvectormap-world-mill-en.js"></script>

    <!-- Full Calendar -->

<script src="<?php echo ASSETS_URL; ?>/js/amchart/core.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/amchart/charts.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/amchart/themes/animated.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/amchart/themes/kelly.js"></script>

<script src="<?php echo ASSETS_URL; ?>/js/datetime-picker/js/moment.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/datetime-picker/js/bootstrap-datetimepicker.min.js"></script>

<script src="<?php echo ASSETS_URL; ?>/js/plugin/datatables/jquery.dataTables.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/datatables/dataTables.bootstrap.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/datatables/dataTables.tableTools.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/datatables/dataTables.colReorder.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/datatables/dataTables.colVis.min.js"></script>

<script src="<?php echo ASSETS_URL; ?>/js/plugin/select2/select2.min.js"></script>


<script src="<?php echo ASSETS_URL; ?>/js/time_range_cate.js"></script>
    <script src="<?php echo ASSETS_URL; ?>/js/main.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/pool_chart.js"></script>
    <script src="<?php echo ASSETS_URL; ?>/js/dashboard-table.js"></script>

<script>
    var api = <?php echo json_encode($apiUrl);?>;
</script>

<?php
	//include footer
	include("inc/google-analytics.php");
?>