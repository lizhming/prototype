var NUM_CARDS = 10;

resize();
for(var i=0; i<NUM_CARDS; i++) {
	makeDummyCard(NUM_CARDS - i);
}

document.getElementById("viz").style.height = (ratio * 480) + "px";
document.getElementById("question").style.height = (ratio * 480) + "px";
document.getElementById("rater-agreement").style.height = (ratio * 600) + "px";
document.getElementById("details").style.height = (ratio * 600) + "px";
document.getElementById("dash").style.height = (ratio * 1080) + "px";

var cardDiv = document.getElementsByClassName("card");
for(var i = 0; i < cardDiv.length; i++) {
	if(i < 4)	j=i;
	cardDiv[i].style.height = (ratio * 448) + "px";
	cardDiv[i].style.marginTop = (ratio * (15+j*2)) + "px";
	cardDiv[i].style.marginLeft = (ratio * (-j*2)) + "px";
	cardDiv[i].style.marginBottom = (ratio * 15) + "px";
}

function makeDummyCard(id) {
	var card = document.createElement("div");
	card.className = "card w-97 bg-light";
	card.id = "c"+id;

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
	button1.id = "relevant";
	button1.innerHTML = "&#10004; Relevant";
	cardBody.append(button1);

	var button2 = document.createElement("button");
	button2.type = "button";
	button2.className = "btn btn-outline-primary";
	button2.id = "not-relevant";
	button2.innerHTML = "&#10005; Not Relevant";
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