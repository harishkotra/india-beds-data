/*
Function to pull the summary. 
*/
function pullData() {
  
  // empty values to store summary information and state wise information
  var summaryValues = [];
  var values = [];
  var start, end;
  
  var spreadsheet = SpreadsheetApp.getActive();
  var summarySheet = spreadsheet.getSheetByName("Summary");
  var statesSheet = spreadsheet.getSheetByName("State Wise Data");
  
  
  //clear values before fetching updated information
  start = 2;
  end = statesSheet.getLastRow() - 1;
  statesSheet.deleteRows(start, end);

  
  // call API
  var response = UrlFetchApp.fetch("https://api.rootnet.in/covid19-in/hospitals/beds");
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var summary = data["data"]["summary"];
  
  // get source information
  var sources = data["data"]["sources"][0];
  
  //get last updated date value
  var lastUpdatedOn = data["lastRefreshed"];
  
  // get statewise information
  var results = data["data"]["regional"];
  
  //parse state wise data values with a forEach loop since it is an array
  results.forEach(function(item) {
    if(item["state"] != "INDIA") {
      values.push([item["state"], item["ruralHospitals"], item["ruralBeds"], item["urbanHospitals"], item["urbanBeds"], item["totalHospitals"], item["totalBeds"], item["asOn"]]);
    }
  });
  
  summaryValues.push([summary["ruralHospitals"], summary["ruralBeds"], summary["urbanHospitals"], summary["urbanBeds"], summary["totalHospitals"], summary["totalBeds"], sources["url"], lastUpdatedOn]);
  summarySheet.deleteRow(2);
  summarySheet.getRange(summarySheet.getLastRow()+1, 1, summaryValues.length, summaryValues[0].length).setValues(summaryValues);
  
  //push state wise data into the sheet
  statesSheet.getRange(statesSheet.getLastRow()+1, 1, values.length, values[0].length).setValues(values);
  
}


//menu item
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('API Functions')
    .addItem('Refresh Data', pullData)
    .addToUi();
}
