import { Accelerometer } from "accelerometer";
import { display } from "display";
import document from "document";
import * as scientific from "scientific";
import { Logs } from "./utils";
import { Float32_3DValuesObject } from "./3DValues";

const accelLabel = document.getElementById("accel-label");
const accelData = document.getElementById("accel-data");
const accelMeanData = document.getElementById("accel-mean-data");
const accelMaxData = document.getElementById("accel-max-data");
const accelMinData = document.getElementById("accel-min-data");
const accelDataAlt = document.getElementById("accel-data-alt");
const btn = document.getElementById("btn");

const sensors = [];
 
const logger = new Logs(true,3); 


const DisplayInterval = 1; //Interval for Display, in seconds
const SamplingRateDisplay = 5; //Number of measurements per seconds
var NbMaxDisplayAccelValues = DisplayInterval * SamplingRateDisplay; //size of AccelValues buffer used for max, min and mean calculations
const LoggingInterval = 5; //Interval for data console logging, in seconds
const RecordingDuration = 2; //Duration for data recording, in seconds
const SamplingRateRecording = 2; //Number of measurements per seconds
const NbMaxRecordingAccelValues = RecordingDuration * SamplingRateRecording; //5, NUmber of recorded values, for later calculations

logger.Log(4,"NbMaxDisplayAccelValues: " + NbMaxDisplayAccelValues);
logger.Log(4,"NbMaxRecordingAccelValues: " + NbMaxRecordingAccelValues);
logger.Log(4,'In Index, typeof NbMaxDisplayAccelValues: ' + typeof NbMaxDisplayAccelValues);
logger.Log(4,'In Index, typeof NbMaxRecordingAccelValues: ' + typeof NbMaxRecordingAccelValues);


var DisplayAccelValuesObject = new Float32_3DValuesObject(NbMaxDisplayAccelValues); 
var RecordingAccelValuesObject = new Float32_3DValuesObject(NbMaxRecordingAccelValues);
logger.Log(4,"DisplayAccelValuesObject.NbMaxValues: " + DisplayAccelValuesObject.NbMaxValues);
logger.Log(4,"RecordingAccelValuesObject.NbMaxValues: " + RecordingAccelValuesObject.NbMaxValues);

var recordON = false;

if (Accelerometer) 
{
  const accelDisplay = new Accelerometer({ frequency: SamplingRateDisplay });
  accelDisplay.addEventListener("reading", () => 
  {
    DisplayAccelValuesObject.UpdateValuesRolling(accelDisplay);
  });
  sensors.push(accelDisplay);
  logger.Log(5,"Display Accelerometer added to sensors list.")
  accelDisplay.start();
  logger.Log(5,"Display Accelerometer started.")
  
  const accelRecord = new Accelerometer({ frequency: SamplingRateRecording });
  accelRecord.addEventListener("reading", () => 
  {
    if (recordON) {
      logger.Log(3,"Recording One Value!");
      RecordingAccelValuesObject.UpdateValuesRolling(accelRecord);
    }
  });
  sensors.push(accelRecord);
  logger.Log(5,"Record Accelerometer added to sensors list.")
  accelRecord.start();
  logger.Log(5,"Record Accelerometer started.")
} else {
  accelLabel.style.display = "none";
  accelData.style.display = "none";
}


//Logging Loop - uncomment next line to log to console at regular intervals
//setInterval(LoggingLoop,1000*LoggingInterval);

function LoggingLoop() {
  DisplayAccelValuesObject.LogValues();
}

btn.addEventListener("click", () => {
  logger.Log(4,"Button was pressed!");
  TriggerRecording();
});

function TriggerRecording() {
  //Data Recording Loop
  logger.Log(4,"Recording Start!");
  recordON = true;
  
  var id = setInterval(RecordingLoop,1000*(1/SamplingRateRecording));

  var i =0
  function RecordingLoop() {
    if (i == NbMaxRecordingAccelValues) {
      recordON = false;
      clearInterval(id);
      logger.Log(4,"Recording Ended.");
      logger.Log(4,"Recorded following accelerations:");
      logger.Log(4,JSON.stringify(RecordingAccelValuesObject));      
    }
    else {
      //RecordingAccelValuesObject.LogValues();
      logger.Log(4,"Currently Recording following accelerations:");
      logger.Log(4,JSON.stringify(RecordingAccelValuesObject));
      i++;
    }   
  }
  
}



//Diplay Loop
setInterval(DisplayDataLoop,1000*DisplayInterval);

function DisplayDataLoop() {
  //Update text fields
  UpdateTextAsJSON(accelData,DisplayAccelValuesObject.Instant);
  UpdateTextAsJSON(accelMeanData,DisplayAccelValuesObject.Mean);
  UpdateTextAsJSON(accelMaxData,DisplayAccelValuesObject.Max);
  UpdateTextAsJSON(accelMinData,DisplayAccelValuesObject.Min);
}

function UpdateTextAsJSON(AccelElement,AccelData) {
    AccelElement.text = JSON.stringify
    ({
      x: AccelData.x ? AccelData.x.toFixed(1) : 0,
      y: AccelData.y ? AccelData.y.toFixed(1) : 0,
      z: AccelData.z ? AccelData.z.toFixed(1) : 0
    });
}

function UpdateTextAsList(AccelElement,AccelData) {
  AccelElement.text = GetTextAsList(AccelData);
}

function GetTextAsList(_value){
  let outputstring = "";
  outputstring += "X=" + _value.x.toFixed(5).toString();
  outputstring += "\n";
  outputstring += "Y=" + _value.y.toFixed(5).toString();
  outputstring += "\n";
  outputstring += "Z=" + _value.z.toFixed(5).toString();
  return outputstring;
}

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
}); 