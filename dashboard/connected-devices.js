src = "https://www.gstatic.com/firebasejs/5.8.4/firebase-app.js"
src = "https://www.gstatic.com/firebasejs/5.8.4/firebase-auth.js"
src = "https://www.gstatic.com/firebasejs/5.8.4/firebase-database.js"
src = "https://www.gstatic.com/firebasejs/5.8.4/firebase-firestore.js"
src = "https://www.gstatic.com/firebasejs/5.8.4/firebase-messaging.js"
src = "https://www.gstatic.com/firebasejs/5.8.4/firebase-functions.js"

//Firebase configuration
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC-vZnOFnjnZbIHfMJFaXPhPSxY65w64uM",
    authDomain: "iotssc.firebaseapp.com",
    databaseURL: "https://iotssc.firebaseio.com",
    projectId: "iotssc",
    storageBucket: "iotssc.appspot.com",
    messagingSenderId: "628664425338"
});


var client = new Keen({
    projectId: '5337e28273f4bb4499000000',
    readKey: '8827959317a6a01257bbadf16c12eff4bc61a170863ca1dadf9b3718f56bece1ced94552c6f6fcda073de70bf860c622ed5937fcca82d57cff93b432803faed4108d2bca310ca9922d5ef6ea9381267a5bd6fd35895caec69a7e414349257ef43a29ebb764677040d4a80853e11b8a3f'
});

var geoProject = new Keen({
    projectId: '53eab6e12481962467000000',
    readKey: 'd1b97982ce67ad4b411af30e53dd75be6cf610213c35f3bd3dd2ef62eaeac14632164890413e2cc2df2e489da88e87430af43628b0c9e0b2870d0a70580d5f5fe8d9ba2a6d56f9448a3b6f62a5e6cdd1be435c227253fbe3fab27beb0d14f91b710d9a6e657ecf47775281abc17ec455'
});

//This will set the counting timestamp at the top of the page
function updateDisplay(Todays1) {
    $('#day').html(date_time('day').toString());
}

//This function will update the cards with meaningful informtion
function getAUXInformationCallBack(day, month, time) {
    $('#mostPopularTime').html(time.toString());
    $('#mostPopularMonth').html(month.toString());
    $('#mostPopularDay').html(day.toString());
}

//This function will get auxilarily information for the information cards
function getAUXInformation() {
    var db = firebaseApp.firestore();
    const comments = [];
    var docRef = db.collection("AUX").doc("INFO");
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var MOST_POPULAR_DAY = doc.data()['DAY'];
            var MOST_POPULAR_MONTH = doc.data()['MONTH'];
            var MOST_POPULAR_TIME = doc.data()['TIME'];
            getAUXInformationCallBack(MOST_POPULAR_DAY, MOST_POPULAR_MONTH, MOST_POPULAR_TIME);
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//This function will get yesterdays date
function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear();
}

//This function will get todays date
function getTodaysDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0 otherwise
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = dd + mm + yyyy;
    return today;
}

//This function returns a timestamp
function date_time(id) {
    date = new Date;
    year = date.getFullYear();
    month = date.getMonth();
    months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
    d = date.getDate();
    day = date.getDay();
    days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    h = date.getHours();
    if (h < 10) {
        h = "0" + h;
    }
    m = date.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    s = date.getSeconds();
    if (s < 10) {
        s = "0" + s;
    }
    result = '' + days[day] + ' ' + months[month] + ' ' + d + ' ' + year + ' ' + h + ':' + m + ':' + s;
    document.getElementById(id).innerHTML = result;
    setTimeout('date_time("' + id + '");', '1000');
    return true;
}

//This function gets the date one week ago
function getDateONEWEEKAGO() {
    var onceWeekAgo = new Date();
    return (oneWeekAgo.getDate() - 7);
}

//This function gets the today for today
function getTotalToday() {
    var db = firebaseApp.firestore();
    const comments = [];
    //This will get the most popular time
    var docRef = db.collection("PROCESSED").doc(String(getTodaysDate()));
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var theData = doc.data()['TOTALTODAY'];
            totalToday = doc.data()['TOTALTODAY'];
            return theData;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//Function to return the date
function myFunction() {
    var d = new Date();
    var n = d.getDay()
    return n;
}

Keen.ready(function() {

    /*
    Upated the dial for the total in today
    */
    function updateTotalTodayIn(a) {
        $('.TotalInToday').knob({
            angleArc: 250,
            angleOffset: -125,
            readOnly: true,
            min: 0,
            max: 1000,
            fgColor: '#b71c1c',
            height: 290,
            width: '95%'
        });

        geoProject
            .query('count_unique', {
                event_collection: 'activations',
                target_property: 'user.id'
            })
            .then(function(res) {
                $('.TotalInToday').val(a).trigger('change');
            })
            .catch(function(err) {
                alert('An error occurred fetching New Activations metric');
            });
    }

    /*
    Upated the dial for the total in this hour
    */

    function updateTotalInHour(a) {
        $('.TotalInThisHour').knob({
            angleArc: 250,
            angleOffset: -125,
            readOnly: true,
            min: 0,
            max: 1000,
            fgColor: '#311b92',
            height: 290,
            width: '95%'
        });
        geoProject
            .query('count_unique', {
                event_collection: 'activations',
                target_property: 'user.id'
            })
            .then(function(res) {
                $('.TotalInThisHour').val(a).trigger('change');
            })
            .catch(function(err) {
                alert('An error occurred fetching New Activations metric');
            });
    }


    //This function sets the dial for the total people currently in the room
    function setTotalToday(theData) {
        $('.users').knob({
            angleArc: 250,
            angleOffset: -125,
            readOnly: true,
            min: 0,
            max: 1000,
            fgColor: '#006064',
            height: 290,
            width: '95%'
        });
        console.log("numberofPeopleintODAY", theData);
        geoProject
            .query('count_unique', {
                event_collection: 'activations',
                target_property: 'user.id'
            })
            .then(function(res) {
                $('.users').val(theData).trigger('change');
            })
            .catch(function(err) {
                alert('An error occurred fetching New Activations metric');
            });
    }


    //
    // ----------------------------------------
    // Errors Detected
    // ----------------------------------------

    $('.errors').knob({
        angleArc: 250,
        angleOffset: -125,
        readOnly: true,
        min: 0,
        max: 1000,
        fgColor: '#fe6672',
        height: 290,
        width: '95%'
    });

    function getTotalAverage() {
        //Need to investigate
        var db = firebaseApp.firestore();
        const comments = [];
        //This will get the most popular time
        var docRef = db.collection("AUX").doc("AVERAGES");
        docRef.get().then(function(doc) {
            if (doc.exists) {
                updateBarDays(doc.data())
                $('.users').knob({
                    angleArc: 250,
                    angleOffset: -125,
                    readOnly: true,
                    min: 0,
                    max: 1000,
                    fgColor: '#00bbde',
                    height: 290,
                    width: '95%'
                });
                //console.log("day", date_time('day').toString());
              /*  var d = new Date();
                var day = d.getDay();
                if (day == 0) {
                    var theData = doc.data()["Monday"];
                } else if (day == 1) {
                    var theData = doc.data()["Tuesday"];
                } else if (day == 2) {
                    var theData = doc.data()["Wednesday"];
                } else if (day == 3) {
                    var theData = doc.data()["Thursday"];
                } else if (day == 4) {
                    var theData = doc.data()["Friday"];
                } else if (day == 5) {
                    var theData = doc.data()["Saturday"];
                } else if (day == 6) { */
                    var theData = doc.data()["Thursday"];
              //  }
                console.log("Thursday Data", theData);
                geoProject.query('count', {
                        event_collection: 'user_action',
                        filters: [{
                            property_name: 'error_detected',
                            operator: 'eq',
                            property_value: true
                        }]
                    })
                    .then(function(res) {
                        console.log("theData", theData);
                        $('.errors').val(theData).trigger('change');
                    })
                    .catch(function(err) {
                        alert('An error occurred fetching Device Crashes metric');
                    });
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }


    /*
    This function will update the bar graph at the bottom left with the new data
    */
    function updateBarDays(theData) {
        monthlyStats = theData;
        var Monday = monthlyStats['Monday'];
        var Tuesday = monthlyStats['Tuesday'];
        var Wednesday = monthlyStats['Wednesday'];
        var Thursday = monthlyStats['Thursday'];
        var Friday = monthlyStats['Friday'];
        var Saturday = monthlyStats['Saturday'];
        var Sunday = monthlyStats['Sunday'];
        var sample_funnel = new Keen.Dataviz()
            .el('#chart-05')
            .colors(['#ffa500'])
            .data({
                result: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
            })
            .height(340)
            .type('bar')
            .labels(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday", "Sunday"])
            .title(null)
            .render();
    }

    function hourlyStats() {
        var db = firebaseApp.firestore();
        var docRef = db.collection("AUX").doc("TODAY");
        docRef.get().then(function(doc) {
            if (doc.exists) {
                var theData = doc.data();
                st = theData;

                var d = new Date();
                var hour = d.getHours();
                if (hour < 9) {
                    hour = "0" + hour + ":00";
                } else {
                    hour = hour + ":00";
                }

                setTotalToday(doc.data()['CURRENT_OCCUPANCY']);
                updateTotalTodayIn(st['NUMBER_OF_PEOPLE_IN_TODAY']);
                updateTotalInHour(st[hour]);

                var sample_funnel = new Keen.Dataviz()
                    .el('#chart-06')
                    .colors(['#00cfbb'])
                    .data({
                        result: [st['00:00'], st['01:00'], st['02:00'], st['03:00'], st['04:00'], st['05:00'], st['06:00'], st['07:00'], st['08:00'], st['09:00'], st['10:00'],
                            st['11:00'], st['12:00'], st['13:00'], st['14:00'], st['15:00'], st['16:00'], st['17:00'], st['18:00'], st['19:00'], st['20:00'], st['21:00'], st['22:00'], st['23:00']
                        ]
                    })
                    .height(340)
                    .type('bar')
                    .labels(['00:00', '01:00', '02:00', '03:00', '04:00', "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"])
                    .title(null)
                    .render();
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    foo();

    function foo() {
        getAUXInformation();
        updateDisplay();
        getTotalAverage();
        hourlyStats();
        setTimeout(foo, 5000); //Recursively call this function every 5 seconds
    }

});
