//sd-data-retrieval.js

/**@function getDatasetIDs
* Get endpoint for API datasets by datasettype and populate fsDatasetID datastore with returned set of dataset ids
* @param datasettype text 
* 
*/
/*
	function getDatasetIDs(datasettype){
		require(["dojo/request/xhr","dijit/registry", "dojo/store/Memory", "dojo/on"],function(xhr,registry,Memory,on){
		var uri;
		switch(datasettype){
			case "pollen":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./pollen_datasetids.json"
				break;
			case "ostracode":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./ostracode_datasetids.json"
				break;
			case "diatom":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./diatom_datasetids.json"
				break;
			case "vertebrate fauna":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./vertebratefauna_datasetids.json"
				break;	
			default:
				uri = "";//"./diatoms_datasetids.json";
				break;
		}
		 // get data for datasetid
                //xhr.get("http://api.neotomadb.org/v1/data/datasets?datasettype=pollen",
                //xhr.get("./diatoms_datasetids.json",  
                console.log("current dataset request: "+uri);
                xhr.get(uri,
                       {
                           handleAs: "json",
                           headers: {
                               "X-Requested-With": null
                           }
                       }
                   ).then(
                       function (response) {
                           if (response.success === 1) {
                               var fsDatasetIds = registry.byId("fsDatasetID");
                               var idStore = new Memory(
                                   {
                                       idProperty: "DatasetID",
                                       data: response.data
                                   }
                                ); 
                                fsDatasetIds.set("store", idStore);

                                   
								
                                if(defaultDatasetID){
                                	var curValue = idStore.get(defaultDatasetID);
                                	fsDatasetIds.set("value",curValue);
                                }
                                //add change listener

                                //handlerChangeDatasetID.remove();
                                //handlerChangeDatasetIDnew = on(fsDatasetIds,"change", handleDatasetIDChange);	

                               
                           } else {
                               alert("Error getting pollen datasetids");
                           }
                           
                       },
                       function (response) {
                       	   console.log("response is: "+response);
                           console.log("Error on server loading pollen datasets: " + response);
                       }
                   );
        })//end require           
	}

*/

		function getDatasetIDs(datasettype){
		require(["dojo/request/xhr","dijit/registry", "dojo/store/Memory", "dojo/on", "dojo/topic"],function(xhr,registry,Memory,on,topic){
		var uri;
		switch(datasettype){
			case "pollen":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./pollen_datasetids.json"
				break;
			case "ostracode":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./ostracode_datasetids.json"
				break;
			case "diatom":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./diatom_datasetids.json"
				break;
			case "vertebrate fauna":
				//uri = "http://api.neotomadb.org/v1/data/datasets?datasettype="+datasettype;
				//use static file
				uri = "./vertebratefauna_datasetids.json"
				break;	
			default:
				uri = "";//"./diatoms_datasetids.json";
				break;
		}
		 // get data for datasetid
                //xhr.get("http://api.neotomadb.org/v1/data/datasets?datasettype=pollen",
                //xhr.get("./diatoms_datasetids.json",  
                console.log("current dataset request: "+uri);
                xhr.get(uri,
                       {
                           handleAs: "json",
                           headers: {
                               "X-Requested-With": null
                           }
                       }
                   ).then(
                       function (response) {
                       		topic.publish("datasetselect/HideStandby")
                           if (response.success === 1) {
                               var fsDatasetIds = registry.byId("fsDatasetID");
                               var idStore = new Memory(
                                   {
                                       idProperty: "DatasetID",
                                       data: response.data
                                   }
                                ); 
                                fsDatasetIds.set("store", idStore);

                                   
								
                                if(defaultDatasetID){
                                	var curValue = defaultDatasetID;//idStore.get(defaultDatasetID);
                                	fsDatasetIds.set("value",curValue);
                                }
                                //add change listener

                                //handlerChangeDatasetID.remove();
                                //handlerChangeDatasetIDnew = on(fsDatasetIds,"change", handleDatasetIDChange);	

                               
                           } else {
                               alert("Error getting pollen datasetids");
                           }
                           
                       },
                       function (response) {
                       	   console.log("response is: "+response);
                           console.log("Error on server loading pollen datasets: " + response);
                       }
                   );
        })//end require           
	}
