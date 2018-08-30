<?php

//initilize the page
require_once 'init.web.php';

/*---------------- PHP Custom Scripts ---------

YOU CAN SET CONFIGURATION VARIABLES HERE BEFORE IT GOES TO NAV, RIBBON, ETC.
E.G. $page_title = "Custom Title" */

$page_title = "Table Dashboard";

/* ---------------- END PHP Custom Scripts ------------- */

//include header
//you can add your custom css in $page_css array.
//Note: all css files are inside css/ folder
$page_css[] = "your_style.css";
include("inc/header.php");

//include left panel (navigation)
//follow the tree in inc/config.ui.php
$page_nav["dashboard"]["sub"]["table_dashboard"]["active"] = true;
include("inc/nav.php");

?>
<!-- ==========================CONTENT STARTS HERE ========================== -->
<!-- MAIN PANEL -->
<div id="main" role="main">

	<?php
		//configure ribbon (breadcrumbs) array("name"=>"url"), leave url empty if no url
		//$breadcrumbs["New Crumb"] => "http://url.com"
		$breadcrumbs["Tables"] = "";
		include("inc/ribbon.php");
	?>

	<!-- MAIN CONTENT -->
	<div id="content">

		<!-- row -->
		<div class="row">
			
			<!-- col -->
			<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
				<h1 class="page-title txt-color-blueDark">
					
					<!-- PAGE HEADER -->
					<i class="fa-fw fa fa-home"></i> 
						Dashboard
					<span>>  
						Table
					</span>
				</h1>
			</div>
			
		</div>
		<!-- end row -->

		<!--
			The ID "widget-grid" will start to initialize all widgets below 
			You do not need to use widgets if you dont want to. Simply remove 
			the <section></section> and you can use wells or panels instead 
			-->

		<!-- widget grid -->
		<section id="widget-grid" class="">

			<!-- row -->
			<div class="row">
				
				<!-- NEW WIDGET START -->
				<article class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <div>
                        <table id="src-ip"></table>
                        <div id="pjqgrid_src_ip"></div>
                    </div>
                    <div style="margin-top: 20px;">
                        <table id="desc-ip"></table>
                        <div id="pjqgrid_desc_ip"></div>
                    </div>

                </article>
                <article class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <div>
                        <table id="src-port"></table>
                        <div id="pjqgrid_src_port"></div>
                    </div>
                    <div style="margin-top: 20px;">
                        <table id="desc-port"></table>
                        <div id="pjqgrid_desc_port"></div>
                    </div>
				</article>
                <article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div>
                        <table id="protocol"></table>
                        <div id="pjqgrid_protocol"></div>
                    </div>
                </article>
				<!-- WIDGET END -->
				
			</div>

			<!-- end row -->

		</section>
		<!-- end widget grid -->

	</div>
	<!-- END MAIN CONTENT -->

</div>
<!-- END MAIN PANEL -->
<!-- ==========================CONTENT ENDS HERE ========================== -->

<?php
	// include page footer
	include("inc/footer.php");
?>

<?php 
	//include required scripts
	include("inc/scripts.php"); 
?>

<!-- PAGE RELATED PLUGIN(S) 
<script src="..."></script>-->

<script src="<?php echo ASSETS_URL; ?>/js/plugin/jqgrid/jquery.jqGrid.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/jqgrid/grid.locale-en.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/dashboard-table.js"></script>


<?php 
	//include footer
	include("inc/google-analytics.php"); 
?>