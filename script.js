var API = new Speech({
	target:"input[type='speech']",
	callback:function(input){
		console.log(input);
		API.youtube({
			query:input,
			max:10,
			callback:function(data){
				console.log(data);
			}
		});
	},
	error:function(error){
		alert("Error:" + error + "!!");
	}
});