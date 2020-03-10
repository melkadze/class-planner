const moment = require("moment");

console.log(m());

let m = moment();

//create from ISO 8601 String

m = moment("2020-03-06T11:31:00-04:00:00");

//using a format (how to parse)
m = moment("14/06/2019 4:50PM", "DD/MMM/YYYY h:mmA"); // figure out the format from here PARSE

//use milliseconds
m = moment(6000000);

const m = moment(); //current date and time

console.log(m.toString());

///getting units
console.log(m.minutes());
console.log(m.hour());
console.log(m.week());
console.log(m.get("quarter"));

// setting units
m.minutes(52);

//.uniz = you can use seconds

const m = moment(); //current date and time

console.log(`Original Moment: ${m.toString}`);

m.add(4, "h");

console.log(`After Manipulation: ${m.toString}`);

// UTC MODE
m = moment.utc();

console.log(`toString() => ${m.toString()}`); // local time zone
console.log(`toISOString() => ${m.toISOString()}`);

var myString = "03:15:00",
    myStringParts = myString.split(':'),
    hourDelta: +myStringParts[0],
    minuteDelta: +myStringParts[1];


date.subtract({ hours: hourDelta, minutes: minuteDelta});
date.toString()
// -> "Sat Jun 07 2014 06:07:06 GMT+0100"

// how to subtract time
let m = moment(); 

var time = moment.duration("00:03:15");
var date = moment("2014-06-07 09:22:06");
date.subtract(time);
let x = $('#MomentRocks').text(date.format())

console.log(`${x.minutes()} minutes left`);


// subtracting time !!! pleaassseeee !!!
var m = moment().format();
var time = m.utc(); 

var currentTime = moment.utc(startTime, "HH:mm");
var end = moment.utc(endTime, "HH:mm");

var d = moment.duration(end.diff(currentTime));
console.log(`${d} minutes left`); 