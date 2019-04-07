var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
var link;
function addhistory(){
	var hist = localStorage.getItem("history");
	var histitle = localStorage.getItem("history-titles");
	if(hist){
		var histjson = JSON.parse(hist);
		var histtjson = JSON.parse(histitle);
	}else{
		var histjson = [];
		var histtjson = [];
	}
	if(!histjson.find(function(el){return el == link;})){
		histjson.push(link);
		histtjson.push(document.title);
		localStorage.setItem("history",JSON.stringify(histjson));
		localStorage.setItem("history-titles",JSON.stringify(histtjson));
	}
}
var ok = false;
function onload(){
  link = getQueryVariable("link");
  if(!link) link ="index.json";
	if('fetch' in window){
	fetch(link)
  .then(
    function(response) {
      if (response.status !== 200) {
					document.title = "Error " + response.status;
					document.getElementById("title").innerHTML = "<h1>" + "Error " + response.status + "<h1>";
					document.getElementById("view").innerHTML = "Error " + response.status;
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
				document.title = data.title;
		    document.getElementById("title").innerHTML = "<h1>" + data.title + "<h1>";
				document.getElementById("stat").innerHTML = data.state;
				document.getElementById("grade").innerHTML = data.grade;
				document.getElementById("date").innerHTML = data.addedin;
		    document.getElementById("view").innerHTML = data.content.join("\n");
				addhistory();
				ok = true;
      });
    }
  )
  .catch(function(err) {
		document.title = "Error";
		document.getElementById("title").innerHTML = "<h1>" + "Error" + "<h1>";
		document.getElementById("view").innerHTML = "Error";
  });
}else{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
		  if (this.readyState == 4 && this.status == 200) {
		    var viewmap = JSON.parse(this.responseText);
		    var md = viewmap["content"].join("\n");
		    document.title = viewmap["title"];
		    document.getElementById("title").innerHTML = "<h1>" + viewmap["title"] + "<h1>";
				document.getElementById("stat").innerHTML = viewmap.state;
				document.getElementById("grade").innerHTML = viewmap.grade;
				document.getElementById("date").innerHTML = viewmap.addedin;
		    document.getElementById("view").innerHTML = md;
				addhistory();
		  }else if (this.readyState == 4) {
				document.title = "Error " + this.status;
				document.getElementById("title").innerHTML = "<h1>" + "Error " + this.status + "<h1>";
				document.getElementById("view").innerHTML = "Error " + this.status;
			}
		}
    xhttp.open("GET", link, true);
    xhttp.send();
}
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js');
			navigator.serviceWorker.addEventListener('message', function(event){
						if(event.data.url.slice(-link.length) == link && ok){
							document.getElementById("offbtn").classList.replace("danger","success");
						}
		    });
		} else {
			//console.log('CLIENT: service worker is not supported.');
		}
}
function onhist(){
	var hist = localStorage.getItem("history");
	var histitle = localStorage.getItem("history-titles");
	if(hist){
		var histjson = JSON.parse(hist);
		var histtjson = JSON.parse(histitle);
		var i = 0;
		var currentDiv = document.getElementById("view");
		histjson.forEach(
			function(el){
				var newa = document.createElement("a");
				newa.className = "hist";
				var newContent = document.createTextNode(histtjson[i++]);
				newa.href = location.origin + "/?link=" + el;
				newa.appendChild(newContent);
				currentDiv.appendChild(newa);
				var br = document.createElement("br");
				currentDiv.appendChild(br);
			}
		);
	}
}
function Back() {
  window.history.back();
}
function Offline(){
	window.location.href = "history.html";
}
function Share(){
	if (navigator.share && navigator.canShare()) {
		navigator.share({
      title: document.title,
      url: location.href,
  	})
    .catch((error) => prompt("Copy This Link",location.href));
	}else{
		prompt("Copy This Link",location.href);
	}
}
