var Speech = function(config) {
		config.target = config.target || "input[type=speech]";
		var input = document.querySelectorAll(config.target);
		for (var i = input.length - 1; i >= 0; i--) {
			if ("webkitSpeech" in input[i]) {
				input[i].webkitSpeech = "true";
				Speech.prototype.event(input[i], config.callback);
			} else {
				Speech.prototype.error(0);
				break;
			}
		}
		Speech.prototype.onerror = config.error ||
		function(error) {
			console.log("Error:" + error);
		};
		if (config.nav === true) {
			Speech.prototype.nav();
		}
	};
Speech.prototype = {
	error: function(error) {
		switch (error) {
		case 0:
			Speech.prototype.onerror("Your Browser does no support Speech Input");
			break;
		case 1:
			Speech.prototype.onerror("No results available");
			break;
		case 2:
			Speech.prototype.onerror("Ajax Error");
			break;
		case 3:
			Speech.prototype.onerror("No Search Query");
		}
	},
	event: function(target, callback) {
		target.onwebkitspeechchange = function() {
			target.dataset.speech = target.value;
			callback(target.value);
			target.value = "";
			target.blur();
		};
	},
	ajax: function(config) {
		config.callback = config.callback ||
		function() {
			console.log("Error: No callback specified");
		};
		if (config.method !== "GET" && config.method !== "POST" && config.method !== "HEAD") {
			config.method = "GET";
		}
		var xhr = new XMLHttpRequest();
		xhr.open(config.method || 'GET', config.url || "", true);
		xhr.responseType = config.type || 'text';

		xhr.onload = function(e) {
			if (this.status == "200") {
				config.callback(Speech.prototype.ajax.parse(this.response));
			}
		};
		xhr.onerror = function() {
			console.log("Error while loading url:" + config.url);
			Speech.prototype.error(2);
		};

		xhr.send();
	},
	nav: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				Speech.prototype.geo = (position.coords.latitude.toString() + "," + position.coords.longitude.toString());
			}, function(error) {
				Speech.prototype.geo = null;
			});
		} else {
			Speech.prototype.geo = null;
		}
		return Speech.prototype.geo;
	},
	facebook: function(config) {
		if (!config.query) {
			this.error(3);
			return;
		}
		this.ajax({
			url: "https://graph.facebook.com/search?type=post&limit=" + ((config.max).toString() || (10).toString()) + "&q=" + config.query,
			method: "GET",
			callback: function(data) {
				var FacebookData = [];
				if ( !! data.data) {
					data.data.forEach(function(entry, i) {
						FacebookData[i] = {};
						switch (entry.type) {
						case "status":
							break;
						case "photo":
							break;
						case "link":
							break;
						case "video":
							break;
						}
					});
					config.callback(FacebookData);
				} else {
					Speech.prototype.error(1);
				}
			}
		});
	},
	youtube: function(config) {
		if (!config.query) {
			this.error(3);
			return;
		}
		this.ajax({
			url: "https://gdata.youtube.com/feeds/api/videos?alt=json&q=" + config.query + "&max-results=" + ((config.max).toString() || (10).toString()),
			method: "GET",
			callback: function(data) {
				var YoutubeData = [];
				if ( !! data.feed.entry) {
					data.feed.entry.forEach(function(entry, i) {
						YoutubeData[i] = {};
						YoutubeData[i].title = entry.media$group.media$title.$t;
						YoutubeData[i].description = entry.media$group.media$description.$t;
						YoutubeData[i].author = entry.author[0].name.$t;
						YoutubeData[i].url = entry.media$group.media$content[0].url;
						YoutubeData[i].thumbnail = [
						entry.media$group.media$thumbnail[1].url, entry.media$group.media$thumbnail[2].url, entry.media$group.media$thumbnail[3].url];
						YoutubeData[i].category = entry.media$group.media$category[0].$t;
						YoutubeData[i].rating = entry.gd$rating.average;
						YoutubeData[i].viewCount = entry.yt$statistics.viewCount;

					});

					config.callback(YoutubeData);
				} else {
					Speech.prototype.error(1);
				}
			}
		});
	}
	/*,
	twitter: function(config) {
		if (!config.query) {
			this.error(3);
			return;
		}
		Speech.prototype.nav();
		this.ajax({
			url: "http://search.twitter.com/search.json?include_entities=true&rpp=" + ((config.max).toString() || (10).toString()) + "&q=" + config.query + ( !! (this.geo && config.nav) ? "&geocode=" + this.geo + "," + config.radius || "2km" : ""),
			method: "GET",
			callback: function(data) {
				console.log(data);
				//config.callback(data);
			}
		});
	}*/
};

Speech.prototype.ajax.parse = function(data) {
	try {
		JSON.parse(data);
	} catch (e) {
		return data;

	}
	return JSON.parse(data);

};

/*
TODO:
	- Add WolframAlpha support
	- Add Facebook support
	- Add Vimeo support
	- Finish Error Handler
	- Create options object for API Keys
*/
