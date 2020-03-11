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

// var currentTime = moment.utc(startTime, "HH:mm");
var end = moment.utc(endTime, "HH:mm");

var d1 = moment.duration(end.diff(p1));
console.log(`${d1} minutes left in Period One`); 

const PeriodOne = "08:41:00";
var p1 = moment.utc(PeriodOne); 
const PeriodTwo = "09:26:00";
var p2 = moment.utc(PeriodTwo);
const PeriodThree = "10:17:00";
var p3 = moment.utc(PeriodThree);
const PeriodFour = "11:02:00";
var p4 = moment.utc(PeriodFour);
const PeriodFive = "11:48:00";
var p5 = moment.utc(PeriodFive);
const PeriodSix = "12:32:00";
var p6 = moment.utc(PeriodSix);
const PeriodSeven = "13:17:00";
var p7 = moment.utc(PeriodSeven);
const PeriodEight = "14:01:00";
var p8 = moment.utc(PeriodEight);
const PeriodNine = "14:47:00";
var p9 = moment.utc(PeriodNine);
