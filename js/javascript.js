//////////////////////////////////////////////////////////////////////////////
//       _______       _    _                     _____                     //
//      |__   __|   _ | |  | |                   |  __ \                    //
//         | |     (_)| |__| |                   | |__) |         _         //
//         | | __ _ _ |  __  |_   _ _   _ _ __   |  ___/__ _ _ __| | __     //
//      _  | |/ _` | || |  | | | | | | | | `_ \  | |   / _` | '__| |/ /     //
//     / |_| | (_| | || |  | | |_| | |_| | | | | | |  | (_| | |  |   <      //
//     \____/ \__,_|_||_|  |_|\__  |\__,_|_| |_| |_|   \__,_|_|  |_|\_\     //
//                           ,._/ /                                         //
//     jhyunp@snu.ac.kr      \___/           https://jaihyunp.github.io     //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
//
// MIT License
//
// Copyright (c) 2019-2024 Jai Hyun Park
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

var versionUpdate='2.3.0';
var lang = 'eng';
var langs = ['eng','kor']

function loadMenubar() {
	$('.load-menubar').load('default.html #menubar', function(){
		//Color menu item of current page
		var paths = location.href.split('/');
		paths = paths[paths.length - 1].split('?')[0];
		$(this).find('.right-menu-menu a').each(function(){
			if($(this).attr('href') !== undefined)
				if($(this).attr('href').split('?')[0] === paths)
					$(this).addClass('this-page');
		});
		$(this).find('.right-menu-dropmenu a').each(function(){
			if($(this).attr('href') !== undefined)
				if($(this).attr('href').split('?')[0] === paths)
					$(this).addClass('this-page');
		});

		$(this).find('.lang-kor').each(function(){
			$(this).attr('href', location.href.split('?')[0] + '?lang=kor');
		});
		$(this).find('.lang-eng').each(function(){
			$(this).attr('href', location.href.split('?')[0]);
		});

		//Click Event: dropmenu-down
		$('.right-menu-button').on('click', function(e){
			e.preventDefault();
			$(this).parent().children('.right-menu-dropmenu').slideToggle(300);
			return false;
		});
		$(document).on("click", function(event){
			var $trigger = $(".right-menu-dropmenu");
			if($trigger !== event.target && !$trigger.has(event.target).length){
				$(".right-menu-dropmenu").slideUp(0);
			}            
		});
	
		show_lang($(this),lang);
	});
}

function loadFooter() {
	//Click Event: go-to-top
	$('.load-footer').load('default.html #footer', function(){
		lastUpdated();
		$('._goto-top').on('click', function(e){
			e.preventDefault();
			$('html, body').stop().animate({
				scrollTop: 0
			}, 400);
			return false;
		});
	});
}

function updateAge(){
	if( $('.update-birth').length > 0 ){
		var myAge;
		var birth = new Date(Date.parse('1994/9/21')).getTime();
		setInterval(function(){
			myAge = new Number(new Date(new Date().getTime() - birth) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(10);
			$('.update-birth p').text(myAge);
		}, 100);
	}
}

function update_lang(){
	temp = location.href.split(/[?&#]+/);
	for(var t in temp){
		if(t > 0) {
			data = temp[t].split('=');
			if(data[0] === 'lang')
				lang = data[1];
		}
	}
}

function show_lang(that,language){
	for(var l in langs){
		if(langs[l] === language){
			$(that).find('.'+langs[l]).each(function(){$(this).show()});
		} else {
			$(that).find('.'+langs[l]).each(function(){$(this).hide()});
		}
	};
}

function date_mmmddyyHHMM(date)
{
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	var mmm = 
		( 1==m)?'Jan':( 2==m)?'Feb':(3==m)?'Mar':
		( 4==m)?'Apr':( 5==m)?'May':(6==m)?'Jun':
		( 7==m)?'Jul':( 8==m)?'Aug':(9==m)?'Sep':
		(10==m)?'Oct':(11==m)?'Nov':'Dec';
	return "" + mmm + " " + y;
}

function lastUpdated(){
	if($('.update-time').length){
		var s  = "Unknown";
		var d1;
		if(0 != (d1=Date.parse(document.lastModified))) {
			s = "" + date_mmmddyyHHMM(new Date(d1)) + ".";
		}
		$('.update-time').text('Last updated on ' + s);
	}
	if($('.current-version').length){
		$('.current-version').text('Version ' + versionUpdate);
	}
}



// Get the current scheme, and apply the opposite
function toggleColorScheme(){
	if (localStorage.getItem('darkmode'))
		localStorage.removeItem('darkmode');
	else
		localStorage.setItem('darkmode', 'yes');

	applyPreferredColorScheme();
}

// Apply the chosen color scheme by traversing stylesheet rules, and applying a medium.
function applyPreferredColorScheme() {
	let systemScheme = 'light';
	let invScheme = 'dark';
	if(window.matchMedia('(prefers-color-scheme: dark)').matches){
		systemScheme = 'dark';
		invScheme = 'light';
	}
	let darkmode = false;
	if(localStorage.getItem('darkmode'))
		darkmode = true;

	for (var s = 0; s < document.styleSheets.length; s++) {

		for (var i = 0; i < document.styleSheets[s].cssRules.length; i++) {
			rule = document.styleSheets[s].cssRules[i];

			if (rule && rule.media && rule.media.mediaText.includes("prefers-color-scheme")) {
				rule_media = rule.media.mediaText;

				// if (rule_media.includes("light") && darkmode) {
				if (darkmode) {
					new_rule_media = rule_media.replace(invScheme, systemScheme);
				}
				else {
				// if (rule_media.includes("dark")) {
					// new_rule_media = rule_media.replace("dark", "light");
					new_rule_media = rule_media.replace(systemScheme, invScheme);
				}
				rule.media.deleteMedium(rule_media);
				rule.media.appendMedium(new_rule_media);
			}
		}
	}
}

$(document).ready(function()
{	
	update_lang();
	loadMenubar();
	loadFooter();
	updateAge();
	
	$(window).on('resize', function(){
		$('.right-menu-dropmenu').hide();
	});
	show_lang($(this),lang);
	lastUpdated();
	$('html').css('display','block');

	applyPreferredColorScheme();
	const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
	darkModePreference.addEventListener("change", e => applyPreferredColorScheme());
});
