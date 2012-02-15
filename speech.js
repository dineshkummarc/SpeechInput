var speech = {
	init:function(){
		var input = document.querySelectorAll('input[type=speech]');
		for (var i = 0; i < input.length; i++) {
			if("webkitSpeech" in input[i]){
				input[i].webkitSpeech = "true";
				speech.event(input[i]);
			}
		}
	},
	event:function(target){
		target.onwebkitspeechchange = function(){
			target.dataset.speech = target.value;
			target.value = "";
			target.blur();
			alert(target.dataset.speech);
		}	
	}
};