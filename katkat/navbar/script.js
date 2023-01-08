/**
 * Declaring and initializing global variables
 */
var $doc          = jQuery(document),
		$window       = jQuery(window),
		$html         = jQuery('html'),
		$body         = jQuery('body'),
		$fixedEnabled = jQuery('.fixed-enabled'),
		$themeHeader  = jQuery('#theme-header'),
		$the_post     = jQuery('#the-post'),
		$wrapper      = jQuery('#tie-wrapper'),
		$container    = jQuery('#tie-container'),
		$postContent  = $the_post.find( '.entry' ),
		userAgent     = navigator.userAgent,
		isDuringAjax  = false,
		megaMenuAjax  = false,
		intialWidth   = $window.width(),
		adBlock       = false;



$doc.ready(function(){

	'use strict';

	tie_animate_element();


	/**
	 * Ad Blocker
	 */
	if( tie.ad_blocker_detector && typeof $tieE3 == 'undefined' ){
		adBlock = true;
		$html.css({'marginRight': getScrollBarWidth(), 'overflow': 'hidden'});
		setTimeout(function(){ $body.addClass('tie-popup-is-opend')},10);
		tieBtnOpen('#tie-popup-adblock');
	}


	/**
	 * Story Index
	 */
	jQuery('.index-title').viewportChecker({
		repeat: true,
		offset: 30,
		callbackFunction: function( elem, action ){
			var ID = elem.attr('id');
			jQuery('#story-index a').removeClass('is-current');
			jQuery('#trigger-' + ID).addClass('is-current');
		}
	});

	jQuery('#story-index').theiaStickySidebar({
		'containerSelector'   : '#the-post .entry-content',
		'additionalMarginTop' : 150,
	});

	$doc.on('click', '#story-index-icon', function(){
		jQuery('#story-index').find( 'ul' ).toggle();
	});


	/**
	 * Remove the products from: Popup shopping cart, Cart Widget, Cart Page
	 */
	$doc.on('click', '.remove', function(){
		var $element = jQuery(this).parent('li');
		$element.add(jQuery(this).parents('.cart_item')).velocity('stop').velocity('transition.bounceLeftOut', { duration: 600});
	});


	/**
	 * Tooltips
	 */
	jQuery('[data-toggle="tooltip"]').tooltip();


	/**
	 * Toggle post content for mobile
	 */
	$doc.on('click', '#toggle-post-button', function(){
		$postContent.toggleClass('is-expanded');
		jQuery(this).hide();
		return false;
	});


	/**
	 * Toggle Shortcode
	 */
	$doc.on('click', 'h3.toggle-head', function(){
		var $thisElement = jQuery(this).parent();
		$thisElement.find('div.toggle-content').slideToggle();
		$thisElement.toggleClass('tie-sc-open tie-sc-close');
	});


	/**
	 * Responsive Videos
	 */
	$wrapper.fitVids({
		ignore         : '.video-player-wrapper, .youtube-box, #buddypress, .featured-area .fluid-width-video-wrapper',
		customSelector : "iframe[src*='maps.google.com'], iframe[src*='google.com/maps'], iframe[src*='dailymotion.com']",
	});


	/**
	 * Share Buttons : Print
	 */
	$doc.on('click', '.print-share-button', function(){
		window.print();
		return false;
	});


	/**
	 * Open Share buttons in a popup
	 */
	$doc.on('click', '.share-links a', function(){
		var link = jQuery(this).attr('href');
		if( link != '#' ){
			window.open( link, 'TIEshare', 'height=450,width=760,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0' );
			return false;
		}
	});


	/**
	 * Masonry
	 */
	if( jQuery.fn.masonry ){

		var $grid = jQuery('#masonry-grid'),
				onloadsWrap = jQuery('#media-page-layout');

		$grid.masonry({
			columnWidth     : '.grid-sizer',
			gutter          : '.gutter-sizer',
			itemSelector    : '.post-element',
			percentPosition : true,
			isInitLayout    : false, // v3
			initLayout      : false, // v4
			originLeft      : ! is_RTL,
			isOriginLeft    : ! is_RTL,
		}).addClass( 'masonry-loaded' );

		// Run after masonry complete
		$grid.masonry( 'on', 'layoutComplete', function(){
			isDuringAjax = false;
		});

		// Run the masonry
		$grid.masonry();

		// Load images and re fire masonry
		$grid.imagesLoaded().progress( function(){
			$grid.masonry('layout');
		});

		onloadsWrap.find('.loader-overlay').fadeOut().remove();
		onloadsWrap.find('.post-element').velocity('transition.slideUpIn',{duration: 400, stagger: 200});
	}


	/**
	 * Lightbox
	 */
	jQuery( 'a.lightbox-enabled' ).iLightBox({
    skin: tie.lightbox_skin,
    callback: {
      onOpen: function(){
        $html.css({'marginRight': getScrollBarWidth(), 'overflow': 'hidden'});
      },
      onHide: function(){
        setTimeout(function(){
          $html.removeAttr('style');
        }, 300);
      }
    }
  });

  if( tie.lightbox_all ){
    $the_post.find('div.entry a').not( 'div.entry .gallery a' ).each(function(i, el){
      var href_value = el.href;
      if (/\.(jpg|jpeg|png|gif)$/.test(href_value)){
        jQuery(this).iLightBox({
          skin: tie.lightbox_skin,
          callback: {
            onOpen: function(){
              $html.css({'marginRight': getScrollBarWidth(), 'overflow': 'hidden'});
            },
            onHide: function(){
              setTimeout(function(){
                $html.removeAttr('style');
              }, 300);
            }
          }
        });
      }
    });
  };

  if( tie.lightbox_gallery ){
    $the_post.find('div.entry .gallery a').each(function(i, el){
      var href_value = el.href;
      if (/\.(jpg|jpeg|png|gif)$/.test(href_value)){
        jQuery(this).addClass( 'ilightbox-gallery' );
      }
    });

    $the_post.find( '.ilightbox-gallery' ).iLightBox({
      skin: tie.lightbox_skin,
      path: tie.lightbox_thumb,
      controls: {
        arrows: tie.lightbox_arrows,
      },
      callback: {
        onOpen: function(){
          $html.css({'marginRight': getScrollBarWidth(), 'overflow': 'hidden'});
        },
        onHide: function(){
          setTimeout(function(){
            $html.removeAttr('style');
          }, 300);
        }
      }
    });
  };


	/**
	 * Tabs
	 */
	jQuery('.tabs-wrapper').each(function(){

		var $tab = jQuery( this );
		$tab.find('.tabs-menu li:first').addClass('is-active');

		if( $tab.hasClass( 'tabs-vertical') ){
			var minHeight = $tab.find('.tabs-menu').outerHeight();
			$tab.find('.tab-content').css({minHeight: minHeight});
		}

		$tab.find('.tabs-menu li').on( 'click', function(){

			var $tabTitle = jQuery( this );
			if( ! $tabTitle.hasClass( 'is-active' ) ){

				$tabTitle.parents('.tabs-menu').find('li').removeClass('is-active');
				$tabTitle.addClass('is-active');

				$tabTitle.parents('.tabs-wrapper').find('.tab-content').hide();
				var currentTab = $tabTitle.find('a').attr('href'),
				    activeTab  = jQuery( currentTab ).show();

				activeTab.find('.tab-content-elements li').velocity('stop').velocity('transition.slideUpIn',{stagger: 100 ,duration: 500});
				activeTab.find('.tab-content-wrap').velocity('stop').velocity('transition.slideDownIn',{duration: 700});

				tie_animate_element( activeTab );
			}
			return false;
		});
	});


	/**
	 * Menus
	 */
	// Properly update the ARIA states on focus (keyboard) and mouse over events
	jQuery( 'nav > ul' ).on( 'focus.wparia  mouseenter.wparia', '[aria-haspopup="true"]', function ( ev ){
		jQuery( ev.currentTarget ).attr( 'aria-expanded', true );
	});

	// Properly update the ARIA states on blur (keyboard) and mouse out events
	jQuery( 'nav > ul' ).on( 'blur.wparia  mouseleave.wparia', '[aria-haspopup="true"]', function ( ev ){
		jQuery( ev.currentTarget ).attr( 'aria-expanded', false );
	});

	// iPad menu hover bug with Safari
	if( userAgent.match(/iPad/i) ){
		if( userAgent.search('Safari') >= 0 && userAgent.search('Chrome') < 0 ){
			jQuery('#main-nav li.menu-item-has-children a, #main-nav li.mega-menu a, .top-bar li.menu-item-has-children a').attr('onclick','return true');
		}
	}


	/**
	 * Magazine box filters flexmenu
	 */
	jQuery('.mag-box-filter-links, .main-content .tabs-widget .tabs-menu').flexMenu({
		threshold   : 0,
		cutoff      : 0,
		linkText    : '<span class="tie-icon-dots-three-horizontal"></span>',
		linkTextAll : '<span class="tie-icon-dots-three-horizontal"></span>',
		linkTitle   : '',
		linkTitleAll: '',
		showOnHover : ( intialWidth > 991 ? true : false ),
	});
	jQuery( '.mag-box-options, .main-content .tabs-widget .tabs-menu' ).css({ 'opacity': 1 });


	/**
	 * Sticky Menus
	 */
	if( $fixedEnabled.length > 0 && intialWidth > 991){
		var menuHeight   = $fixedEnabled.outerHeight(),
		    stickyNavTop = $fixedEnabled.offset().top;

		jQuery('.main-nav-wrapper').height(menuHeight);

		$fixedEnabled.tiesticky({
			offset: stickyNavTop,
			behaviorMode: tie.sticky_behavior,
			tolerance   : 0,
		});
	}


	/**
	 * Sticky Sidebars
	 */
	if( jQuery( '.is-sticky' ).length ){
		var stickySidebarBottom = 35,
		stickySidebarTop = ( $fixedEnabled.length > 0 ) ? 68 : 0;
		stickySidebarTop = ( tie.sticky_behavior != 'default' ) ? 8 : stickySidebarTop;
		stickySidebarTop = ( $body.hasClass('admin-bar') ) ? stickySidebarTop + 32 : stickySidebarTop;
		stickySidebarTop = ( $body.hasClass('border-layout') ) ? stickySidebarTop + 30 : stickySidebarTop;

		jQuery( '.is-sticky' ).theiaStickySidebar({
			//'containerSelector'      : '.main-content-row',
			'additionalMarginTop'    : stickySidebarTop,
			'additionalMarginBottom' : stickySidebarBottom,
			'minWidth'               : 990,
		});
	}


	/**
	 * Popup Module
   */
	var $tiePopup = jQuery('.tie-popup' );

  $doc.on( 'click', '.tie-popup-trigger', function (event){
    event.preventDefault();
    tieBtnOpen('#tie-popup-login');
  });

  if ( jQuery('.tie-search-trigger').length ){
    if ( tie.type_to_search ){
        $doc.keypress(function(e){
          if( ! jQuery( 'input, textarea' ).is( ':focus' ) &&
              ! jQuery( '#tie-popup-login' ).is( ':visible' ) &&
              e.which !== 27 && e.which !== 32 && e.which !== 13 && !e.ctrlKey && !e.metaKey && !e.altKey && (detectIE() > 9 || detectIE() == false) ){

            $container.removeClass('side-aside-open');
            tieBtnOpen('#tie-popup-search-wrap');
          }
        });
      }

    jQuery('.tie-search-trigger').on( 'click', function (){
      tieBtnOpen('#tie-popup-search-wrap');
      return false;
    });
  }

  function tieBtnOpen(windowToOpen){
    jQuery(windowToOpen).show();

		if(detectIE() == false && windowToOpen == '#tie-popup-search-wrap' ){
			$tiePopup.find('form input[type="text"]').focus();
		}

		setTimeout(function(){ $body.addClass('tie-popup-is-opend')},10);
    $html.css({'marginRight': getScrollBarWidth(), 'overflow': 'hidden'});
  }

  // Close popup when clicking the esc keyboard button
  if ( $tiePopup.length && ! adBlock ){
    $doc.keyup(function(event){
			if ( event.which == '27' && $body.hasClass('tie-popup-is-opend')){
        tie_close_popup();
      }
    });
  }

  // Close Popup when click on the background
  $tiePopup.on('click', function(event){
    if( jQuery( event.target ).is('.tie-popup:not(.is-fixed-popup)') ){
      event.preventDefault();
      tie_close_popup();
    }
  });

  // Close Popup when click on the close button
  jQuery('.tie-btn-close').on( 'click', function (){
    tie_close_popup();
    return false;
  });

  // Popup close function
  function tie_close_popup(){
    jQuery.when($tiePopup.fadeOut(500)).done(function(){
      $html.removeAttr('style');
    });
    jQuery('.autocomplete-suggestions').fadeOut();
    $body.removeClass('tie-popup-is-opend');
    jQuery('#tie-popup-search-input').val('');
  }

  // get the scrollbar width
  function getScrollBarWidth (){
    var outer = jQuery('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
        widthHasScroll = jQuery('<div>').css({width: '100%'}).appendTo(outer).outerWidth();

    outer.remove();
		return 100 - widthHasScroll;
  };


	/**
	 * Slideout Sidebar
	 */
	function hasParentClass( e, classname ){
		if( e === document ){
			return false;
		}

		if( jQuery(e).hasClass( classname ) ){
			return true;
		}

		return e.parentNode && hasParentClass( e.parentNode, classname );
	}

	var resetMenu = function(){
		$container.removeClass('side-aside-open');
	},
	bodyClickFn = function(evt){
		if( !hasParentClass( evt.target, 'side-aside' ) ){
			resetMenu();
			document.removeEventListener( 'touchstart', bodyClickFn );
			document.removeEventListener( 'click', bodyClickFn );
		}
	},
	el = jQuery('.side-aside-nav-icon, #mobile-menu-icon');

	el.on( 'touchstart click', function( ev ){
		ev.stopPropagation();
		ev.preventDefault();
		$container.addClass('side-aside-open');
		jQuery('.autocomplete-suggestions').hide();

	});

	$container.on( 'touchstart click', bodyClickFn );

	// close side nav whene colose in esc button on keyboard
	$doc.on('keydown', function(e){
		if( e.which == 27 ){
			resetMenu();
			document.removeEventListener( 'touchstart', bodyClickFn );
			document.removeEventListener( 'click', bodyClickFn );
		}
	});

	// close when click on close button inside the sidebar
	jQuery('.close-side-aside').on('click',function(){
		resetMenu();
	})

  // close the aside on resize when reaches the breakpoint
  $window.resize(function() {
    intialWidth = $window.width();

    if( intialWidth == 991 ){
      resetMenu();
    }
  });


	/**
	 * Scroll To #
	 */
	jQuery( 'a[href^="#go-to-"]' ).on('click', function(){
		var hrefId = jQuery(this).attr('href'),
		target = '#'+hrefId.slice(7);

		jQuery(target).velocity('stop').velocity('scroll', {
			duration : 800,
			offset   : ( $fixedEnabled.length > 0 ) ? -100 : -40,
			easing   : 'ease-in-out'
		});
		return false;
	});




	/**
	 * Go to top button
	 */
	var $topButton = jQuery('#go-to-top');
	$window.scroll(function(){
		if ( $window.scrollTop() > 100 ){
			$topButton.addClass('show-top-button')
		}
		else {
			$topButton.removeClass('show-top-button')
		}
	});




	/**
	 * Drop Down Menus
	 */
	var menu = function(el){
		this.target = el;
		this.target.find('.sub-menu,.menu-sub-content, .comp-sub-menu').css({
			'dispay'  : 'none',
			'opacity' : 0
		});
		this.target.on({
			mouseenter: this.reveal,
			mouseleave: this.conceal
		},'li');
	};

	// Show
	menu.prototype.reveal = function(){
		var target = jQuery(this).children('.sub-menu,.menu-sub-content, .comp-sub-menu');
		if (target.hasClass('is_open')){
			target.velocity('stop').velocity('reverse');
		}
		else {
			target.velocity('stop').velocity(
				'transition.slideDownIn',{
					duration: 250,
					delay: 0,
					complete : function(){
						target.addClass('is_open');
					}
			});
		}
	};

	// Hide
	menu.prototype.conceal = function(){
		var target = jQuery(this).children('.sub-menu,.menu-sub-content, .comp-sub-menu');
		target.velocity('stop').velocity(
			'transition.fadeOut',{
				duration: 100,
				delay: 0,
				complete: function(){
					target.removeClass('is_open');
				}
			}
		);
	};
	var $menu    = jQuery('ul.components, #theme-header .menu');
	var dropMenu = new menu($menu);




	/**
	 * Custom Scrollbar
	 */
	if(jQuery.fn.mCustomScrollbar && $body.hasClass('is-desktop')){

		jQuery('.has-custom-scroll').each(function(){
			var thisElement   = jQuery(this),
			    scroll_height = thisElement.data('height')  ? thisElement.data('height')  : 'auto',
			    data_padding  = thisElement.data('padding') ? thisElement.data('padding') : 0;

			thisElement.mCustomScrollbar('destroy');

			if ( thisElement.data('height') == 'window' ){
				var thisHeight   = thisElement.height(),
				    windowHeight = $window.height() - data_padding - 50;

				scroll_height = ( thisHeight < windowHeight ) ? thisHeight : windowHeight;
			}

			thisElement.mCustomScrollbar({
				scrollButtons     : { enable: false },
				autoHideScrollbar : thisElement.hasClass('show-scroll') ? false : true,
				scrollInertia     : 100,
				mouseWheel        : {
					enable          : true,
					scrollAmount    : 60,
				},
				set_height        : scroll_height,
				advanced          : { updateOnContentResize: true },
				callbacks:{
					whileScrolling:function(){
						tie_animate_element(thisElement);
					}
				}
			});
		});

		var $instagramSection = jQuery('#footer-instagram .tie-instagram-photos-content-inner');
		if ( $instagramSection.length > 0 ){
			$instagramSection.mCustomScrollbar({
				axis: 'x',
				scrollInertia: 100,
				advanced: {autoExpandHorizontalScroll:true},
				horizontalScroll: true,
			});
		}
  }


	/**
	 * Parallax
	 */
	var $parallax = jQuery('.tie-parallax');
  if ( $parallax.length ){
    $parallax.jarallax({
			noAndroid: true,
			noIos: true,
    });

    $window.scroll(function(){
    	var scrolled = $window.scrollTop();
			$parallax.find('.entry-header, #go-to-content').css({ opacity : 1-(scrolled/1000) });
    });
  }


	/**
	 * Mega Menus
	 */
	//Featured post and check also
	$doc.on('mouseenter', '.mega-recent-featured, .mega-cat', function(){
		var menuItem    = jQuery(this),
				thePostsDiv = menuItem.find( '.mega-ajax-content' ),
		    isMegaCat   = false,
		    number      = 0;

		if( menuItem.hasClass('mega-cat') ){
			isMegaCat = true;
			number    = 5;

			if( menuItem.has( '.cats-vertical' ).length ){
				number  = 4;
			}
		}

		tie_mega_menu_category( menuItem, thePostsDiv, isMegaCat, number );
	});


	// Mega menu For menu with sub cats layout
	$doc.on('mouseenter', '.mega-sub-cat', function(){
		var menuItem = jQuery(this),
				theCatID = menuItem.attr('data-id');

		if( menuItem.hasClass('is-active') ) return;

		var theMenuParent = menuItem.closest( '.mega-menu' ),
				thePostsDiv   = theMenuParent.find( '.mega-ajax-content' ),
				number        = 5;

		if( theMenuParent.has( '.cats-vertical' ).length ){
			number  = 4;
		}

		theMenuParent.find( '.mega-sub-cat' ).removeClass( 'is-active' );
		menuItem.addClass( 'is-active' );

		if( thePostsDiv.find( '#loaded-' + theCatID ).length ){
			thePostsDiv.find( 'ul' ).hide();

			var currentUL = thePostsDiv.find( '#loaded-' + theCatID + ', .mega-check-also ul' ).show();

			// Animate the loaded items
			currentUL.find( 'li' ).hide().velocity('stop').velocity( 'transition.slideUpIn', {
				stagger : 100,
				duration: 500,
			});

			return false;
		}
		else{
			menuItem.removeClass( 'is-loaded' );
		}

		tie_mega_menu_category( menuItem, thePostsDiv, true, number );
		return false;
	});


	/**
	 * MEGA MENUS GET AJAX POSTS
	 */
	function tie_mega_menu_category( menuItem, thePostsDiv, isMegaCat, number ){
		var theCatID     = menuItem.attr('data-id'),
				postsNumber  = 7,
				featuredPost = true;

		if( theCatID && ! menuItem.hasClass( 'is-loaded' )){

			menuItem.addClass('is-loaded');

			if( isMegaCat ){
				postsNumber = number;
				featuredPost = false;
			}
			else if( menuItem.hasClass( 'menu-item-has-children' ) ){
				postsNumber = 4;
			}

			// Cancel the current Ajax request if the user made a new one
			if( megaMenuAjax && megaMenuAjax.readystate != 4 ){
				megaMenuAjax.abort();
			}

			// Ajax Call
			megaMenuAjax = jQuery.ajax({
				url : tie.ajaxurl,
				type: 'post',
				data: {
					action  : 'jannah_mega_menu_load_ajax',
					id      : theCatID,
					featured: featuredPost,
					number  : postsNumber,
				},
				beforeSend: function(data){
					// Add the loader
					if( ! thePostsDiv.find('.loader-overlay').length ){
						thePostsDiv.addClass('is-loading').append( tie.ajax_loader );
					}
				},
				success: function( data ){

					if( !featuredPost ){
						var content = '<ul id="loaded-'+ theCatID +'">'+ data +'</ul>';
					}
					else{
						var content = jQuery( data );
					}

					thePostsDiv.append( content );

					thePostsDiv.find( 'ul' ).hide();

					var currentUL  = thePostsDiv.find( '#loaded-' + theCatID + ', .mega-check-also ul' ).show().find('li'),
					    recentPost = thePostsDiv.find('.mega-recent-post');

					// Animate the loaded items
					recentPost.add(currentUL).hide().velocity('stop').velocity( 'transition.slideUpIn', {
						stagger : 100,
						duration: 500,
						complete: function(){
							tie_animate_element( thePostsDiv );
						}
					});
				},
				error: function( data ){
					menuItem.removeClass('is-loaded');
				},
				complete: function( data ){
					thePostsDiv.removeClass('is-loading').find('.loader-overlay').remove();
				},
			});
		}
	}


	/**
	 * Infinite Scroll for archives
	 **/
	jQuery('.infinite-scroll-archives').viewportChecker({
		repeat: true,
		offset: 60,
		callbackFunction: function(elem, action){
			if( isDuringAjax === false ){
				isDuringAjax = true;
				tie_ajax_archives();
			}
		}
	});


	/**
	 * Load More Button for archives
	 **/
	$doc.on( 'click', '#load-more-archives', function(){
		if( isDuringAjax === false ){
			isDuringAjax = true;
			tie_ajax_archives();
		}
	});




	/**
	 * Archives Ajax Pagination
	 */
	function tie_ajax_archives(){

		var pagiButton = jQuery('#load-more-archives');

		if( ! pagiButton.length ){
			return false;
		}

		var theQuery    = pagiButton.attr('data-query'),
				theURL      = pagiButton.attr('data-url'),
				maxPages    = pagiButton.attr('data-max'),
				buttonText  = pagiButton.attr('data-text'),
				currentPage = parseInt( pagiButton.attr('data-page') ) +1,
				is_masonry  = false;

		// Check if the Button Disabled
		if( pagiButton.hasClass( 'pagination-disabled' ) || currentPage > maxPages ){
			return false;
		}

		// Change the page address
		/*
		if ( typeof window.history.pushState == 'function'){

			theURL = theURL.replace( '99999', currentPage );

			var state = {
				page: currentPage,
				permalink: theURL
			};

			window.history.pushState( state, 'window.location.title', theURL );
		}
		*/

		// Page Layout
		if( jQuery('#masonry-grid').length > 0 ){
			var theBlock = jQuery('#masonry-grid');
			is_masonry = true;
		}
		else{
			var theBlock = jQuery('#posts-container');
		}

		var theLayout   = theBlock.attr('data-layout'),
		    theSettings = theBlock.attr('data-settings');

		// Ajax Call
		jQuery.ajax({
			url : tie.ajaxurl,
			type: 'post',
			data: {
				action  : 'jannah_archives_load_more',
				query   : theQuery,
				max     : maxPages,
				page    : currentPage,
				layout  : theLayout,
				settings: theSettings
			},
			beforeSend: function(data){
				pagiButton.html( tie.ajax_loader );
			},
			success: function( data ){

				data = jQuery.parseJSON(data);

				// Hide next posts button
				if( data['hide_next'] ){
					pagiButton.addClass( 'pagination-disabled' );
					pagiButton.html( data['button'] );
				}
				else{
					pagiButton.html( buttonText );
				}

				data = data['code'];
				data = data.replace( /<li class="/g, '<li class="posts-items-'+ currentPage +' ' );

				var content = jQuery( data );

				if( is_masonry ){
					theBlock.append( content ).masonry( 'appended', content );
					tie_animate_element( theBlockList_li );
					isDuringAjax = false;

					// Load images and re fire masonry
					theBlock.imagesLoaded().progress( function(){
						theBlock.masonry('layout');
					});

				}
				else{

					theBlock.append( content );
					var theBlockList_li = theBlock.find( '.posts-items-'+currentPage ).hide();

					// Animate the loaded items
					theBlockList_li.velocity('stop').velocity( 'transition.slideUpIn', {
						stagger : 100,
						duration: 500,
						complete: function(){
							tie_animate_element( theBlockList_li );
							isDuringAjax = false;
						}
					});
				}

			}
		});

		// Change the next page number
		pagiButton.attr( 'data-page', currentPage );

		return false;
	}


	/**
	 * Blocks Ajax Pagination
	 */
	$doc.on( 'click', '.block-pagination', function(){
		var pagiButton   = jQuery(this),
				theBlock     = pagiButton.closest('.mag-box'),
				theBlockID   = theBlock.get(0).id,
				theSection   = theBlock.closest('.section-item'),
				theTermID    = theBlock.attr('data-term'),
				currentPage  = theBlock.attr('data-current'),
				theBlockList = theBlock.find('.posts-list-container'),
				theBlockDiv  = theBlock.find('.mag-box-container'),
				options      = jQuery.extend( {}, window[ 'js_'+theBlockID.replace( 'tie-', 'tie_' ) ] ),
				theListClass = 'posts-items',
				isLoadMore   = false,
				sectionWidth = 'single';

		if( currentPage && options ){
			if( theTermID ){
				if( options[ 'tags' ] ){
					options[ 'tags' ] = theTermID;
				}
				else{
					options[ 'id' ] = theTermID;
				}
			}

			// Custom Block List Class
			if( options[ 'ajax_class' ] ){
				theListClass = options[ 'ajax_class' ];
			}

			// Check if the Button Disabled
			if( pagiButton.hasClass( 'pagination-disabled' ) ){
				return false;
			}

			// Check if the button type is Load More
			if( pagiButton.hasClass( 'load-more-button' ) ){
				currentPage++;
				isLoadMore = true;
			}

			// Next page button
			else if( pagiButton.hasClass( 'next-posts' ) ){
				currentPage++;
				theBlock.find( '.prev-posts' ).removeClass( 'pagination-disabled' );
			}

			// Prev page button
			else if( pagiButton.hasClass( 'prev-posts' ) ){
				currentPage--;
				theBlock.find( '.next-posts' ).removeClass( 'pagination-disabled' );
			}

			// Full Width Section
			if( theSection.hasClass( 'full-width' ) ){
				sectionWidth = 'full';
			}

			// Ajax Call
			jQuery.ajax({
				url : tie.ajaxurl,
				type: 'post',
				data: {
					action : 'jannah_blocks_load_more',
					block  : options,
					page   : currentPage,
					width  : sectionWidth
				},
				beforeSend: function(data){

					// Load More button----------
					if( isLoadMore ){
						pagiButton.html( tie.ajax_loader );
					}
					// Other pagination Types
					else{
						var blockHeight = theBlockDiv.height();
						theBlockDiv.append( tie.ajax_loader ).attr( 'style', 'min-height:' +blockHeight+ 'px' );
						theBlockList.addClass('is-loading');
					}
				},
				success: function( data ){

					data = jQuery.parseJSON(data);

					// Hide next posts button
					if( data['hide_next'] ){
						theBlock.find( '.next-posts').addClass( 'pagination-disabled' );
						if( pagiButton.hasClass( 'show-more-button' ) || isLoadMore ){
							pagiButton.html( data['button'] );
						}
					}
					else if( isLoadMore ){
						pagiButton.html( pagiButton.attr('data-text') );
					}

					// Hide Prev posts button
					if( data[ 'hide_prev' ] ){
						theBlock.find( '.prev-posts').addClass( 'pagination-disabled' );
					}

					// Posts code
					data = data['code'];

					// Load More button append the new items
					if( isLoadMore ){
						var content = ( '<ul class="'+theListClass+' posts-list-container clearfix posts-items-loaded-ajax posts-items-'+currentPage+'">'+ data +'</ul>' );
						content = jQuery( content );
						theBlockDiv.append( content );
					}

					// Other pagination Types
					else{
						var content = ( '<ul class="'+theListClass+' posts-list-container posts-items-'+currentPage+'">'+ data +'</ul>' );
						content = jQuery( content );
						theBlockDiv.html( content );
					}

					var theBlockList_li = theBlock.find( '.posts-items-'+currentPage );

					// Animate the loaded items
					theBlockList_li.find( 'li' ).hide().velocity('stop').velocity( 'transition.slideUpIn', {
						stagger: 100,
						duration: 500,
						complete: function(){
							tie_animate_element( theBlockList_li );
							theBlockDiv.attr( 'style', '' );
						}
					});
				}
			});

			// Change the next page number
			theBlock.attr( 'data-current', currentPage );
		}
		return false;
	});


	/**
	 * AJAX FILTER FOR BLOCKS
	 */
	$doc.on( 'click', '.block-ajax-term', function(){
		var termButton   = jQuery(this),
				theBlock     = termButton.closest('.mag-box'),
				theTermID    = termButton.attr('data-id'),
				theBlockID   = theBlock.get(0).id,
				theBlockList = theBlock.find('.posts-list-container'),
				theBlockDiv  = theBlock.find('.mag-box-container'),
				options      = jQuery.extend( {}, window[ 'js_'+theBlockID.replace( 'tie-', 'tie_' ) ] ),
				theListClass = 'posts-items';

		if( options ){

			// Set the data attr new values
			theBlock.attr( 'data-current', 1 );

			if( theTermID ){
				if( options[ 'tags' ] ){
					options[ 'tags' ] = theTermID;
				}
				else{
					options[ 'id' ] = theTermID;
				}

				theBlock.attr( 'data-term', theTermID );
			}
			else{
				theBlock.removeAttr( 'data-term' );
			}

			// Custom Block List Class
			if( options[ 'ajax_class' ] ){
				theListClass = options[ 'ajax_class' ];
			}

			// Ajax Call
			jQuery.ajax({
				url : tie.ajaxurl,
				type: 'post',
				data: {
					action: 'jannah_blocks_load_more',
					block : options,
				},
				beforeSend: function(data){
					var blockHeight = theBlockDiv.height();
					theBlockDiv.append( tie.ajax_loader ).attr( 'style', 'min-height:' +blockHeight+ 'px' );
					theBlockList.addClass('is-loading')
				},
				success: function( data ){

					data = jQuery.parseJSON(data);

					// Reset the pagination
					theBlock.find( '.block-pagination').removeClass( 'pagination-disabled' );
					var LoadMoreButton = theBlock.find( '.show-more-button' );
					LoadMoreButton.html( LoadMoreButton.attr('data-text') );

					// Active the selected term
					theBlock.find( '.block-ajax-term').removeClass( 'active' );
					termButton.addClass( 'active' );

					// Hide next posts button
					if( data['hide_next'] ){
						theBlock.find( '.next-posts').addClass( 'pagination-disabled' );
						theBlock.find( '.show-more-button' ).html( data['button'] )
					}

					// Hide Prev posts button
					if( data['hide_prev'] ){
						theBlock.find( '.prev-posts').addClass( 'pagination-disabled' );
					}

					// Posts code
					data = data['code'];

					var content = ( '<ul class="'+theListClass+' ajax-content posts-list-container">'+data+"</ul>" );
					content = jQuery( content );
					theBlockDiv.html( content );

					// Animate the loaded items
					theBlockDiv.find( 'li' ).hide().velocity('stop').velocity( 'transition.slideUpIn', {
						stagger: 100,
						duration: 500,
						complete: function(){
							tie_animate_element( theBlockDiv );
						}
					});

					theBlockDiv.attr( 'style', '' );
				}
			});

		}

		return false;
	});


	/**
	 * Reading Position Indicator
	 */
	if( tie.is_singular && tie.reading_indicator ){
		if( $postContent.length > 0 ){

			$postContent.imagesLoaded(function(){
				var content_height  = $postContent.height(),
						window_height   = $window.height();

				$window.scroll(function(){
					var percent     = 0,
							content_offset  = $postContent.offset().top,
							window_offest = $window.scrollTop();

					if (window_offest > content_offset){
						percent = 100 * (window_offest - content_offset) / (content_height - window_height);
					}
					jQuery('#reading-position-indicator').css('width', percent + '%');
				});
			});
		}
	}


	/**
	 * Check Also Box
	 */
	var $check_also_box = jQuery('#check-also-box');
	if( tie.is_singular && $check_also_box.length > 0 ){

		var articleHeight   = $the_post.outerHeight(),
		    checkAlsoClosed = false ;

		$window.scroll(function(){
			if( ! checkAlsoClosed ){
				var articleScroll = $window.scrollTop();
				if ( articleScroll > articleHeight ){
					$check_also_box.addClass('show-check-also');
				}
				else {
					$check_also_box.removeClass('show-check-also');
				}
			}
		});
	}

	jQuery('#check-also-close').on( 'click', function(){
		$check_also_box.removeClass('show-check-also');
		checkAlsoClosed = true ;
		return false;
	});




	/**
	 * BuddyPress
	 */
	if( tie.is_buddypress_active ){

		jQuery('div.activity').on( 'click', function(event){
			var $target = jQuery(event.target);
			if ( $target.parent().hasClass('load-more') ){
				$target.html( tie.ajax_loader );
			}
		});

		var $activity_list = jQuery('.main-content .activity-list li, .main-content #groups-list li, .main-content #members-list li');
		$activity_list.viewportChecker({
			callbackFunction: function(elem, action){
				elem.velocity('stop').velocity('transition.slideUpIn',{stagger: 200, duration: 500});
			}
		});

		jQuery('div.activity-type-tabs').on( 'click', function(event){
			jQuery('.activity').addClass('ajax-loaded');
			return false;
		});

		jQuery('div.item-list-tabs, .pagination-links').on( 'click', function(event){
			jQuery('#groups-dir-list, #members-dir-list').addClass('ajax-loaded');
		});

		if( jQuery.fn.masonry ){
			var $buddypressLists = jQuery('.main-content #groups-list, .main-content #members-list');
			$buddypressLists.imagesLoaded(function(){
				$buddypressLists.masonry({
					itemSelector    : 'li',
					percentPosition : true,
					originLeft      : ! is_RTL,
					isOriginLeft    : ! is_RTL,
				});
			});
		}
	}


	/**
	 * AJAX SEARCH
	 */
	jQuery('.is-ajax-search').devbridgeAutocomplete({
		serviceUrl : tie.ajaxurl,
		params     : {'action':'jannah_ajax_search'},
		minChars   : 3,
		width      : 370,
		maxHeight  : 'auto',
		noSuggestionNotice: tie.lang_no_results,
		showNoSuggestionNotice: true,
		onSearchStart: function(query){
			jQuery(this).parent().find('.fa').removeClass('fa-search').addClass('fa-spinner fa-spin');
		},
		onSearchComplete: function(query){
			jQuery( this ).parent().find('.fa').removeClass('fa-spinner fa-spin').addClass('fa-search');

	
		},
		formatResult: function(suggestion, currentValue){
			return suggestion.layout;
		},
		onSelect: function(suggestion){
			window.location = suggestion.url;
		}
	});




	/**
	 * Select and Share
	 */
	if( tie.is_singular && tie.select_share ){

		$postContent.mousedown(function (event){
			$body.attr('mouse-top',event.clientY+window.pageYOffset);
			$body.attr('mouse-left',event.clientX);
			if(!getRightClick(event) && getSelectionText().length > 0){
				jQuery('.fly-text-share').remove();
				document.getSelection().removeAllRanges();
			}
		});

		$postContent.mouseup(function (event){
			var t  = jQuery(event.target),
					st = getSelectionText(),
					ds = st;

			if(st.length > 3 && !getRightClick(event)){
				var mts = $body.attr('mouse-top'),
				    mte = event.clientY+window.pageYOffset;

				if( parseInt(mts) < parseInt(mte) ) mte = mts;

				var mlp = $body.attr('mouse-left'),
				    mrp = event.clientX,
				    ml  = parseInt(mlp)+(parseInt(mrp)-parseInt(mlp))/2,
				    sl  = window.location.href.split('?')[0],
				    maxl = 114;

				st   = st.substring(0,maxl);

				if( tie.twitter_username ){
					maxl = maxl - ( tie.twitter_username.length+2 );
					st   = st.substring(0,maxl);
					st   = st+' @'+tie.twitter_username;
				}

				var share_content = '';

				if( tie.select_share_twitter ){
					share_content += "<a href=\"https://twitter.com/share?url="+encodeURIComponent(sl)+"&text="+encodeURIComponent(st)+"\" class='fa fa-twitter' onclick=\"window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;\"></a>";
				}

				if( tie.select_share_facebook && tie.facebook_app_id ){
					share_content += "<a href=\"https://www.facebook.com/dialog/feed?app_id="+tie.facebook_app_id+"&amp;link="+encodeURIComponent(sl)+"&amp;description="+encodeURIComponent(ds)+"\" class='fa fa-facebook' onclick=\"window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;\"></a>";
				}

				if( tie.select_share_linkedin ){
					share_content += "<a href=\"https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(sl)+"&summary="+encodeURIComponent(ds)+"\" class='fa fa-linkedin' onclick=\"window.open(this.href, \'\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600\');return false;\"></a>";
				}

				if( share_content != '' ){
					$body.append( "<div class=\"fly-text-share\">"+ share_content +"</div>" );
				}

				jQuery('.fly-text-share').css({
					position: 'absolute',
					top     : parseInt(mte)-60,
					left    : parseInt(ml)
				}).velocity('stop').velocity('transition.expandIn',{duration: 200});
			}
		});
	}

	function getRightClick(e){
		var rightclick;
		if (!e) var e = window.event;
		if (e.which) rightclick = (e.which == 3);
		else if (e.button) rightclick = (e.button == 2);
		return rightclick;
	}

	function getSelectionText(){
		var text = '';
		if (window.getSelection){
			text = window.getSelection().toString();
		}
		else if (document.selection && document.selection.type != "Control"){
			text = document.selection.createRange().text;
		}
		return text;
	}





	/**
	 * Mobile Menus
	 */
	if( tie.mobile_menu_active ){
		var $mainNav    = jQuery('#main-nav div.main-menu > ul'),
		    $mobileMenu = jQuery('#mobile-menu'),
		    mobileItems = '';

		// Main Nav
		if( $mainNav.length ){
			var mobileItems = $mainNav.clone();

			mobileItems.find( 'div.mega-menu-content' ).remove();
			mobileItems.removeAttr('id').find( 'li' ).removeAttr('id');
			mobileItems.find( 'li.menu-item-has-children' ).append( '<span class="mobile-arrows fa fa-chevron-down"></span>' );
			$mobileMenu.append( mobileItems );

			/* if the mobile menu has only one element, show it's sub content menu */
			var mobileItemsLis = mobileItems.find('> li');
			if( mobileItemsLis.length == 1 ){
				mobileItemsLis.find('> .mobile-arrows').toggleClass('is-open');
				mobileItemsLis.find('> ul').show();
			}
		}

		// Top Nav
		if( tie.mobile_menu_top ){
			var $topNav = jQuery('#top-nav div.top-menu > ul');

			if( $topNav.length ){
				var mobileItemsTop = $topNav.clone();

				mobileItemsTop.removeAttr('id').find( 'li' ).removeAttr('id');
				mobileItemsTop.find( 'li.menu-item-has-children' ).append( '<span class="mobile-arrows fa fa-chevron-down"></span>' );
				$mobileMenu.append( mobileItemsTop );
			}
		}

		// Open, CLose behavior
		if( ! tie.mobile_menu_parent ){
			jQuery('#mobile-menu li.menu-item-has-children > a, #mobile-menu li.menu-item-has-children > .mobile-arrows').click(function(){
				jQuery(this).parent().find('ul:first').slideToggle(300);
				jQuery(this).parent().find('> .mobile-arrows').toggleClass('is-open');
				return false;
			});
		}
		else{
			jQuery('#mobile-menu li.menu-item-has-children .mobile-arrows').click(function(){
				jQuery(this).toggleClass('is-open').closest('.menu-item').find('ul:first').slideToggle(300);
				return false;
			});
		}
	}



	/**
	 * Taqyeem scripts
	 */
	// MOUSEMOVE HANDLER
	$doc.on( 'mousemove', '.taq-user-rate-active', function(e){
		var $rated = jQuery(this);

		if( $rated.hasClass('rated-done') ){
			return false;
		}

		if( !e.offsetX ){
			e.offsetX = e.clientX - jQuery(e.target).offset().left;
		}

		// Custom Code for Jannah
    var offset = e.offsetX,
        width = $rated.width(),
		score = Math.round((offset/width)*100);

    $rated.find('.user-rate-image span').attr( 'data-user-rate', score ).css('width', score + '%');
	});

	// CLICK HANDLER
	$doc.on( 'click', '.taq-user-rate-active', function(){

		var $rated = jQuery(this),
		    $ratedParent = $rated.parent(),
		    $ratedCount  = $ratedParent.find('.taq-count'),
		    post_id      = $rated.attr( 'data-id' ),
		    numVotes     = $ratedCount.text();

		if( $rated.hasClass('rated-done')){
			return false;
		}

		// Custom Code for Jannah
		var userRatedValue = $rated.find('.user-rate-image span').data('user-rate');
		$rated.find( '.user-rate-image' ).hide();
		$rated.append('<span class="taq-load">'+ tie.ajax_loader  +'</span>');
		// --------

		if (userRatedValue >= 95) {
			userRatedValue = 100;
		}

		var userRatedValueCalc = (userRatedValue*5)/100;

		// Ajax Call ----------
		jQuery.post(
			taqyeem.ajaxurl,
			{
				action: 'taqyeem_rate_post',
				post  : post_id,
				value : userRatedValueCalc
			},
			function( data ) {
				$rated.addClass('rated-done').attr('data-rate',userRatedValue);
				$rated.find('.user-rate-image span').width(userRatedValue+'%');

				jQuery('.taq-load').fadeOut(function () {
					$ratedParent.find('.taq-score').html( userRatedValueCalc );

					if( $ratedCount.length > 0 ){
						numVotes =  parseInt(numVotes)+1;
						$ratedCount.html(numVotes);
					}
					else{
						$ratedParent.find('small').hide();
					}

					$ratedParent.find('strong').html(taqyeem.your_rating);
					$rated.find('.user-rate-image').fadeIn();
			});
		}, 'html');

		return false;
	});

	// MOUSELEAVE HANDLER
	$doc.on( 'mouseleave', '.taq-user-rate-active', function(){
		var $rated = jQuery(this);
		if( $rated.hasClass('rated-done') ){
			return false;
		}
		var post_rate = $rated.attr('data-rate');
		$rated.find('.user-rate-image span').css('width', post_rate + '%');
	});

	// End Of Text :)
});


