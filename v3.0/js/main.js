var NUM_CARDS = 10;

resize();
for(var i=0; i<NUM_CARDS; i++) {
	makeDummyCard(i);
}

document.getElementById("viz").style.height = (ratio * 480) + "px";
document.getElementById("question").style.height = (ratio * 480) + "px";
document.getElementById("rater-agreement").style.height = (ratio * 600) + "px";
document.getElementById("details").style.height = (ratio * 600) + "px";
document.getElementById("dash").style.height = (ratio * 1080) + "px";

function setCards() {
	var cardDiv = document.getElementsByClassName("card");
	for(var i = 0; i < cardDiv.length; i++) {
		if(i < 4)	j=i;
		cardDiv[i].style.height = (ratio * 448) + "px";
		cardDiv[i].style.marginTop = (ratio * (15-j*2)) + "px";
		cardDiv[i].style.marginLeft = (ratio * (j*2)) + "px";
		cardDiv[i].style.marginBottom = (ratio * 15) + "px";
	}
	if(cardDiv.length > 3)
		window.requestAnimationFrame(setCards);
}

window.requestAnimationFrame(setCards);

function makeDummyCard(id) {
	var card = document.createElement("div");
	card.className = "card w-97 bg-light";
	card.id = "c"+id;
	card.style.zIndex = NUM_CARDS - id;

	var cardBody = document.createElement("div");
	cardBody.className = "card-body";

	var cardHeader = document.createElement("h4");
	cardHeader.className = "card-header";
	cardHeader.innerHTML = "Feature Title #"+id;
	card.append(cardHeader);

	var cardTitle = document.createElement("h4");
	cardTitle.className = "card-title";
	cardTitle.innerHTML = "Title #"+id;
	cardBody.append(cardTitle);

	var button1 = document.createElement("button");
	button1.type = "button";
	button1.className = "btn btn-outline-primary";
	button1.id = "relevant-"+i;
	button1.innerHTML = "&#10004; Relevant";
	button1.onclick = function(evt){
		$("#c" + evt.target.id.slice(-1)).addClass("rotate-left").delay(1000).fadeOut(1);
	};
	cardBody.append(button1);

	var button2 = document.createElement("button");
	button2.type = "button";
	button2.className = "btn btn-outline-primary";
	button2.id = "not-relevant-"+i;
	button2.innerHTML = "&#10005; Not Relevant";
	button2.onclick = function(evt){
		$("#c" + evt.target.id.slice(-1)).addClass("rotate-right").delay(1000).fadeOut(1);
	};
	cardBody.append(button2);

	cardBody.append(document.createElement("br"));
	cardBody.append(document.createElement("br"));

	var p = document.createElement("p");
	p.className = "card-text";
	p.innerHTML = "With supporting text below as a natural lead-in to additional content.";
	cardBody.append(p);

	card.append(cardBody);
	
	document.getElementById("question").append(card);
}

function handler(id, m) {
	console.log(id);
	console.log(m);
}