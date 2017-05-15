/**
 * Google Analytics
 */


/**
 * siteオブジェクトを定義
 */
var site = site || {};

/**
 * 本ファイルまでの相対パス
 */
var PATH = (function () {
	var scripts = document.getElementsByTagName('script');
	var src = scripts[scripts.length - 1].getAttribute('src');
	var index = src.lastIndexOf('/');
	return (index !== -1) ? src.substring(0, index) : '';
})();

/*
 * メディアクエリ判別
 */
var LAYOUT = $('.u-mediaquery').css('font-family').replace(/"/g, '');
window.addEventListener('resize', function (e) {
	LAYOUT = $('.u-mediaquery').css('font-family').replace(/"/g, '');
});

/**
 * IE判別
 */
var ua = navigator.userAgent;
var isIE = ua.match(/msie/i),
	isIE8 = ua.match(/msie [8.]/i),
	isIE9 = ua.match(/msie [9.]/i),
	isIE10 = ua.match(/msie [10.]/i);
	isIE11 = ua.match(/msie [11.]/i);
if (isIE) {
	$("body").addClass('ie');
	if (isIE8) {
		$("body").addClass('ie8');
	} else if (isIE9) {
		$("body").addClass('ie9');
	} else if (isIE10) {
		$("body").addClass('ie10');
	} else if (isIE11) {
		$("body").addClass('ie11');
	}
}


/**
 * ページ内のスムーズスクロール
 *
 * @param jQuery $ jQuery オブジェクト
 * @require jQuery v1.7.2
 * @require jQuery Easing v1.3
 */
site.setSmoothScroll = function($) {
	var $page = $('html, body');
	$('a[href^="#"], area[href^="#"]').not('a[data-rel="trigger"]').on('click', function (e) {
		e.preventDefault();
		var offset = $($(this).attr('href')).offset();
		$page.animate({ scrollTop: (offset !== undefined) ? offset.top - 40 + 'px' : 0 }, 400);
		window.history.pushState(null, null, this.hash);
	});
}

/**
 * リンクの別ウィンドウ表示
 *
 * @param jQuery $ jQuery オブジェクト
 * @require jQuery v1.7.2
 */
site.setLinkNewWindow = function($) {
	var $targets = $('a[href^="http://"], a[href^="https://"], a[data-rel="external"]').not('a[href^="http://'+ location.hostname +'"], a[href^="https://'+ location.hostname +'"], a[data-rel="trigger"]');
	$targets.on('click', function() {
		open($(this).attr('href'), null);
		return false;
	});
}

/**
 * アコーディオンを設定
 *
 * @param jQuery $ jQuery オブジェクト
 * @require jQuery v1.7.2
 */
site.setAccordion = function($) {
	var trigger = '.js-accordion-trigger';
	var content = '.js-accordion-content';
	var wrapper = '.js-accordion';
	var containerHeight;

	if(!$(trigger)[0]) {return;}

	var checkState = function() {
		$(trigger).each(function(index, el) {
			if ($(el).hasClass('is-active')) {
				$(el).siblings(content).show();
			} else {
				$(el).siblings(content).hide();
				//containerHeight = $(this).closest(wrapper).innerHeight();
			}
		});
	}

	// init
	checkState();

	$(trigger).each(function(index, el) {
		$(el).on('click', function(e) {
			e.preventDefault();

			$(this).toggleClass('is-active');
			if ($(this).hasClass('is-active')) {
				$(this).siblings(content).slideDown(500);
			} else {
				var targetOffset = $(this).closest(wrapper).offset().top;
				$(this).siblings(content).slideUp(500);
				if(LAYOUT === 'mobile') {
					$('html').velocity('scroll', { duration: 750, offset: targetOffset - 20 });
				}
			}
		});
	});
}

/**
 * ヘッダーを設定
 *
 * @param jQuery $ jQuery オブジェクト
 * @require jQuery v1.7.2
 */
site.setHeader = function($) {
	var $trigger = $('.l-header__btn');
	var $nav = $('.l-header__nav');

	$trigger.on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('is-active');
		$nav.toggleClass('is-active');
	});
}

/**
 * 読み込み完了時の処理
 *
 * @require jQuery v1.7.2
 */
jQuery(function($) {
	site.setSmoothScroll($);
	site.setLinkNewWindow($);
	site.setAccordion($);
	site.setHeader($);
});