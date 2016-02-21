var submitUrl = '/submit';

$('#submit').on('click', function(){
	var html = editor.html();
	var data = {
		content: html
	}
	$.ajax({
		url: submitUrl,
		type: 'POST',
		data: data
	}).then(function(res){
		console.log(res);
	}, function(e){
		console.log(e);
	});
})