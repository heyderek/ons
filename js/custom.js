$(document).ready(function() {
	//Scrollto functionality for navigation and "Hit us up!" links
	$('a#home').bind('click', function(){
		$.scrollTo('#about',{'duration':'slow'});
		return false;
	});
	$('a.button').bind('click', function(){
		$.scrollTo('#contact',{'duration':'slow'});
		return false;
	});
	$('a#work').bind('click', function(){
		$.scrollTo('#portfolio',{'duration':'slow'});
		return false;
	});
	$('a#skills').bind('click', function(){
		$.scrollTo('#services',{'duration':'slow'});
		return false;
	});
	$('a#email, a.email').bind('click', function(){
		$.scrollTo('#contact',{'duration':'slow'});
		return false;
	});

  //Accordion functionality - simulate the jQuery UI accordion but much less code
  $('#accordion h4').click(function(){
    var showArticle = $(this).next('article');
    var hideArticle = $('#accordion article:visible');

    if ($(this).hasClass('open')) {
      $(this).removeClass('open');
		} else {
      $(this).addClass('open');
		}

		// IF the visible article is the same as the accordion that was clicked
		// don't hide the visible one because then it would be double toggled.
		if (!hideArticle.is(showArticle)) {
      hideArticle.prev($('#accordion h4')).removeClass('open');
			hideArticle.animate({
			height: 'toggle'
			}, {duration: 800, queue: false});
		}

		showArticle.animate({
			height: 'toggle'
			}, {duration: 800, queue: false});
  });

  //Activate Flexslider Carousel
	$('.flexslider').flexslider({
		animation: "slide",
		animationLoop: false,
		slideshow: false,
		itemWidth: 300,
		itemMargin: 20
	});


	$('.flexslider img').click(function(){
		// stop multiple clicks on the same portfolio item
		if ($(this).is($('.flexslider img.active'))) {
			return false;
		}

		var articleText = $(this).next('article').html();

		// since we will only process when a different portfolio item is clicked
		// we know that the classes will allways have to be removed from the previous
		// item and added to the new item.
		$('.flexslider img').removeClass('active');
		$(this).addClass('active');

		// fade out the current text and fade in the new text.
		$('#portfolio_info').animate({'opacity': 0}, 400, function () {
			$(this).html(articleText);
			}).animate({'opacity': 1}, 400);

		// just to make sure we always return a value
		return true;
	});


	$(".defaultText").focus(function() {
		if ($(this).val() == $(this)[0].title) {
			$(this).removeClass("defaultTextActive");
			$(this).val("");
		}
  });

  $(".defaultText").blur(function() {
		if ($(this).val() == "") {
			$(this).addClass("defaultTextActive");
			$(this).val($(this)[0].title);
		}
  });

	$('#contact_form').submit(function(e) {
		$.ajax({
			type: "POST",
			url: "contact.php",
			data: $(this).serialize(),
			complete: function(request, ajaxStatus) {
				var status = request.responseText;

				if (status == 'success') {
					status = "Message sent! Thanks and we'll be in touch shortly.";

					$('#contact_form').each(function(){
		        this.reset();
					});

					$(".defaultText").blur();
				}

				// need to use the fadeIn/fadeOut because the set disply to block or none as it fades.
				// animate() would take extra coding to do the same thing
				$('#contact_error').fadeOut(400, function() {
					$('#contact_error').html(status);
				}).fadeIn(400);

				Recaptcha.reload();
				return true;
			}
		});
		return false;
	});


	// Open the first accordion on page load
	setTimeout("$('#accordion h4').first().trigger('click')");
	// Set the first Portfolio item active and show article on page load
	$('#portfolio_info').html($('.flexslider li:first-child article').html());
	// Put the default text into the contact form on page load
	$(".defaultText").blur();
	Recaptcha.create("6LfpldgSAAAAAIzYtINg_zQ7m90TYg5GJHG1m_Tq","captcha",{theme: 'white'});
});


