//sd-tester-ui.js
function clearCharts(){
		//clear charts
		d3.select(".charts").selectAll(".taxa-group").remove();
		//clear x axis label
		d3.select(".charts .x-axis-label").html("");

	}


/**@function handleDatasetIDChange
* @param value datasetid int
*/
/*Notes: 
1. show standby
2. clearCharts()
3. set this context to handleDatasetIDChange
4. call apiDownloadDataset(value)
*/
function handleDatasetIDChange(value){
	//show standyby
	topic.publish("diagrammer/ShowStandby");

	//clear existing charts
	clearCharts();
	handleDatasetIDChange = this;
	apiDownloadDataset(value);
	//local teting
	//localAPIResult();
}

/**@function handleDatasetIDChange
* @param value charttype name text
*/
function handleChartTypeChange(value){
	console.log("metadata.chartTypeSelection updated");
	metadata.chartTypeSelection = this.value; //value of radiobutton control is charttype name
	var noCharts = d3.select(".charts .taxa-group").empty();

	if(!noCharts){
		updateCharts();
	}
}

/**@function validateChartTypes
* Given a VariableUnit, appropriately enable/disable charttypes
* @param value VariableUnit type text
*
*/
function validateChartTypes(value){
	require(["dijit/registry"],function(registry){
		if( value == "present/absent"){
			registry.byId("radioFilledArea").setDisabled(true);
			registry.byId("radioBarChart").setDisabled(true);
			var rSP = registry.byId("radioSymbolPlot");
			rSP.set('disabled',false);
			rSP.set("checked",true);
		} else {
			var rFA = registry.byId("radioFilledArea");
			rFA.set('disabled',false);
			rFA.set("checked",true);
			registry.byId("radioBarChart").setDisabled(false);
			registry.byId("radioSymbolPlot").setDisabled(true);
		}
	})
}	

/**@function handleVariableUnitChange
* Given a VariableUnit, update UI charttype selection; 
* set VariableUnit on data model; 
* redraw the chart
* @param value VariableUnit type text
*
*/
function handleVariableUnitChange(value){
	//disable invalid chart types
	validateChartTypes(value);
	setVariableUnit(value);
	updateChart();
}

/**@function handleDatasetTypeChange
* Given a DatasetType, call function to retreive associated datasetids 
* @param value DatasetType text
*/

function handleDatasetTypeChange(value){
	handleDatasetTypeChange = this;
	require(["dojo/topic", "dijit/registry","dojo/on","dojo/_base/lang"],function(topic,registry,on,lang){
		if( value != currentDatasetType){
			//clear previous id selection
			var currentDatasetID = registry.byId("fsDatasetID").get("value");
			if(currentDatasetID){
				//handlerChangeDatasetID.remove();
				clearDatasetID();
				
				//var dijitfsDatasetID = registry.byId("fsDatasetID");
				//handlerChangeDatasetID = on(dijitfsDatasetID,"change", handleDatasetIDChange);
			}
			currentDatasetType = value;
			topic.publish("datasetselect/ShowStandby");
			
			getDatasetIDs(value);
		}
	});
}

/**@function updateVariableUnitFilteringSelect
* Given array of VariableUnits for dataset, update filteringselect store 
* @param unitsArray array of variable units
*/
function updateVariableUnitFilteringSelect(unitsArray){
	require(["dojo/store/Memory", "dijit/registry", "dojo/on"],function(Memory, registry,on){

		//get filteringselect
		var varUnitfs = registry.byId("fsVariableUnits");
		var variableUnitCollection = [];
		//create pseudo age for depth to add to variableUnitCollection
		unitsArray.forEach(function(d){
			var unitObj = {};
			unitObj.VariableUnits = d;
			variableUnitCollection.push(unitObj);
		})
		
		varUnitStore = new Memory({data: variableUnitCollection, idProperty: "VariableUnits"});

		varUnitfs.set("store", varUnitStore);

	})	
}

/**@function setDefaultChartType
* Checks if metadata for dataset is populated
* Applied rules for preferred charttype 
* @param unitsArray array of variable units
*/

function setDefaultChartType(){
	if(metadata.datasetType && metadata.variableUnit){
		//set UI control
		switch(metadata.datasetType){
			case "pollen":
				setChartType("FilledArea");
				break;
			case "ostracode":
				setChartType("FilledArea");
				break;
			case "diatom":
				setChartType("FilledArea");
				break;
			case "vertebrate fauna":
				if(metadata.variableUnit == "present/absent"){
					setChartType("SymbolPlot");
				} else {
					setChartType("BarChart");
				}
				break;
			default:
				//not always appropriate but draws for all VariableUnits
				setChartType("SymbolPlot");
				break;
		}
	}
}


/**@function setChartType
* Programmatically sets chartype UI control
* @param name of charttype to be drawn 
*/
function setChartType(name){
	require(["dijit/form/RadioButton", "dijit/registry"],function(FilteringSelect, registry){
		//radioFilledArea, radioSymbolPlot, radioBarChart
		switch(name){
			case "FilledArea":
				var rb = registry.byId("radioFilledArea");
				rb.set("checked",true);
				break;
			case "SymbolPlot":
				var rb = registry.byId("radioSymbolPlot");
				rb.set("checked",true);
				break;
			case "BarChart":
				var rb = registry.byId("radioBarChart");
				rb.set("checked",true);
				break;
			//safest assumption; all data can display as points	
			default:
				var rb = registry.byId("radioSymbolPlot");
				rb.set("checked",true);
				break;
		}
	})
}


/** Visual Variables **/
/*build legend*/
function createLegend(data){
	var width = 200 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;


	d3.select(".legend-container").select("svg").remove();   

	var svg = d3.select(".legend-container")
	 .append("svg")
	   .attr("width", width + margin.left + margin.right)
	   .attr("height", height + margin.top + margin.bottom)
	 .append("g")
	   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//size is area
	var symWidth = 20;
	var symHt = 20;
	var box = d3.symbol().size(symWidth*symHt).type(d3.symbolSquare);
	//clear legend
	/////var lgd = d3.select("#legend").html(null);

	



	var lgd = svg.selectAll(".entry")
			.data(data)
			.enter()
			.append("g")
			.attr("class",function(d){
				return "entry "+d.EcolGroupID;
			})
	     	.attr("transform",function(d,i){
	     		return "translate(0," + (i*(symHt+10)) + ")";
	     	});
	     	


	     	
	var leftSym = lgd.append("path")
			.attr("clip-path",function(d,i){
		       	return "url(#clipObjLeft)";
		    })
			.attr("d",function(d){
				var test = box();
				return test;
			})
			.attr("transform","translate(-10,0)")
			.style("fill",function(d,i){
				//return colors20(i);
				var c = colorMap[d.EcolGroupID];
				if(c){
					return c;
				} else {
					return colors20(i)
				}
			})
			.style("stroke",function(d,i){
				return "#fff"
			});

	var rightSym = lgd.append("path")
			.attr("clip-path",function(d,i){
		       return "url(#clipObjRight)";
		    })
			.attr("d",function(d){
				var test = box();
				return test;
			})
			.attr("transform","translate(10,0)")
			.style("fill",function(d,i){
				var c = colorMap[d.EcolGroupID];
				if(c){
					return c;
				} else {
					return colors20(i)
				}
			})
			.style("fill-opacity",0.5)
			.style("stroke",function(d,i){
				return "#fff"
			});

	var clipObjRight = svg.append("clipPath")
				//.attr("clipPathUnits", "objectBoundingBox")
				.attr("id", "clipObjRight")
				.append("circle")
				.attr("cx", -10)
				.attr("cy", 0)
				.attr("r", 10);

	var clipObjLeft = svg.append("clipPath")
				//.attr("clipPathUnits", "objectBoundingBox")
				.attr("id", "clipObjLeft")
				.append("circle")
				.attr("cx", 10)
				.attr("cy", 0)
				.attr("r", 10);

	var labels = lgd.append("text")
		.text(function(d){
			return d.EcolGroupID;//"label"
		})
		.attr("transform","translate(15,5)");
}



function bindListeners(){
	require(["dijit/registry","dojo/dom","dojo/on"],function(registry,dom,on){
		try{
		var dijitfsDataType = dijit.registry.byId("fsDataType");
		var dijitfsDatasetID = dijit.registry.byId("fsDatasetID");
		var dijitRBSymbolPlot = dijit.registry.byId("radioSymbolPlot");
		var dijitRBBarChart = dijit.registry.byId("radioBarChart");
		var dijitRBFilledArea = dijit.registry.byId("radioFilledArea");
		
		var toggle5xControl = dom.byId("showExaggeration");
		var yAxisSelect = dijit.registry.byId("fsSelectYAxis");
		var topxSpinner = dijit.registry.byId("topxSpinner");
		var groupGenus = dijit.registry.byId("genusGroup");
		var fsVarUnit = dijit.registry.byId("fsVariableUnits");
		var btnApplyFilterAndGroup = dijit.registry.byId("btnApplyFilterAndGroup");

		//set both handlers in initial local dataset load

		handlerChangeDatasetType = on(dijitfsDataType,"change", handleDatasetTypeChange);
		handlerChangeDatasetID = on(dijitfsDatasetID,"change", handleDatasetIDChange);
		on(toggle5xControl,"change",toggleExaggeration);
		on(yAxisSelect, "change", setYAxisDomain);
		on(topxSpinner, "change", setCurrentTopX);
		handlerChangeVariableUnit = on(fsVarUnit, "change", handleVariableUnitChange);
		on(genusGroup,"change", testHandler);//handleGenusGroupChange);

		on(dijitRBSymbolPlot,"change", handleFormChange);
		on(dijitRBBarChart,"change", handleFormChange);
		on(dijitRBFilledArea,"change", handleFormChange);

		on(btnApplyFilterAndGroup, "click", handleApplyFilterAndGroup)


		} catch(e) {
			console.log("Error in bindListeners" + e);
		}
	});
}
