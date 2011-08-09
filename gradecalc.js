$(function(){var i = 0; //counts the number of assignments
var noAssignments = true; //used to hide the assignments table till first row added
$('table#assign').hide(); //hide assignments table
var startCell = '<td><div style="display: none;">'; //put at beginning of each td cell
var endCell = '</div></td>'; //put at end of each td cell for animation hack
var digits = /^\d{0,3}$/;
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
        if (!digits.test(temp) || temp > 100) {
            noteOn('Please enter a number between 0 and 100');
            $(this).focus().select();
        }
        else {
            noteOff();
            $(this).val(temp);
        }
    });

    //Visually remove category from webpage
    $('button[class^="remove"]').click(function() {
        var categoryName = $(this).data('categoryName');
        console.log(categoryName);
        noteOn('going to remove ' + categoryName);
        var theTR = $(this).parentsUntil('tbody');
        var theTD = $(this).parentsUntil('tr');
        var tempVal = theTR.parent().html();
        theTR.find('td').each(function(i) {
            tempVal = $(this).html();
            $(this).replaceWith('<td><div class="removeMeNow" style="display:block">' + tempVal + '</div></td>');
        });

        $('.removeMeNow').animate({
            height: 0
        }, 500, function() {
            theTR.remove();
        });
    });

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
    if (!digits.test(temp) || temp > 100) {
        noteOn('Please enter a number between 0 and 100');
        $('input#newPercent').focus().select();
        return false;
    }
    else {
        $('input#newPercent').val(temp);
    }

    return true;
}
/////////////////////////////
//   END General functions
/////////////////////////////
//
/////////////////////////////
//   START Event Handling
/////////////////////////////
//Adds an assignment row
$("button#assign").click(function() {

    //display the table headings
    if (noAssignments) {
        noAssignments = false;
        $('table#assign').show();
    }

    //count assignment number
    i++;

    //setup some output
    var dropDownText = ' <input type="text" class="gradeCol" size="3" id="grade' + i + '" />';

    //setting up different cells
    var cell1 = startCell + '<span class="assignNum">Assignment ' + i + '</span>: ' + endCell;
    var cell2 = startCell + dropDownText + endCell;
    var cell3 = startCell + '<select>' + categoryHTML() + '</select>' + endCell;

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
    if (!digits.test(temp) || temp > 100) {
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


            updateEvents();
            $('input#newCatName').val('');
            $('input#newPercent').val('');
            $('.remove' + tempName).data('categoryName', tempName);
        }
    }
});
});
