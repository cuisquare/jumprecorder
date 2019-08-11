export class Logs {
  //LogImportanceLevel Current Log Importance Level - log requests with importance >= will be fulfilled - reduce to increase log
  constructor(logging,logimportancelevel) {
    this.Logging = logging;
    this.LogImportanceLevel = logimportancelevel;
  }

  Log(importance,message) 
  {
    if (importance >= this.LogImportanceLevel) 
    {
      this.LogIfLogging(this.Logging,message);
    }
  }

  LogIfLogging(_logging,message) 
  {
    if (_logging) 
      {
        console.log(message);
      }
  }
}




