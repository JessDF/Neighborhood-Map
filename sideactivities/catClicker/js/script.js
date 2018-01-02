var count0 = 0;
var count1 = 0;
//document.getElementById("name1").innerHTML = "Pongo";
//document.getElementById("name2").innerHTML = "Chewie";
for (var i = 0; i < 2; i++) {
	if(i == 0){
		var p2 = "<p id='cat1'>Cat - Pongo <br> <img src='1.jpg' alt='Cat Image' onclick='updateCounter(0)'></p>";
		$(p2).insertAfter(".catImage");
		var p3 = "<h1 id='counter'>counter: 0</h1>";
		$(p3).insertAfter("#cat1");
	}
	if(i == 1){
		var p2 = "<p id='cat2'>Cat - Chewie <br> <img src='2.jpg' alt='Cat Image' onclick='updateCounter(1)'></p>";
		$(p2).insertAfter("#counter");
		var p4 = "<h1 id='counter1'>counter: 0</h1>";
		$(p4).insertAfter("#cat2");
	}
}

function updateCounter(i) {
	if(i == 0){
		count0++;
		document.getElementById("counter").innerHTML = "counter: " + count0;
	}
	if(i == 1){
		count1++;
		document.getElementById("counter1").innerHTML = "counter: " + count1;
	}
}
$('#my-elem').click(function() {
	updateCounter();
});
