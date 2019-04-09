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
var
	/**
	 * The parsed output string, in HTML format.
	 * @type {String}
	 */
	output = "",

	BLOCK = "block",
	INLINE = "inline",

	/**
	 * An array of parse rule descriptor objects. Each object has two keys;
	 * pattern (the RegExp to match), and replace (the replacement string or
	 * function to execute).
	 * @type {Array}
	 */
	parseMap = [
		{
			// <h1>
			// A line starting with 1-6 hashes.
			pattern: /(#{1,6})([^\n]+)/g,
			replace: "<h$L1>$2</h$L1>",
			type: BLOCK,
		},
		{
			// <p>
			// Any line surrounded by newlines that doesn't start with
			// an HTML tag, asterisk or numeric value with dot following.
			pattern: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{5,})([^\n]+)/g,
			replace: "<p>$1</p>",
			type: BLOCK,
		},
		{
			// <blockquote>
			// A greater-than character preceding any characters.
			pattern: /\n(?:&gt;|\>)\W*(.*)/g,
			replace: "<blockquote><p>$1</p></blockquote>",
			type: BLOCK,
		},
		{
			// <ul>
			//
			pattern: /\n\s?\*\s*(.*)/g,
			replace: "<ul>\n\t<li>$1</li>\n</ul>",
			type: BLOCK,
		},
		{
			// <ol>
			//
			pattern: /\n\s?[0-9]+\.\s*(.*)/g,
			replace: "<ol>\n\t<li>$1</li>\n</ol>",
			type: BLOCK,
		},
		{
			// <strong>
			// Either two asterisks or two underscores, followed by any
			// characters, followed by the same two starting characters.
			pattern: /(\*\*|__)(.*?)\1/g,
			replace: "<strong>$2</strong>",
			type: INLINE,
		},
		{
			// <em>
			// Either one asterisk or one underscore, followed by any
			// characters, followed by the starting character.
			pattern: /(\*|_)(.*?)\1/g,
			replace: "<em>$2</em>",
			type: INLINE,
		},
		{
			// <a>
			// Not starting with an exclamation mark, square brackets
			// surrounding any characters, followed by parenthesis surrounding
			// any characters.
			pattern: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
			replace: "$1<a href=\"$3\">$2</a>",
			type: INLINE,
		},
		{
			// <img>
			// Starting with an exclamation mark, then followed by square
			// brackets surrounding any characters, followed by parenthesis
			// surrounding any characters.
			pattern: /!\[([^\[]+)\]\(([^\)]+)\)/g,
			replace: "<img src=\"$2\" alt=\"$1\" />",
			type: INLINE,
		},
		{
			// <del>
			// Double tilde characters surrounding any characters.
			pattern: /\~\~(.*?)\~\~/g,
			replace: "<del>$1</del>",
			type: INLINE,
		},
		{
			// <code>
			//
			pattern: /`(.*?)`/g,
			replace: "<code>$1</code>",
			type: INLINE,
		},
		{
			// <hr>
			//
			pattern: /\n-{5,}\n/g,
			replace: "<hr />",
			type: BLOCK,
		},
    		{
      			// Colored text
			//
			pattern: /~\[([^\[]+)\[([^\]]+)\]/g,
			replace: "<div style='display:inline;color:#$1'>$2</div>",
			type: INLINE,
    },
	],
$$;

/**
 * Parses a provided Markdown string into valid HTML.
 *
 * @param  {string} string Markdown input for transformation
 * @return {string}        Transformed HTML output
 */
function parse(string) {
	// Pad with newlines for compatibility.
	output = "\n" + string + "\n";

	parseMap.forEach(function(p) {
		// Replace all matches of provided RegExp pattern with either the
		// replacement string or callback function.
		output = output.replace(p.pattern, function() {
			// console.log(this, arguments);
			return replace.call(this, arguments, p.replace, p.type);
		});
	});

	// Perform any post-processing required.
	output = clean(output);
	// Trim for any spaces or newlines.
	output = output.trim();
	// Tidy up newlines to condense where more than 1 occurs back to back.
	output = output.replace(/[\n]{1,}/g, "\n");
	return output;
}

function replace(matchList, replacement, type) {
	var
		i,
	$$;

	for(i in matchList) {
		if(!matchList.hasOwnProperty(i)) {
			continue;
		}

		// Replace $n with the matching regexp group.
		replacement = replacement.split("$" + i).join(matchList[i]);
		// Replace $Ln with the matching regexp group's string length.
		replacement = replacement.split("$L" + i).join(matchList[i].length);
	}

	if(type === BLOCK) {
		replacement = replacement.trim() + "\n";
	}

	return replacement;
}

function clean(string) {
	var cleaningRuleArray = [
		{
			match: /<\/([uo]l)>\s*<\1>/g,
			replacement: "",
		},
		{
			match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
			replacement: "$1",
		},
	];

	cleaningRuleArray.forEach(function(rule) {
		string = string.replace(rule.match, rule.replacement);
	});

	return string;
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
		    document.getElementById("view").innerHTML = parse(data.content.join("\n"));
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
		    var md = parse(viewmap["content"].join("\n"));
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
		// ServiceWorker is a progressive technology. Ignore unsupported browsers
		if ('serviceWorker' in navigator) {
			//console.log('CLIENT: service worker registration in progress.');
			navigator.serviceWorker.register('/service-worker.js').then(function() {
				//console.log('CLIENT: service worker registration complete.');
			}, function() {
				//console.log('CLIENT: service worker registration failure.');
			});
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
