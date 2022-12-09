var fs = require('fs');

//get country_code_data as an array
let csvToJson = require('convert-csv-to-json');
let json = csvToJson.getJsonFromCsv("./Methodology.csv");
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

//write my data to local json file
const myJsonString = JSON.stringify(result);
fs.writeFile("fakedata.txt", myJsonString, function(err) {
    if (err) {
        console.log(err);
    }
});


