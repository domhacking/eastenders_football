(function(){
	var playersObject = {};

	$.get('/players/playerslist', function(data){
		playersObject = data;
		// console.log('new', typeof(playersObject[0].gamesplayed));
		startapp();
	});

	function startapp(){

		// Variables
		var $table = $('#table');
		var teamOnePlayers;
		var teamTwoPlayers;


		displayTeam();

		// Check to see which players have been selected on each team
		function queryTeams(){
			teamOnePlayers = document.querySelectorAll('.tile--team-one .tile__list .player .playername');
			teamTwoPlayers = document.querySelectorAll('.tile--team-two .tile__list .player .playername');

			var modalTeamListOne = '';
			var modalTeamListTwo = '';

			teamOnePlayers.forEach(function(element){
				modalTeamListOne +='<p>' + element.innerHTML + '</p>';
			});

			teamTwoPlayers.forEach(function(element){
				modalTeamListTwo +='<p>' + element.innerHTML + '</p>';
			});

			$('.teamone-modal').html(modalTeamListOne);
			$('.teamtwo-modal').html(modalTeamListTwo);
		}

		function updateResult() {
			var result = $(this).data("attribute");

			if (result === 'teamOne'){
				var winningPlayers = teamOnePlayers;
				var losingPlayers = teamTwoPlayers;
			} else if (result === 'teamTwo'){
				var winningPlayers = teamTwoPlayers;
				var losingPlayers = teamOnePlayers;
			} else {
				var drawnPlayers = teamOnePlayers.concat(teamTwoPlayers)

				drawnPlayers.forEach(function(element){
					var playernameText = element.innerHTML;

					Object.keys(playersObject).forEach(function(key){
						var player = playersObject[key];

						if ( playernameText == player.playername) {
							player.gamesdrawn += 1;
							player.gamesplayed += 1;
							player.totalpoints += 1;
							player.averagesubtractedpoints += 1;
						}
					})
				});
			}

			winningPlayers.forEach(function(element){

				var playernameText = element.innerHTML;

				playersObject.forEach(function(player){
					if(player.playername == playernameText ){
						player.gameswon =  player.gameswon;
						player.gamesplayed += 1;
						player.totalpoints += 3;
						player.averagesubtractedpoints +=3;
					}
					return player;
				});
			});


			losingPlayers.forEach(function(element){
				var playernameText = element.innerHTML;

				playersObject.forEach(function(player){
					if(player.playername == playernameText ){
						player.gameslost += 1;
						player.gamesplayed += 1;
						player.totalpoints += 0;
						player.averagesubtractedpoints += -3;
					}
					return player;
				})
			});

			$.ajax({
				url: '/players/resultupdate', // your api url
				type: 'PUT', // method is any HTTP method
				data: JSON.stringify({ data: playersObject }),
				processData:false,
				contentType : 'application/json',
				success: function(d) {
					console.log('database updated', d);
				}
			})
		};



		$table.on('expand-row.bs.table', function (e, index, row, $detail) {

			var playerDetails = [];
			var rowInfo = playersObject[index];

			playerDetails.push('<td></td><td colspan="8"><p><b>totalpoints</b>' + rowInfo.totalpoints + '</p><p><b>Played</b> ' + rowInfo.gamesplayed + '</p><p>' + rowInfo.playername + '</p> <p><b>Won</b> ' + rowInfo.gameswon + '</p><p><b>Lost</b> ' + rowInfo.gameslost + '</p><p><b>Drawn</b> ' + rowInfo.gamesdrawn + '</p><p><b>Champion</b> ' + rowInfo.gamesplayed + '</p><p><b>Hall of Famer</b> ' + rowInfo.gamesplayed + '</p></td>');

			$('.detail-view').html(playerDetails);
		});

		var el = document.getElementById('teampicker');
		var bench = document.getElementById('bench');
		var picked = document.getElementById('picked');

		Sortable.create(el, {
			animation: 150,
			draggable: '.player',
			group:{
				name:'bench',
				put: 'circle'
			},
		});

		console.log();

		[].forEach.call(picked.getElementsByClassName('circle'), function (circle){
			console.log(circle);

			Sortable.create(circle, {
				draggable: '.player',
				group: {
					name: 'circle',
					put: function(to){
						return to.el.children.length < 1;
					}
				},
				animation: 150
			});
		});


		function saveTeams(){
			var cirleChild = document.querySelectorAll('.player');

			cirleChild.forEach(function(playerElement){
				var areaId = playerElement.parentNode.parentNode.id
				var parentClass = playerElement.parentNode.className
				var playerId = playerElement.dataset.id

				// console.log('areaId', areaId, 'parentClass', parentClass);

				var savingPostions = {
					_id : playerId,
					currentposition:{
						position: parentClass,
						team: areaId
					}
				}

				$.ajax({
					url: '/players/savepositions', // your api url
					type: 'PUT', // method is any HTTP method
					data: savingPostions,
					success: function(d) {
						console.log('database updated', d);
					}
				})
			})
		}




		function displayTeam(){
			for ( var i = 0; i < playersObject.length; i++ ){
				var player = playersObject[i];
				// console.log(player);
				var currentpositionTeam = player.currentposition.team;
				var currentpositionPosition = player.currentposition.position;

				var group = document.getElementById(currentpositionTeam);

				var playerElementParent = document.createElement("div");
				playerElementParent.className = currentpositionPosition;

				var playerElement = document.createElement("div");
				playerElement.className = "player"

				var imagesElement = document.createElement("div");
				imagesElement.className = 'img-container';
				imagesElement.style.backgroundImage = "url('./images/cage.png')";

				var playernameElement = document.createElement("p");
				playernameElement.className = 'playername'
				playernameElement.innerHTML = player.playername;


				playerElement.appendChild(imagesElement);
				playerElement.appendChild(playernameElement);

				playerElementParent.appendChild(playerElement);

				// temp.innerHTML = "<div class='" + currentpositionPosition + "'><div class='player'><div class='img-container' style='background-image:url(./images/cage.png)'></div><p class='playername'>" + player.playername + "</p></div></div>"

				group.appendChild(playerElement);

			}
		}


		$('.submit-win').on('click', queryTeams);
		$('.save-team').on('click', saveTeams);
		$('.result').on('click', updateResult);
		$('.return-to-bench').on('click', bench);




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

		// $('#btnAddUser').on('click', addUser);

		// window.App = {};
		// //
		// $.get('/api', function(data){
		// 	App.players = data;
		// 	app();
		// });
		//
		//
		// function app(){
		//
		// }
	}
})()
