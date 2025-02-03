import { createObjectCsvStringifier, createObjectCsvWriter } from "csv-writer";

export function createCSV(data:any, headers:any[]){
    // console.log("in csv data", data);
    let newData = [];
    data.forEach(d=>Array.isArray(d.errorMsg)? newData.push({...d, errorMsg:JSON.stringify(d.errorMsg)}):newData.push(d));
    // console.log("newData===>", newData);    
    const csvStringifier = createObjectCsvStringifier({
      header: headers
    });
    const header = csvStringifier.getHeaderString();
    const records = csvStringifier.stringifyRecords(newData);
    const csvData = header + records;
    return csvData;
  }