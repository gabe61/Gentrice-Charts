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
                        <table id="jqgrid"></table>
                        <div id="pjqgrid"></div>
                    </div>
                    <div style="margin-top: 20px;">
                        <table id="jqgrid2"></table>
                        <div id="pjqgrid2"></div>
                    </div>

                </article>
                <article class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <div>
                        <table id="jqgrid1"></table>
                        <div id="pjqgrid1"></div>
                    </div>
                    <div style="margin-top: 20px;">
                        <table id="jqgrid3"></table>
                        <div id="pjqgrid3"></div>
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

<script type="text/javascript">
	$(document).ready(function() {

		var jqgrid_data = [{
			id : "1",
            source : "53.32.111.221",
            mb : "test",
            packets : "note",
            records : "200.00"
		}];

		var mock_data_grid1 = [], mock_data_grid2 = [], mock_data_grid3 = [], mock_data_grid4 = [];
		for(var i = 0; i < 1000; i ++) {
            mock_data_grid1.push({
                id : i,
                source : "53.32.111."+parseInt(Math.random()*1000),
                mb : (Math.random()*100).toFixed(3),
                packets : (Math.random()*100000).toFixed(0),
                records : (Math.random()*100222222).toFixed(0)
            });
            mock_data_grid2.push({
                id : i,
                source : "53.32.111."+parseInt(Math.random()*1000),
                mb : (Math.random()*100).toFixed(3),
                packets : (Math.random()*100000).toFixed(0),
                records : (Math.random()*100222222).toFixed(0)
            });
            mock_data_grid3.push({
                id : i,
                source : parseInt(Math.random()*1000),
                mb : (Math.random()*100).toFixed(3),
                packets : (Math.random()*100000).toFixed(0),
                records : (Math.random()*100222222).toFixed(0)
            });
            mock_data_grid4.push({
                id : i,
                source : parseInt(Math.random()*1000),
                mb : (Math.random()*100).toFixed(3),
                packets : (Math.random()*100000).toFixed(0),
                records : (Math.random()*100222222).toFixed(0)
            });
        }

		jQuery("#jqgrid").jqGrid({
			data : mock_data_grid1,
			datatype : "local",
			height : 'auto',
			colNames : ['Source', 'MB', 'Packets', 'Flow Records'],
			colModel : [
                // { name : 'id', index : 'id' },
				{ name : 'source', index : 'source' },
				{ name : 'mb', index : 'mb' },
				{ name : 'packets', index : 'packets' },
				{ name : 'records', index : 'records' }
            ],
			rowNum : 10,
			rowList : [10, 20, 30],
			pager : '#pjqgrid',
			sortname : 'source',
			toolbarfilter: true,
			viewrecords : true,
			sortorder : "asc",
			caption : "Top Sources",
			multiselect : true,
			autowidth : true
		});

        jQuery("#jqgrid1").jqGrid({
            data : mock_data_grid2,
            datatype : "local",
            height : 'auto',
            colNames : ['Description', 'MB', 'Packets', 'Flow Records'],
            colModel : [
                // { name : 'id', index : 'id' },
                { name : 'source', index : 'source' },
                { name : 'mb', index : 'mb' },
                { name : 'packets', index : 'packets' },
                { name : 'records', index : 'records' }
            ],
            rowNum : 10,
            rowList : [10, 20, 30],
            pager : '#pjqgrid1',
            sortname : 'source',
            toolbarfilter: true,
            viewrecords : true,
            sortorder : "asc",
            caption : "Top Description",
            multiselect : true,
            autowidth : true
        });


        jQuery("#jqgrid2").jqGrid({
            data : mock_data_grid3,
            datatype : "local",
            height : 'auto',
            colNames : ['Source', 'MB', 'Packets', 'Flow Records'],
            colModel : [
                // { name : 'id', index : 'id' },
                { name : 'source', index : 'source' },
                { name : 'mb', index : 'mb' },
                { name : 'packets', index : 'packets' },
                { name : 'records', index : 'records' }
            ],
            rowNum : 10,
            rowList : [10, 20, 30],
            pager : '#pjqgrid2',
            sortname : 'source',
            toolbarfilter: true,
            viewrecords : true,
            sortorder : "asc",
            caption : "Top Sources Ports",
            multiselect : true,
            autowidth : true
        });


        jQuery("#jqgrid3").jqGrid({
            data : mock_data_grid4,
            datatype : "local",
            height : 'auto',
            colNames : ['Description', 'MB', 'Packets', 'Flow Records'],
            colModel : [
                // { name : 'id', index : 'id' },
                { name : 'source', index : 'source' },
                { name : 'mb', index : 'mb' },
                { name : 'packets', index : 'packets' },
                { name : 'records', index : 'records' }
            ],
            rowNum : 10,
            rowList : [10, 20, 30],
            pager : '#pjqgrid3',
            sortname : 'source',
            toolbarfilter: true,
            viewrecords : true,
            sortorder : "asc",
            caption : "Top Description Ports",
            multiselect : true,
            autowidth : true
        });
	});

	$(window).on('resize.jqGrid', function () {
		$("#jqgrid").jqGrid( 'setGridWidth', '50%' );
	})

</script>


<?php 
	//include footer
	include("inc/google-analytics.php"); 
?>