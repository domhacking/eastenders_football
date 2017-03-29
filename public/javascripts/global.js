// Variables
var $table = $('#table');
var playersObject = {};

function updatePoints() {
	event.preventDefault();

	var teamOnePlayers = document.querySelectorAll('.tile--team-one .tile__list .playername');

	teamOnePlayers.forEach(function(element){
		var playernameText = element.innerHTML;

	    var updatedPlayer = {
	        'playername': playernameText,
	    }

		$.ajax({
			type: 'PUT',
			data: updatedPlayer,
			url: '/players/updateplayer',
			dataType: 'JSON'
		})
	});
};

function detailFormatter(index, row) {
    var html = [];
	html.push('<p><b>totalpoints</b> ' + row.totalpoints + '</p></br>');
	html.push('<p><b>totalpoints</b> ' + row.gamesplayed + '</p></br>');

    $.each(row, function (key, value) {
		console.log(key, value);

    });
    return html.join('');
}

var el = document.getElementById('teampicker');

Sortable.create(el, {
	animation: 150,
	draggable: '.tile',
	handle: '.playername'
});

[].forEach.call(el.getElementsByClassName('tile__list'), function (el){
	Sortable.create(el, {
		group: 'photo',
		animation: 150
	});
});


// $('.submit-win').on('click', updatePoints);


// $('#btnAddUser').on('click', addUser);

// // Add User
// function addUser(event) {
//     console.log('hello');
//     event.preventDefault();
//
//     // Super basic validation - increase errorCount variable if any fields are blank
//     var errorCount = 0;
//     $('#addUser input').each(function(index, val) {
//         if($(this).val() === '') { errorCount++; }
//     });
//
//     // Check and make sure errorCount's still at zero
//     if(errorCount === 0) {
//
//         // If it is, compile all user info into one object
//         var newPlayer = {
//             'playername': $('#addUser fieldset input#inputUserName').val(),
//             'gamesplayed': $('#addUser fieldset input#inputUserEmail').val(),
//             'totalpoints': $('#addUser fieldset input#inputUserFullname').val(),
//             'averagepoints': $('#addUser fieldset input#inputUserAge').val(),
//             'averagesubtractedpoints': $('#addUser fieldset input#inputUserLocation').val(),
//         }
//
//         // Use AJAX to post the object to our adduser service
//         $.ajax({
//             type: 'POST',
//             data: newPlayer,
//             url: '/players/addplayer',
//             dataType: 'JSON'
//         }).done(function( response ) {
//             console.log('data base updated', newPlayer);
//         });
//     }
//     else {
//         // If errorCount is more than 0, error out
//         alert('Please fill in all fields');
//         return false;
//     }
// };





// var win = document.querySelector('.submit-win');

// win.on('click', addResult());

// function addResult(){
//
//         // If it is, compile all user info into one object
//         var newUser = {
//             'username': $('#addUser fieldset input#inputUserName').val(),
//             'email': $('#addUser fieldset input#inputUserEmail').val(),
//             'fullname': $('#addUser fieldset input#inputUserFullname').val(),
//             'age': $('#addUser fieldset input#inputUserAge').val(),
//             'location': $('#addUser fieldset input#inputUserLocation').val(),
//             'gender': $('#addUser fieldset input#inputUserGender').val()
//         }
//
//         // Use AJAX to post the object to our adduser service
//         $.ajax({
//             type: 'PUT',
//             data: newUser,
//             url: '/users/adduser',
//             dataType: 'JSON'
//         }).done(function( response ) {
//             console.log('database updated');
//         });
// }
