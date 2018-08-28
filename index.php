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
include("inc/header.php");

//include left panel (navigation)
//follow the tree in inc/config.ui.php
$page_nav["dashboard"]["sub"]["analytics"]["active"] = true;
include("inc/nav.php");

$chart_pool = array(
   'flow', 'top5', 'in', 'out'
);
$quick_filter = array(
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
        '15m' => 'Last 15 minutes',
        '30m' => 'Last 30 minutes',
        '1h' => 'Last 1 hour',
        '4h' => 'Last 4 hours',
        '12h' => 'Last 12 hours',
        '7d' => 'Last 7 days'
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
?>
<script>
    var base_url = '<?php echo ASSETS_URL; ?>';
</script>
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
                    <button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#chart-type-container">Select chart Pool</button>
                    <div id="chart-type-container" class="modal fade" role="dialog" aria-hidden="true">
                        <div class="modal-dialog">
                            <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-body" id="chartTypeContainer">
                                    <?php
                                    for($i = 0; $i < count($chart_pool); $i ++) {
                                    ?>
                                    <div class="div-container">
                                        <img value="<?php echo $chart_pool[$i]?>" src="img/chart/<?php echo $chart_pool[$i]?>.png" />
                                    </div>
                                    <?php }?>
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
			<div class="row">
				<article class="col-sm-12">
					<!-- new widget -->
					<div class="jarviswidget" id="chart-filter-panel" data-widget-sortable="false" data-widget-togglebutton="false" data-widget-editbutton="false" data-widget-fullscreenbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false">
						<header>
							<span class="widget-icon"> <i class="glyphicon glyphicon-stats txt-color-darken"></i> </span>
							<h2>Choose Chart condition</h2>

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
                                        <div class="row col-md-12" id="time-range">
                                            <?php
                                                $divide_num = count($quick_filter);
                                                foreach($quick_filter as $cate_item) {
                                            ?>
                                            <div class="col-md-<?php echo $divide_num;?>">
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
                                            <div class="col-md-4" type="from">
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
                                            <div class="col-md-4" type="to">
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
                                        <div class="col-lg-offset-8">
                                            <button class="btn btn-primary" onclick="time_range_render_chart();">Go</button>
                                        </div>
									</div>
									<!-- end s2 tab pane -->

									<div class="tab-pane fade" id="s3">
                                        3
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

            <div class="row" id="chart-widgets-container">
                <article class="col-xs-6 col-sm-6 col-md-6 col-lg-6 flow_panel top5_panel"></article>
                <article class="col-xs-6 col-sm-6 col-md-6 col-lg-6 in_panel out_panel"></article>
            </div>
		</section>
		<!-- end widget grid -->

	</div>
	<!-- END MAIN CONTENT -->

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


<script src="<?php echo ASSETS_URL; ?>/js/imgCheckbox-master/jquery.imgcheckbox.js"></script>

<script src="<?php echo ASSETS_URL; ?>/js/randomColor.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/amchart/core.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/amchart/charts.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/amchart/themes/animated.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/amchart/themes/kelly.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/pool_chart.js"></script>



<script>
	$(document).ready(function() {

	});

</script>

<?php
	//include footer
	include("inc/google-analytics.php");
?>