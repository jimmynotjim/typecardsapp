$(document).ready(function(){

$('.instructions .dismiss').on('click', function() {
	$.cookie('dismissInstructions', 1, { expires: 365 });
	$('.instructions').toggleClass('hidden');
}).bind('tap', function(event){
	event.stopPropagation();
});

$('.phone').mouseenter(function() {
	$('.card-nav').addClass('active');
}).mouseleave(function() {
	$('.card-nav').removeClass('active');
});

});
