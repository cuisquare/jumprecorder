import * as scientific from "scientific";
import { Logs } from "./utils";

const logger = new Logs(true,4); 

export class Float32_3DValuesObject
{
  constructor(nbmaxval) { 
    logger.Log(4,"In Float32_3DValuesObject, nbmaxval: " + nbmaxval);
    logger.Log(4,'In Float32_3DValuesObject, typeof(nbmaxval): ' + typeof nbmaxval);
    this.InitialiseContent(nbmaxval);
    logger.Log(4," Float32_3DValuesObject.NbMaxValues: " + this.NbMaxValues);
  }
  
  InitialiseContent(nbmaxval) {
    this.Values = new Object();
    this.Values.timestamp = new Float32_ValuesObject(nbmaxval); 
    this.Values.x = new Float32_ValuesObject(nbmaxval); 
    this.Values.y = new Float32_ValuesObject(nbmaxval); 
    this.Values.z = new Float32_ValuesObject(nbmaxval);
  }  
  
  ClearContent() {
    if (!(this.NbMaxValues === "Undefined")) {
      this.InitialiseContent(this.NbMaxValues);
    }
    else {
      //warning message
    }
  }
 
  get NbMaxValues() {
    logger.Log(4," Float32_3DValuesObject.Values.x.NbMaxValues: " + this.Values.x.NbMaxValues);
    return this.Values.x.NbMaxValues;
  }
  
  get LastUpdatedIndex() {
    return this.Values.x.LastUpdatedIIndex;
  }
  
  UpdateValuesRolling(_value) {
    this.Values.timestamp.UpdateValuesRolling(_value.timestamp);
    this.Values.x.UpdateValuesRolling(_value.x);
    this.Values.y.UpdateValuesRolling(_value.y);
    this.Values.z.UpdateValuesRolling(_value.z);
  }
  
  get Instant() {
    var instant = new Object();
    instant.timestamp = this.Values.timestamp.Instant;
    instant.x = this.Values.x.Instant;
    instant.y = this.Values.y.Instant;
    instant.z = this.Values.z.Instant;
    return instant;    
  }
  
  get Mean() {
    var mean = new Object();
    mean.timestamp = this.Values.timestamp.Instant;
    mean.x = this.Values.x.Mean;
    mean.y = this.Values.y.Mean;
    mean.z = this.Values.z.Mean;
    return mean;
  }
  
  get Max() {
    var max = new Object();
    max.timestamp = this.Values.timestamp.Instant;
    max.x = this.Values.x.Max;
    max.y = this.Values.y.Max;
    max.z = this.Values.z.Max;;
    return max;
  }
  
  get Min() {
    var min = new Object();
    min.timestamp = this.Values.timestamp.Instant;
    min.x = this.Values.x.Min;
    min.y = this.Values.y.Min;
    min.z = this.Values.z.Min;;
    return min;
  }
  
  LogValues() {
      logger.Log(4,
        `ts: ${this.Instant.timestamp}, \
         type: ${"Instant Value"}, \
         x: ${this.Instant.x}, \
         y: ${this.Instant.y}, \
         z: ${this.Instant.z}`
      );
      logger.Log(4,
        `ts: ${this.Mean.timestamp}, \
         type: ${"Mean Value"}, \
         x: ${this.Mean.x}, \
         y: ${this.Mean.y}, \
         z: ${this.Mean.z}`
      );
      logger.Log(4,
        `ts: ${this.Instant.timestamp}, \
         type: ${"Mean - Instant Value"}, \
         x: ${this.Mean.x - this.Instant.x}, \
         y: ${this.Mean.y - this.Instant.y}, \
         z: ${this.Mean.z - this.Instant.z}`
      );
  }
}


class Float32_ValuesObject 
{ 
  constructor(nbmaxvalues) {
    this.NbMaxValues = nbmaxvalues; 
    this.InitialiseContent();
    logger.Log(4,"Float32_ValuesObject.NbMaxValues: " + this.NbMaxValues);
  }
 
  InitialiseContent() {
    this.LastUpdatedIndex=-1;
    this.Values = new Float32Array(this.NbMaxValues); 
  }
  
  get Instant() {
    return this.Values[this.LastUpdatedIndex];    
  }
  
  get Mean() {
    return scientific.mean(this.Values);    
  }
  
  get Max() {
    return scientific.max(this.Values);    
  }
  
  get Min() {
    return scientific.min(this.Values);    
  }
  
  UpdateValuesRolling(_value) {
    var i = (this.LastUpdatedIndex+1)%this.NbMaxValues;
    this.Values[i] = _value;
    this.LastUpdatedIndex = i;
  } 
}
