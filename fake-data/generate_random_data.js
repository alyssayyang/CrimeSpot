var fs = require('fs');



//get country_code_data as an array
// let csvToJson = require('convert-csv-to-json');
// let json = csvToJson.getJsonFromCsv("./bridgeport_crime_by_longitude_latitude_location.csv");


/*
const country_code_data = [];

for(const row of json){
    if(row['ISO-alpha3Code'] != ""){
        country_code_data.push(row['ISO-alpha3Code']);
    }
}

//get crime type array
const crime_type_data = ['violent crime','homicide','rape','robbery','aggravated assault','property crime','burglary','larceny','motor vehicle theft','caveats'];



//random function return random number between 0 to 1 inclusive
function getRandom() {
    return Math.random();
  }


//now need to generate random data

const result = [];

for(let i = 2000; i<2023; i++){
    for(let j = 0; j< country_code_data.length; j++){
        for(let m = 0; m <crime_type_data.length; m++){
            var data = {"crimetype": crime_type_data[m],"code":country_code_data[j],"year": i, "crimerate": getRandom()}
            result.push(data);
        }
    }
}

*/
const crime_type_data = ['violent crime','homicide','rape','robbery','aggravated assault','property crime','burglary','larceny','motor vehicle theft','caveats'];

const result = [];

//random function return random number between 0 to 1 inclusive
function getRandom() {
    return Math.random();
}


for(a = 0; a<10; a++){
    var d = '2007-05-06'
    var cur = {"a":500+a,"b":crime_type_data[a],"c":getRandom()*10,"d":d,"e":200+a,"f":200+a,"g":5000+a};
    result.push(cur);
}


//write my data to local json file
const myJsonString = JSON.stringify(result);
fs.writeFile("fakedata.txt", myJsonString, function(err) {
    if (err) {
        console.log(err);
    }
});





