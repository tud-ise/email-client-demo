// Current Date

function currentDate(){
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	return month + "-" + day + "-" + year;
}

var today = currentDate();

// Default mail-type: "no_smile"
var current_mails = "no_smile";
//Display mail-type in top navigation bar
//$('.top-nav-ul').append('<li class="current-mail-type" style="font-size: 9pt;">'+ current_mails + '</li>');


// Shade the currently clicked folder

$("#side-nav ul li").click(function(){
	$("#side-nav ul li").removeClass("current");
	$(this).addClass("current");
});

// Display email list of current folder; hide all other emails

$("#inbox-link").click(function(){
	closeOpenEmail();
	$(".inbox").show();
	$(".sent, .trash").hide();
});

$("#sent-link").click(function(){
	closeOpenEmail();
	$(".sent").show();
	$(".inbox, .trash").hide();
});

$("#trash-link").click(function(){
	closeOpenEmail();
	$(".trash").show();
	$(".inbox, .sent").hide();
});

$("#spam-link").click(function(){
	closeOpenEmail();
	$(".inbox, .sent, .trash").hide();
});

$("#start-experiment").click(function(){
	closeOpenEmail();
	$("#change-mail-type, .current-mail-type, #start-experiment").hide();
});
// Open a closed email

$("#emails").on("click", ".email-contents", function(e){
	$(this).addClass("open-email");
	$("#reply-btn, #forward-btn, #close-btn, #delete-btn-top").css("display", "inline-block");
	$("#new-email-btn, #change-mail-type, .current-mail-type").hide();
});

// Close an open email

function closeOpenEmail(){
	$(".email-contents").removeClass("open-email");
	$("#reply-btn, #forward-btn, #close-btn, #delete-btn-top").hide();
	$("#new-email-btn").show();
	if (current_mails == "smile") {
		$(".smile-email").show();
		$(".normal-email").hide();
	}
	else if (current_mails == "no_smile") {
		$(".smile-email").hide();
		$(".normal-email").show();
	}
}

$("#close-btn").click(closeOpenEmail);

// Change shown mail-type (mails with or without SMILE)
let tmp = document.getElementById('top-nav-ul-id');
$("#change-mail-type").click(function(){
	if (current_mails == "smile") {
		current_mails = "no_smile"
	} else {
		current_mails = "smile"
	}
	closeOpenEmail();
	tmp.removeChild(tmp.lastElementChild);
	$('.top-nav-ul').append('<li class="current-mail-type" style="font-size: 9pt;">'+ current_mails + '</li>');
})

// Delete email button

$("#emails").on("click", ".email .delete-btn", function(e){
	e.stopPropagation();
	if ( $(this).parents(".email").hasClass("inbox") ) {
		$(this).parents(".email").hide().addClass("trash was-inbox").removeClass("inbox");
	}
	else if ( $(this).parents(".email").hasClass("sent") ) {
		$(this).parents(".email").hide().addClass("trash was-sent").removeClass("sent");
	}
});

// restore email from trash button

$("#emails").on("click", ".email .undo-btn", function(e){
	e.stopPropagation();
	if ( $(this).parents(".email").hasClass("was-inbox") ) {
		$(this).parents(".email").hide().addClass("inbox").removeClass("trash was-inbox");
	}
	else if ( $(this).parents(".email").hasClass("was-sent") ) {
		$(this).parents(".email").hide().addClass("sent").removeClass("trash was-sent");
	}
});

/********** Compose a New Email **********/

// New email button

$("#new-email-btn").click(function(){
	$("#new-email-wrapper").show();
});

// Send new email

$("#send-email-btn").click(function(){

	var emailContent = $("#new-email-content textarea").val();
	emailContent = emailContent.replace(/\r\n|\n|\r/g, "<br>\n");

	var sentEmail = '<li class="sent email">' +
						'<ul class="email-contents">' +
							'<li class="email-header">' +
								'<ul>' +
									'<li class="from"><span>From: </span>Ed</li>' +
									'<li class="to"><span>To: </span>' + $("#new-email-to input").val() + '</li>' +
									'<li class="subject"><span>Subject: </span>' + $("#new-email-subject input").val() + '</li>' +
									'<li class="delete-btn">&times;</li>' +
									'<li class="undo-btn">&#8630;</li>' +
									'<li class="date">' + today + '</li>' +
								'</ul>' +
							'</li>' +
							'<li class="email-body">' +
								emailContent +
							'</li>' +
						'</ul>' +
					'</li>';

	$("ul#emails").append(sentEmail);
	$("#new-email-form").trigger("reset");
	$("#new-email-wrapper").hide();
});

// Cancel new email

$("#cancel-email-btn").click(function(){
	$("#new-email-wrapper").hide();
});

/********** Reply to or Forward an Email **********/
// Delete email button

$("#delete-btn-top").click(function(e){
	e.stopPropagation();
	if ($(".open-email").parents(".email").hasClass("inbox") ) {
		$(".open-email").parents(".email").hide().addClass("trash was-inbox").removeClass("inbox");
	}
	else if ( $(".open-email").parents(".email").hasClass("sent") ) {
		$(".open-email").parents(".email").hide().addClass("trash was-sent").removeClass("sent");
	}
	closeOpenEmail();
});


// Reply email button

$("#reply-btn").click(function(){
	$("#reply-email-form header h2").text("Reply to Email");
	$("#reply-email-wrapper").show();
	$("#reply-email-to input").val($(".open-email .from").text().replace("From:", ""));
	$("#reply-email-subject input").val("RE: " + $(".open-email .subject").text().replace("Subject:", ""));
	$("#reply-email-content textarea").val("\n\n" + "===== Replying to =====" + "\n\n" + $(".open-email .email-body").html());
});

// Forward email button

$("#forward-btn").click(function(){
	$("#reply-email-form header h2").text("Forward Email");
	$("#reply-email-wrapper").show();
	$("#reply-email-subject input").val("FWD: " + $(".open-email .subject").text().replace("Subject:", ""));
	$("#reply-email-content textarea").val("\n\n" + "===== Forwarded Message =====" + "\n\n" + $(".open-email .email-body").html());
});

// Send reply email, Send forwarded email

$("#send-reply-email-btn").click(function(){

	var emailContent = $("#reply-email-content textarea").val();
	emailContent = emailContent.replace(/\r\n|\n|\r/g, "<br>\n");

	var sentEmail = '<li class="sent email">' +
						'<ul class="email-contents">' +
							'<li class="email-header">' +
								'<ul>' +
									'<li class="from"><span>From: </span>Ed</li>' +
									'<li class="to"><span>To: </span>' + $("#reply-email-to input").val() + '</li>' +
									'<li class="subject"><span>Subject: </span>' + $("#reply-email-subject input").val() + '</li>' +
									'<li class="delete-btn">Delete</li>' +
									'<li class="undo-btn">Restore</li>' +
									'<li class="date">' + today + '</li>' +
								'</ul>' +
							'</li>' +
							'<li class="email-body">' +
								emailContent +
							'</li>' +
						'</ul>' +
					'</li>';

	$("ul#emails").append(sentEmail);
	$("#reply-email-form").trigger("reset");
	$("#reply-email-wrapper").hide();
});

// Cancel reply (or forwarding) email

$("#cancel-reply-email-btn").click(function(){
	$("#reply-email-wrapper").hide();
});