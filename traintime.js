// web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD7R4kQBEQmv6-5BvobIidESWvirnfRzsQ",
    authDomain: "time-d622e.firebaseapp.com",
    databaseURL: "https://time-d622e.firebaseio.com",
    projectId: "time-d622e",
    storageBucket: "",
    messagingSenderId: "1098469651862",
    appId: "1:1098469651862:web:73dc14b5fa6822df"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var trainData = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault()
        // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Creates object for holding train data
    var newTrain = {

        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    console.log("HERE", newTrain)

    // Uploads train data to the database
    trainData.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // Alert
    alert("Train added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

    //  the next train arrives.
    return false;
});

//Creating Firebase event

trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;


    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment().max(moment(), trainTime);
    var tMinutes;
    var tArrival;
    //if else situations
    // If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {

        // Calculate the minutes until arrival using hardcore math
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
        tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});