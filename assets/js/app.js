(function($){
	$.typecards = function() {
		var tc = {
			//setup
			menuState: 'closed',
			speed: 0.25,
			vpHeight:	function() {
				return $(window).height();
			},
			conHeight:	function() {
				var height = $('.main-app').height();
				if ( height === 0 ) { return tc.vpHeight(); }
				else { return height; }
			},
			margTop: function() {
				return (tc.conHeight() > 300) ? ( tc.conHeight() - 300 ) * 0.5 : 0;
			},
			offSet:	function() {
				return (tc.conHeight() < 600) ? tc.conHeight() * 0.85 : tc.conHeight() * 0.90;
			},
			setAppStyles: function() {
				var css = '.main{height:' + tc.conHeight() +'px;} .character{margin-top:' + tc.margTop() + 'px;}';

				if ( $('#app-styles').length === 0 ) {
					$('head').append('<style id="app-styles">' + css + '</style>');
				} else {
					$('#app-styles').html(css);
				}
			},
			initiateResizeListener: function() {
				$(window).resize(function() {
					tc.setAppStyles();

					if ( tc.menuState === 'open' ) {
						tc.openMenu();
					}
				});
			},
			isOpen: function() {
				if (tc.menuState === 'open' ) { return true; }
				else { return false; }
			},
			showMenu: function(speed) {
				var animations = tc.addAnimations(speed);
				var translate = tc.translateOpen();
				$('#anatomy_slider').attr('style', translate + animations);
			},
			hideMenu: function(speed) {
				var animations = tc.addAnimations(speed);
				var translate = tc.translateClosed();
				$('#anatomy_slider').attr('style', translate + animations);
			},
			addAnimations: function(speed) {
				return '-webkit-transition: all ' + speed + 's ease-out;-moz-transition: all ' + speed + 's ease-out;transition:all ' + speed + 's ease-out;';
			},
			translateOpen: function() {
				return '-webkit-transform:translate3d(0,-' + tc.offSet() +'px,0); -moz-transform:translate3d(0,-' + tc.offSet() +'px,0); transform:translate3d(0,-' + tc.offSet() +'px,0);';
			},
			translateClosed: function() {
				return '-webkit-transform:translate3d(0,0,0); -moz-transform:translate3d(0,0,0); transform:translate3d(0,0,0);';
			},
			removeAnimations: function(speed) {
				var translate = ( tc.menuState === 'open' ) ? tc.translateOpen() : tc.translateClosed();
				setTimeout(function() {
					$('#anatomy_slider').attr('style', translate);
				}, (speed * 1000) );
			},
			openMenu: function(speed) {
				tc.menuState = 'open';
				tc.showMenu(speed);
				tc.removeAnimations(speed);
			},
			closeMenu: function(speed) {
				tc.menuState = 'closed';
				tc.hideMenu(speed);
				tc.removeAnimations(speed);
			},
			triggerMenu: function() {
				if (tc.menuState === 'open') { tc.closeMenu(tc.speed); }
				else { tc.openMenu(tc.speed); }
			},
			flipCard: function(target) {
				var $parCard = $(target).closest('.card');
				$parCard.toggleClass('flipped');
			},
			isMenuTrigger: function(target) {
				var triggers = $('.menu-btn, #all-cards');
				if ( target.closest(triggers).length ) { return true; }
				else { return false; }
			},
			isInstTrigger: function(target) {
				var trigger = $('#inst-button');
				if ( target.closest(trigger).length ) { return true; }
				else { return false;}
			},
			isAboutTrigger: function(target) {
				var trigger = $('#about-button');
				if ( target.closest(trigger).length ) { return true; }
				else { return false;}
			},
			isFlipTrigger: function(target) {
				if ( target.closest('#anatomy_slider .card-body').length ) { return true; }
				else { return false; }
			},
			initiateClickListeners: function() {
				$('body').on( 'click', function(e) {
					var target = $(e.target);
					if ( tc.isMenuTrigger(target) ) {
						e.preventDefault();
						tc.triggerMenu(0.5);
					} else if ( tc.isInstTrigger(target) ) {
						e.preventDefault();
						$('#instructions').addClass('active');
						$('#about').removeClass('active');
					} else if ( tc.isAboutTrigger(target) ) {
						e.preventDefault();
						$('#about').addClass('active');
						$('#instructions').removeClass('active');
					} else if ( tc.isFlipTrigger(target) ) {
						e.preventDefault();

						if ( tc.menuState === 'closed'){
							tc.flipCard(target);
						} else {
							tc.closeMenu(0.5);
						}
					}
				});
			},
			initiateTouchListeners: function() {
				var touch, yOrg, yCur, yDif, yDis, yEnd, transDis;
				var speedHalf = tc.speed * 0.5;

				$('.menu-btn').on('touchstart', function(e) {

					touch = event.touches[0];
					yOrg = touch.pageY;
					yCur = yOrg;

					e.preventDefault();
				});

				$('.menu-btn').on('touchmove', function(e){

					touch	= event.touches[0];
					yCur	= touch.pageY;
					yDif	= (yCur - yOrg);
					var css;

					if (yDif > 0) {
						yDis		= yDif;
						transDis	= 'translate3d(0,-' + (tc.offSet() - yDis) + 'px,0)';
					} else {
						yDis		= (yDif * -1);
						transDis	= 'translate3d(0,-' + yDis + 'px,0)';
					}

					if (yCur < tc.offSet() && yDif > 0 && tc.menuState === 'open') {
						css = '-webkit-transform:' + transDis + '; -moz-transform:' + transDis + '; ransform:' + transDis + ';';
						$('#anatomy_slider').attr('style', css);
					} else if (yDif < 0 && yCur > (tc.conHeight() - tc.offSet()) && tc.menuState === 'closed') {
						css = '-webkit-transform:' + transDis + '; -moz-transform:' + transDis + '; ransform:' + transDis + ';';
						$('#anatomy_slider').attr('style', css);
					}

					e.preventDefault();
				});

				$('.menu-btn').on('touchend', function(){
					yEnd = yCur;

					if ( tc.menuState === 'closed') {
						if ( yEnd === yOrg ) { tc.openMenu(tc.speed); }
						else if ( yDis > 80 ) { tc.openMenu(speedHalf); }
						else { tc.closeMenu(speedHalf); }
					} else if ( tc.menuState === 'open' ) {
						if ( yEnd === yOrg ) { tc.closeMenu(tc.speed); }
						else if ( yDis > 80 ) { tc.closeMenu(speedHalf); }
						else { tc.openMenu(speedHalf); }
					}
				});
			},

			//initiate
			init: function() {
				tc.setAppStyles();
				tc.initiateResizeListener();
				tc.initiateClickListeners();
				tc.initiateTouchListeners();
				setTimeout(function() {
					tc.openMenu(0.5);
				}, 5);
			}
		};

		return {
			on: tc.init,
			trigger: tc.triggerMenu,
			open: tc.openMenu,
			close: tc.closeMenu
		};
	};

})(jQuery);

