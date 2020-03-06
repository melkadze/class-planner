const moment = require("moment");

console.log(m());

let m = moment();

console.log(`toString() => ${m.toString()}`); // local time zone
console.log(`toISOString() => ${m.toISOString()}`);

//create from ISO 8601 String

m = moment("2020-03-06T11:31:00");
