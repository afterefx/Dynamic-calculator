/************
 * Dynamic Grade Calculator
 * Written by: Christopher Carlisle @ (carlic578 at gmail dot com)
 */
$(function() {
var numberOfAssignments = 1; //counts the number of assignments
var startCell = '<td><div style="display: none;">'; //put at beginning of each td cell
var endCell = '</div></td>'; //put at end of each td cell for animation hack
var digits = /^[0-9]+(.[0-9]+)?$/;
var regText = /^[\w\s]*$/;
//NOTE: data for category name and percentage are associated with table#cat

///////////////////////////////////
//         General functions
//////////////////////////////////

//Generates the html for the select areas with the categories
function categoryHTML() {
    var output = "";
    var tempCatNames = $('table#cat').data();
    var i;
    output += '<option>--</option>';

    for (i in tempCatNames) {
        if (1) {
            output += '<option>' + i + '</option>';
        }
    }
    return output;
}

// Turns on notification message at top of the page
// Args: (message) Contains the message to be displayed
function noteOn(message) {
    $('.notification').text(message);
    if ($('.notificationArea').css('display') == "none") {
        $('.notificationArea').slideDown();
    }
}

// Turns off the notification message at the top of the page
function noteOff() {
    if ($('.notificationArea').css('display') == "block") {
        $('.notificationArea').slideUp();
    }
}

$('span.assignNum').click(function() {
        var temp = $(this).html();
        $(this).replaceWith('<input type="text" class="assignNum" value="' + temp + '" />');
        $('input.assignNum').focus().select();
        updateEvents();
});

// Event handler function, run after each page update to reassociate events
function updateEvents() {
    //Click event for span of assignment name to make the assignment label editable
    $('span.assignNum').click(function() {
        var temp = $(this).html();
        $(this).replaceWith('<input type="text" class="assignNum" value="' + temp + '" />');
        $('input.assignNum').focus().select();
        updateEvents();
    });

    //Blur event to receive text and place label for the assignment name
    $('input.assignNum').blur(function() {
        var temp = $(this).val();
        if ($.trim(temp) === "") {
            temp = "Assignment";
        }
        if (!regText.test(temp)) {
            noteOn('Only letters and numbers may be used.');
            $(this).focus().select();
        }
        else {
            noteOff();
            $(this).replaceWith('<span class="assignNum">' + temp + '</span>');
            updateEvents();
        }
    });

    //Check for a grade on an assignment to see that it is based on a 100 point scale
    $('input.gradeCol').blur(function() {
        var temp = $.trim($(this).val());
        if (!digits.test(temp) ) {
            noteOn('Please enter a number between 0 and 100');
            $(this).focus().select();
            return;
        }
        temp = parseFloat(temp);
        if( temp < 0 || temp > 100) {
            noteOn('Please enter a number between 0 and 100');
            $(this).focus().select();
        }
        else {
            noteOff();
            $(this).val(temp);
        }
    });
}

function rewriteCategorySelectBoxes(removedVal) {
    var i=1;
    var holdTemp; //holds selection temporarily
    var innerStuff = categoryHTML();
    for( i=1; i <=numberOfAssignments; i++) {
      holdTemp = $('#select'+ i).val(); //get the selected value

      //rewrite the html for the select
      $('#select'+ i).html(innerStuff);

      if ( holdTemp == removedVal )
          $('#select'+ i).val('--');
      else
          $('#select'+ i).val(holdTemp);
    }
}

function sumLess100(newPercent) {
    var tempCatNames = $('table#cat').data();
    var sum=0;
    var currentValueNum=0;
    var t;
    for (t in tempCatNames) {
        if(t != "--") {
            currentValueNum = $('table#cat').data(t);
            sum += parseFloat(currentValueNum);
        }
    }
    sum += parseFloat(newPercent);
    if(sum > 100)
        return false;
    else
        return true;
}

function checkCatsAddTo100() {
    var tempCatNames = $('table#cat').data();
    var sum=0;
    var currentValueNum=0;
    var t;
    for (t in tempCatNames) {
        if(t != "--") {
            currentValueNum = $('table#cat').data(t);
            sum += parseFloat(currentValueNum);
        }
    }

    if(sum == 100)
        return true;
    else
        return false;
}

////////////////////////////////////////////
// checkCatInputs()
// Validates data for category information input
// returns true or false
////////////////////////////////////////////
function checkCatInputs() {
    //Validates user input for category name
    var temp = $('input#newCatName').val();
    if (!regText.test(temp)) {
        noteOn('Only letters and numbers may be used.');
        $('input#newCatName').focus().select();
        return false;
    }


    temp = $.trim($('input#newPercent').val());
    temp = parseFloat(temp);
    if (!digits.test(temp) || temp < 0 || temp > 100) {
        noteOn('Please enter a number between 0 and 100');
        $('input#newPercent').focus().select();
        return false;
    }
    else {
        $('input#newPercent').val(temp);
    }

    return true;
}

function catNameExists(temp) {
    if( $('table#cat').data(temp) != undefined) {
        noteOn('Please pick a category name that does not already exist.');
        return true;
    }
    else
        return false;
}

/////////////////////////////
//   END General functions
/////////////////////////////

/////////////////////////////
//   START Event Handling
/////////////////////////////

//Adds an assignment row
$("button#assign").click(function() {
    //count assignment number
    numberOfAssignments++;

    //setup some output
    var dropDownText = ' <input type="text" class="gradeCol" size="3" id="grade' + numberOfAssignments + '" />';

    //setting up different cells
    var cell1 = startCell + '<span class="assignNum">Assignment ' + numberOfAssignments + '</span>: ' + endCell;
    var cell2 = startCell + dropDownText + endCell;
    var cell3 = startCell + '<select id="select' + numberOfAssignments + '">' + categoryHTML() + '</select>' + endCell;

    //output the new row
    $('table#assign').append('<tr>' + cell1 + cell2 + cell3 + '</tr>');


    //reveal the row with slide down animation then remove the div for only
    //the row html
    $('table#assign tr:last div').slideDown('fast', function() {
        $(this).replaceWith(
        $(this).contents());
    });

    updateEvents();
});


//Validates user input for category name
$('input#newCatName').blur(function() {
    var temp = $(this).val();
    if (!regText.test(temp)) {
        noteOn('Only letters and numbers may be used.');
        $(this).focus().select();
    }

});

//Validates user input for category percentage
$('input#newPercent').blur(function() {
    var temp = $.trim($(this).val());
    temp = parseFloat(temp);
    if (!digits.test(temp) || temp < 0 || temp > 100) {
        noteOn('Please enter a number between 0 and 100');
        $(this).focus().select();

    }
    else {
        $(this).val(temp);
    }

});


//Add a category button
$("button#addCat").click(function() {
    if (checkCatInputs()) {
        var tempName = $('input#newCatName').val();
        var tempPercent = $('input#newPercent').val();

        //Remove any trailing whitespace at the end of the category name
        tempName = tempName.replace(/\s+$/, '');
        tempName = tempName.replace(/\s+/, ' ');
        ///^\w+(\s\w+)*$/

        if(sumLess100(tempPercent)) {
            if(!catNameExists(tempName)) {
                var cell1 = startCell + tempName + endCell;
                var cell2 = startCell + tempPercent + "%" + endCell;
                var cell3 = startCell + "<button class=\"remove" + tempName + "\" id=\"" + tempName + "\">Remove " + tempName + "</button>" + endCell;

                if ($.trim(tempName) === "") {
                    noteOn("Please insert a category name.");
                    $('input#newCatName').focus();
                }
                else if ($.trim(tempPercent) === "") {
                    noteOn("Please insert a percentage.");
                    $('input#newPercent').focus();
                }
                else {
                    noteOff();
                    $('table#cat').append('<tr>' + cell1 + cell2 + cell3 + '</tr>');
                    $('table#cat').data(tempName, tempPercent); //added to data dictionary
                    $('table#cat tr:last div').slideDown('fast', function() {
                    $(this).replaceWith(
                    $(this).contents());
                    });

                    //append option should be use
                    $("select").append('<option>' + $('input#newCatName').val() + '</option>');

                    //add click event to remove category here
                    $('.remove'+tempName).click(function() {
                        var categoryName = $(this).data('categoryName'); //grab category name
                        $('table#cat').removeData(categoryName); //remove data from categories
                        var theTR = $(this).parentsUntil('tbody'); //find DOM object
                        var theTD = $(this).parentsUntil('tr'); //find DOM object
                        var tempVal = theTR.parent().html(); //grab some html
                        theTR.find('td').each(function(i) { //go to the td and start replacing to setup animation
                            tempVal = $(this).html();
                            $(this).replaceWith('<td><div class="removeMeNow" style="display:block">' + tempVal + '</div></td>');
                        });

                         //animate the removal of the cateogry
                        $('.removeMeNow').animate({ height: 0 }, 500, function() {
                            theTR.remove();
                        });

                        //rewrite the select options for categories on the grade rows.
                        //(This removes what the category as an option for the grade.)
                        rewriteCategorySelectBoxes(categoryName);
                    });

                    $('input#newCatName').val('');
                    $('input#newPercent').val('');
                    $('.remove' + tempName).data('categoryName', tempName);
                }
            }
        }
        else
        { noteOn('You cannot have over 100% for the sum of your categories');}
    }
});

    $('button#calculate').click(function() {
        if(checkCatsAddTo100()) {
            var grade=0; //will be used for the grade
            var tempCatNames = $('table#cat').data(); //list of category names
            var i; //used to temp store a value from the tempCatNames obj.
            var j=1; //used to loop through all assignment grades
            var currentSum; //used to keep track of current categories sum
            var currentNumGrades; //used to keep track of the current count of grades used
            var currentValue; //used to hold current grade that has been parsed as a float
            var catAvg=0; //used to store the categories average
            var tempSelectedVal; //used to grab selected value for the `select` being looked at
            var tempPartSum; //used to temporarily hold the part of the sum we are adding in

            //for each category
            for (i in tempCatNames) {
                currentNumGrades=0; //reset to 0 for each category
                currentSum=0; //reset to 0 for each category
                catAvg=0; //reset to 0 for each cateogory
                tempPartSum=0;

                if (1) {
                    //go through each `#idn` where `n` is the current row
                    for(j=1; j <= numberOfAssignments; j++) {

                        //reset to 0 for each row
                        currentValue=0;

                        //get the selected value
                        tempSelectedVal = $('#select'+ j).val();

                        //if selected category in the select == `i` then grab `#graden` where `n` is the current row
                        if(tempSelectedVal == i) {
                            currentValue = parseFloat($('#grade'+ j).val());

                            //add to `currentSum`
                            currentSum += currentValue;

                            //increment total count of grades
                            currentNumGrades++;
                        }
                    }
                    //divide by number of assignments with that assigned category
                    if(currentNumGrades == 0) {
                        noteOn("You must have least one grade for each category");
                        return;
                    }
                    else
                        catAvg = currentSum/currentNumGrades;

                    //multiply by the category percentage
                    tempPartSum = catAvg * ($('table#cat').data(i)/100);

                    //add to main sum
                    grade += tempPartSum;
                }

            }
            grade = grade.toFixed(2);

            //display the grade
            $('span#grade').text(grade);
        }
        else
            noteOn("Your categories percentages must add up to 100%.");

    });

updateEvents();
});
