/* -------------------------------------------------------------------------------- /
	
	Magentech jQuery
	Created by Magentech
	v1.0 - 20.9.2016
	All rights reserved.

	+----------------------------------------------------+
		TABLE OF CONTENTS
	+----------------------------------------------------+
	[1]		Home page 5
	[2]		Home page 6
	[3]		Home page 8
	
/ -------------------------------------------------------------------------------- */

/* ---------------------------------------------------
	1.Home page 1
-------------------------------------------------- */

/* ---------------------------------------------------
	Listing Tabs - Slider
-------------------------------------------------- */

(function (element) {
	var $element = $(element),
		$tab = $('.ltabs-tab', $element),
		$tab_label = $('.ltabs-tab-label', $tab),
		$tabs = $('.ltabs-tabs', $element),
		ajax_url = $tabs.parents('.ltabs-tabs-container').attr('data-ajaxurl'),
		effect = $tabs.parents('.ltabs-tabs-container').attr('data-effect'),
		delay = $tabs.parents('.ltabs-tabs-container').attr('data-delay'),
		duration = $tabs.parents('.ltabs-tabs-container').attr('data-duration'),
		type_source = $tabs.parents('.ltabs-tabs-container').attr('data-type_source'),
		
		$col_lg = $tabs.parents('.ltabs-tabs-container').attr('data-lg'),
		$col_md = $tabs.parents('.ltabs-tabs-container').attr('data-md'),
		$col_sm = $tabs.parents('.ltabs-tabs-container').attr('data-sm'),
		$col_xs = $tabs.parents('.ltabs-tabs-container').attr('data-xs'),
		$margin = $tabs.parents('.ltabs-tabs-container').attr('data-margin'),
		
		$items_content = $('.ltabs-items', $element),
		$items_inner = $('.ltabs-items-inner', $items_content),
		$items_first_active = $('.ltabs-items-selected', $element),
		$select_box = $('.ltabs-selectbox', $element),
		$tab_label_select = $('.ltabs-tab-selected', $element),
		setting = '2',
		type_show = 'slider';
		enableSelectBoxes();
		
		/* First Ajax Listing tabs*/
		var el = $('.tab-sel',$element).attr('data-active-content'),
			el_active = $(el,$element);
		listing_tab_ajax(el_active);
		
	function enableSelectBoxes() {
		$tab_wrap = $('.ltabs-tabs-wrap', $element),
			$tab_label_select.html($('.ltabs-tab', $element).filter('.tab-sel').children('.ltabs-tab-label').html());
		if ($(window).innerWidth() <= 991) {
			$tab_wrap.addClass('ltabs-selectbox');
		} else {
			$tab_wrap.removeClass('ltabs-selectbox');
		}
	}
	
	$('span.ltabs-tab-selected, span.ltabs-tab-arrow', $element).click(function() {
		if ($('.ltabs-tabs', $element).hasClass('ltabs-open')) {
			$('.ltabs-tabs', $element).removeClass('ltabs-open');
		} else {
			$('.ltabs-tabs', $element).addClass('ltabs-open');
		}
	});
	
	$(window).resize(function() {
		if ($(window).innerWidth() <= 991) {
			$('.ltabs-tabs-wrap', $element).addClass('ltabs-selectbox');
		} else {
			$('.ltabs-tabs-wrap', $element).removeClass('ltabs-selectbox');
		}
	});
	
	function showAnimateItems(el) {
		var $_items = $('.new-ltabs-item', el), nub = 0;
		$('.ltabs-loadmore-btn', el).fadeOut('fast');
		$_items.each(function (i) {
			nub++;
			switch(effect) {
				case 'none' : $(this).css({'opacity':'1','filter':'alpha(opacity = 100)'}); break;
				default: animatesItems($(this),nub*delay,i,el);
			}
			if (i == $_items.length - 1) {
				$('.ltabs-loadmore-btn', el).fadeIn(3000);
			}
			$(this).removeClass('new-ltabs-item');
		});
	}

	function animatesItems($this,fdelay,i,el) {
		var $_items = $('.ltabs-item', el);
		$this.stop(true, true).attr("style",
			"-webkit-animation:" + effect +" "+ duration +"ms;"
			+ "-moz-animation:" + effect +" "+ duration +"ms;"
			+ "-o-animation:" + effect +" "+ duration +"ms;"
			+ "-moz-animation-delay:" + fdelay + "ms;"
			+ "-webkit-animation-delay:" + fdelay + "ms;"
			+ "-o-animation-delay:" + fdelay + "ms;"
			+ "animation-delay:" + fdelay + "ms;").delay(fdelay).animate({
				opacity: 1,
				filter: 'alpha(opacity = 100)'
			}, {
				delay: 1000
			});
		if (i == ($_items.length - 1)) {
			$(".ltabs-items-inner").addClass("play");
		}
	}
	
	
	function updateStatus($el) {
		$('.ltabs-loadmore-btn', $el).removeClass('loading');
		var countitem = $('.ltabs-item', $el).length;
		$('.ltabs-image-loading', $el).css({display: 'none'});
		$('.ltabs-loadmore-btn', $el).parent().attr('data-rl_start', countitem);
		var rl_total = $('.ltabs-loadmore-btn', $el).parent().attr('data-rl_total');
		var rl_load = $('.ltabs-loadmore-btn', $el).parent().attr('data-rl_load');
		var rl_allready = $('.ltabs-loadmore-btn', $el).parent().attr('data-rl_allready');

		if (countitem >= rl_total) {
			$('.ltabs-loadmore-btn', $el).addClass('loaded');
			$('.ltabs-image-loading', $el).css({display: 'none'});
			$('.ltabs-loadmore-btn', $el).attr('data-label', rl_allready);
			$('.ltabs-loadmore-btn', $el).removeClass('loading');
		}
	}
	
	function listing_tab_ajax(category_id ) {	
		var parent_active = $(category_id),
		total_product = parent_active.data('total'),
		tab_active = $('.ltabs-items-inner', parent_active),
		nb_column0 = $col_lg,
		nb_column1 = $col_md,
		nb_column2 = $col_sm,
		nb_column3 = $col_xs;
		nb_margin = parseInt($margin);
		tab_active.owlCarousel2({
			nav: true,
			dots: false,
			
			loop: false,
			autoplay: false,
			lazyLoad: true,
			autoplayHoverPause: true,
			autoplayTimeout: 5000,
			autoplaySpeed: 5000,
			navRewind: true,
			navText: ['', ''],
			margin: nb_margin ,
			responsive: {
				0: {
					items: nb_column3,
					nav: total_product <= nb_column3 ? false : ((true) ? true : false),
				},
				767: {
					items: nb_column2,
					nav: total_product <= nb_column2 ? false : ((true) ? true : false),
				},
				991: {
					items: nb_column1,
					nav: total_product <= nb_column1 ? false : ((true) ? true : false),
				},
				1199: {
					items: nb_column0,
				
					nav: total_product <= nb_column0 ? false : ((true) ? true : false),
				},
			}
		});
		
		/*Quick View*/
		$('.iframe-link').magnificPopup({
			type:'iframe',
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			closeOnContentClick: true,
			preloader: true,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			//gallery: {  enabled: true }
		});
		
		
		$( '.product_1846281811484147376 .thumbs-product .item-img', $(category_id) ).click(function() {
			$( '.product_1846281811484147376 .thumbs-product .item-img', $(category_id) ).removeClass('thumb-active');
			$(this).addClass('thumb-active');
			var thumb_src = $(this).attr("data-src");
			$( ".product_1846281811484147376 .product-image-container img", $(category_id)).attr("src",thumb_src);
		}); 
	}
	
	$tab.on('click.ltabs-tab', function () {
		
		var $this = $(this);
		if ($this.hasClass('tab-sel')) return false;
		if ($this.parents('.ltabs-tabs').hasClass('ltabs-open')) {
			$this.parents('.ltabs-tabs').removeClass('ltabs-open');
		}
		$tab.removeClass('tab-sel');
		$this.addClass('tab-sel');
		
	});

})('#so_listing_tabs_1');


(function(element) {
	var $element = $(element),
		$tab = $('.ltabs-tab', $element),
		$tab_label = $('.ltabs-tab-label', $tab),
		$tabs = $('.ltabs-tabs', $element),
		ajax_url = $tabs.parents('.ltabs-tabs-container').attr('data-ajaxurl'),
		effect = $tabs.parents('.ltabs-tabs-container').attr('data-effect'),
		delay = $tabs.parents('.ltabs-tabs-container').attr('data-delay'),
		duration = $tabs.parents('.ltabs-tabs-container').attr('data-duration'),
		type_source = $tabs.parents('.ltabs-tabs-container').attr('data-type_source'),
		$margin = $tabs.parents('.ltabs-tabs-container').attr('data-margin'),
		
		$col_lg = $tabs.parents('.ltabs-tabs-container').attr('data-lg'),
		$col_md = $tabs.parents('.ltabs-tabs-container').attr('data-md'),
		$col_sm = $tabs.parents('.ltabs-tabs-container').attr('data-sm'),
		$col_xs = $tabs.parents('.ltabs-tabs-container').attr('data-xs'),
		
		
		$items_content = $('.ltabs-items', $element),
		$items_inner = $('.ltabs-items-inner', $items_content),
		$items_first_active = $('.ltabs-items-selected', $element),
		$select_box = $('.ltabs-selectbox', $element),
		$tab_label_select = $('.ltabs-tab-selected', $element),
		setting = '2',
		type_show = 'slider';
		enableSelectBoxes();
		
		/* First Ajax Listing tabs*/
		var el = $('.tab-sel',$element).attr('data-active-content'),
			el_active = $(el,$element);
		listing_tab_ajax(el_active);
		
	function enableSelectBoxes() {
		$tab_wrap = $('.ltabs-tabs-wrap', $element),
			$tab_label_select.html($('.ltabs-tab', $element).filter('.tab-sel').children('.ltabs-tab-label').html());
		if ($(window).innerWidth() <= 991) {
			$tab_wrap.addClass('ltabs-selectbox');
		} else {
			$tab_wrap.removeClass('ltabs-selectbox');
		}
	}
	
	$('span.ltabs-tab-selected, span.ltabs-tab-arrow', $element).click(function() {
		if ($('.ltabs-tabs', $element).hasClass('ltabs-open')) {
			$('.ltabs-tabs', $element).removeClass('ltabs-open');
		} else {
			$('.ltabs-tabs', $element).addClass('ltabs-open');
		}
	});
	
	$(window).resize(function() {
		if ($(window).innerWidth() <= 991) {
			$('.ltabs-tabs-wrap', $element).addClass('ltabs-selectbox');
		} else {
			$('.ltabs-tabs-wrap', $element).removeClass('ltabs-selectbox');
		}
	});
	
	function showAnimateItems(el) {
		var $_items = $('.new-ltabs-item', el), nub = 0;
		$('.ltabs-loadmore-btn', el).fadeOut('fast');
		$_items.each(function (i) {
			nub++;
			switch(effect) {
				case 'none' : $(this).css({'opacity':'1','filter':'alpha(opacity = 100)'}); break;
				default: animatesItems($(this),nub*delay,i,el);
			}
			if (i == $_items.length - 1) {
				$('.ltabs-loadmore-btn', el).fadeIn(3000);
			}
			$(this).removeClass('new-ltabs-item');
		});
	}

	function animatesItems($this,fdelay,i,el) {
		var $_items = $('.ltabs-item', el);
		$this.stop(true, true).attr("style",
			"-webkit-animation:" + effect +" "+ duration +"ms;"
			+ "-moz-animation:" + effect +" "+ duration +"ms;"
			+ "-o-animation:" + effect +" "+ duration +"ms;"
			+ "-moz-animation-delay:" + fdelay + "ms;"
			+ "-webkit-animation-delay:" + fdelay + "ms;"
			+ "-o-animation-delay:" + fdelay + "ms;"
			+ "animation-delay:" + fdelay + "ms;").delay(fdelay).animate({
				opacity: 1,
				filter: 'alpha(opacity = 100)'
			}, {
				delay: 1000
			});
		if (i == ($_items.length - 1)) {
			$(".ltabs-items-inner").addClass("play");
		}
	}
	
	
	function updateStatus($el) {
		$('.ltabs-loadmore-btn', $el).removeClass('loading');
		var countitem = $('.ltabs-item', $el).length;
		$('.ltabs-image-loading', $el).css({display: 'none'});
		$('.ltabs-loadmore-btn', $el).parent().attr('data-rl_start', countitem);
		var rl_total = $('.ltabs-loadmore-btn', $el).parent().attr('data-rl_total');
		var rl_load = $('.ltabs-loadmore-btn', $el).parent().attr('data-rl_load');
		var rl_allready = $('.ltabs-loadmore-btn', $el).parent().attr('data-rl_allready');

		if (countitem >= rl_total) {
			$('.ltabs-loadmore-btn', $el).addClass('loaded');
			$('.ltabs-image-loading', $el).css({display: 'none'});
			$('.ltabs-loadmore-btn', $el).attr('data-label', rl_allready);
			$('.ltabs-loadmore-btn', $el).removeClass('loading');
		}
	}
	
	function listing_tab_ajax(category_id ) {	
		var parent_active = $(category_id),
		total_product = parent_active.data('total'),
		tab_active = $('.ltabs-items-inner', parent_active),
		nb_column0 = $col_lg,
		nb_column1 = $col_md,
		nb_column2 = $col_sm,
		nb_column3 = $col_xs;
		nb_margin = parseInt($margin);
		tab_active.owlCarousel2({
			nav: false,
			dots: false,
			
			loop: false,
			autoplay: false,
			lazyLoad: true,
			autoplayHoverPause: true,
			autoplayTimeout: 5000,
			autoplaySpeed: 5000,
			navRewind: true,
			navText: ['', ''],
			margin: nb_margin ,
			responsive: {
				0: {
					items: nb_column3,
					nav: total_product <= nb_column3 ? false : ((true) ? true : false),
				},
				767: {
					items: nb_column2,
					nav: total_product <= nb_column2 ? false : ((true) ? true : false),
				},
				991: {
					items: nb_column1,
					nav: total_product <= nb_column1 ? false : ((true) ? true : false),
				},
				1199: {
					items: nb_column0,
					nav: total_product <= nb_column0 ? false : ((true) ? true : false),
				},
			}
		});
		
		/*Quick View*/
		$('.iframe-link').magnificPopup({
			type:'iframe',
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			closeOnContentClick: true,
			preloader: true,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			//gallery: {  enabled: true }
		});
		
		$( '.product_1846281811484147376 .thumbs-product .item-img', $element ).click(function() {
			$( '.product_1846281811484147376 .thumbs-product .item-img', $element ).removeClass('thumb-active');
			$(this).addClass('thumb-active');
			var thumb_src = $(this).attr("data-src");
			$( ".product_1846281811484147376 .product-image-container img").attr("src",thumb_src);
		}); 
	}
	
	$tab.on('click.ltabs-tab', function () {
		
		var $this = $(this);
		if ($this.hasClass('tab-sel')) return false;
		if ($this.parents('.ltabs-tabs').hasClass('ltabs-open')) {
			$this.parents('.ltabs-tabs').removeClass('ltabs-open');
		}
		$tab.removeClass('tab-sel');
		$this.addClass('tab-sel');
	});

})('#so_listing_tabs_2');

/* ---------------------------------------------------
	Owl carousel - Slider
-------------------------------------------------- */
$(document).ready(function ($) {
	"use strict";
	// Content slider
	$('.yt-content-slider').each(function () {
		var $slider = $(this),
			$panels = $slider.children('div'),
			data = $slider.data();
		// Remove unwanted br's
		//$slider.children(':not(.yt-content-slide)').remove();
		// Apply Owl Carousel
		
		$slider.owlCarousel2({
			responsiveClass: true,
			mouseDrag: true,
			video:true,
    		lazyLoad: (data.lazyload == 'yes') ? true : false,
			autoplay: (data.autoplay == 'yes') ? true : false,
			autoHeight: (data.autoheight == 'yes') ? true : false,
			autoplayTimeout: data.delay * 1000,
			smartSpeed: data.speed * 1000,
			autoplayHoverPause: (data.hoverpause == 'yes') ? true : false,
			center: (data.center == 'yes') ? true : false,
			loop: (data.loop == 'yes') ? true : false,
            dots: (data.pagination == 'yes') ? true : false,
            nav: (data.arrows == 'yes') ? true : false,
			dotClass: "owl2-dot",
			dotsClass: "owl2-dots",
            margin: data.margin,
            navText: ['',''],
			
			responsive: {
				0: {
					items: data.items_column4 
					},
				480: {
					items: data.items_column3
					},
				768: {
					items: data.items_column2
					},
				992: { 
					items: data.items_column1
					},
				1200: {
					items: data.items_column0 
					}
			}
		});
		
	});
	

}); 


// click header search header 
$(document).ready(function($) {
	$( ".search-header-w .icon-search" ).click(function() {
	$('#sosearchpro .search').slideToggle(200);
	$(this).toggleClass('active');
	});
});

/* ---------------------------------------------------
	1.Home page 5
-------------------------------------------------- */

/* ---------------------------------------------------
	2.Home page 6
-------------------------------------------------- */


//BLOCK Newsleter Popup
$(document).ready(function($) {
	$(window).load(function () {
		$('.common-home').addClass('hidden-scorll');
		$('.so_newletter_custom_popup_bg').addClass('popup_bg');
		$('input[name=\'hidden-popup\']').on('change', function(){
			if ($(this).is(':checked')) {
				checkCookie();
			} else {
				unsetCookie("so_newletter_custom_popup");
			}
		});
		function unsetCookie( name ) {
			document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
		$('.popup-close').click(function(){
			var this_close = $('.popup-close');
			this_close.parents().find('.common-home').removeClass('hidden-scorll');
			this_close.parents().find('#container-module-newletter').remove();
		});
	});
});

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	console.log(d.getTime());
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}
function checkCookie() {
	var check_cookie = getCookie("so_newletter_custom_popup");
	if(check_cookie == ""){
		setCookie("so_newletter_custom_popup", "Newletter Popup", 1 );
	}
}
function subscribe_newsletter()
{
	var emailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var email = $('#txtemail').val();
	var d = new Date();
	var createdate = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
	var status   = 0;
	var dataString = 'email='+email+'&createdate='+createdate+'&status='+status;
	if(email != "")
	{
		if(!emailpattern.test(email))
		{
			$('.show-error').remove();
			$('.send-mail').after('<span class="show-error" style="color: red;margin-left: 10px"> Invalid Email </span>')
			return false;
		}
		else
		{
			$.ajax({
				url: 'index.php?route=extension/module/so_newletter_custom_popup/newsletter',
				type: 'post',
				data: dataString,
				dataType: 'json',
				success: function(json) {
					$('.show-error').remove();
					if(json.message == "Subscription Successfull") {
						checkCookie();
						$('.send-mail').after('<span class="show-error" style="color: #003bb3;margin-left: 10px"> ' + json.message + '</span>');
						setTimeout(function () {
							var this_close = $('.popup-close');
							this_close.parent().css('display', 'none');
							this_close.parents().find('.so_newletter_custom_popup_bg').removeClass('popup_bg');
						}, 3000);

					}else{
						$('.send-mail').after('<span class="show-error" style="color: red;margin-left: 10px"> ' + json.message + '</span>');
					}
					document.getElementById('signup').reset();
				}
			});
			return false;
		}
	}
	else
	{
		alert("Email Is Require");
		$(email).focus();
		return false;
	}
}

