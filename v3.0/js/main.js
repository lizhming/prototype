resize();

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