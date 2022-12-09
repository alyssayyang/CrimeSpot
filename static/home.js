

//get the first button
document.getElementById('search_bt').addEventListener("click",handleClick);


function setUpFelonyDD(){
    var FelonyType = ['violent crime','homicide','rape','robbery','aggravated assault','property crime','burglary','larceny','motor vehicle theft','caveats'];

    var option = "";

    for(var i = 0; i<FelonyType.length;i++){
        option += '<option value="'+FelonyType[i]+'">' + FelonyType[i] + "</option>"
    }
    document.getElementById('dd_crimeType').innerHTML = option
}

setUpFelonyDD();


function setUpYearDD(){

    var option = "";
    for(var i = 2022; i>2000;i--){
        option +='<option value="'+i+'">' + i+ "</option>"
    }
    document.getElementById('dd_crimeyear').innerHTML = option
}

setUpYearDD();



function handleClick(){
    var type = document.getElementById('dd_crimeType').value;
    var year = document.getElementById('dd_crimeyear').value;

    console.log({type},{year})
}

//use check Status to handle reference error
const checkStatus = async(url) => {
    const response  = await fetch(url);
    //need to turn into check status function
    if(response.status !== 200){
        throw new ReferenceError('cannot fetch data');
    }
    data = await response.json();
    return data
}



