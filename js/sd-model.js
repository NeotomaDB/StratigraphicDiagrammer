//sd-model.js
/*global vars
metadata - data domain for properties of the displayed data and current selections displayed
strataYScale:
strataXScale:
yAxis:
colors20 = d3.scaleOrdinal(d3.schemeCategory10);
taxaline: function to render svg line; input 
taxaarea: function to render svg area
taxaline5x: render function
taxaarea5x: render function
yAxisParameter:  text, Depth or name of Chronology
currentDatasetType: text 

datasetID = 17851;//17723; //initial datasetID


//data model - 

sampleData:
sampleData:
SampleIDMap:
summaryDataBySampleID:
currentChronologyName:
taxaRenderObjects:
sortedtaxaRenderObjects:
*/
		

/**@function setVariableUnit
* Given VariableUnit, set x-scale 
* @param datasettype text 
* 
*/
function setVariableUnit(value){
		if(!value){
			//todo: set default variableUnit by preference rules 
			//check if NISP values exist
			var found = metadata.allvarunits.find(function(d){
				return d == "NISP"})
			//set variable to NISP if available, else first one found
			found ? metadata.variableunit = "NISP" : metadata.variableunit = metadata.allvarunits[0]; 
		} else {
			metadata.variableunit = value;
		}

		/////metadata.variableUnit = "NISP";
		metadata.xscaleinput = "value";

		//set x-axis-label by variableunit
		switch(metadata.variableunit){
			//number of individual specimens
			case "NISP":
				metadata.xscaleinput = "abundance";
				break;
			case "valves/g":
				//todo, should use "concentration"
				metadata.xscaleinput = "valves/g";
				break;
			case "present/absent":
				metadata.xscaleinput = "presence";
				break;
			//minimum number of individuals
			case "MNI":
				metadata.xscaleinput = "value";
				break;
			case "Spaulding scale":
				metadata.xscaleinput = "spaulding scale";
				break;	
			default:
				console.log("Error: VariableUnit not set; default NISP");
				metadata.xscaleinput = "abundance";
				break;

		}
		
	}
