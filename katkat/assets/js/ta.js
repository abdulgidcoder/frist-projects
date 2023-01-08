$(document).ready(function() {

  // Stuff to do as soon as the DOM is ready

  // Carousel Options

  // Carousel a
  $('.ta-style-a .owl-carousel').owlCarousel({
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 1,
    dots:false,
  });

  // Carousel Home Style b
  $('.ta-style-b .owl-carousel').owlCarousel({
    margin:10,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 1,
    dots:false,
    stagePadding: 119.5,
    nav:false
  });



  // Carousel Options c
  $('.ta-style-c .owl-carousel').owlCarousel({
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 3,
    center:true,
  });

  var owl = $('.ta-slider-home .owl-carousel, .ta-style-c .owl-carousel');
  owl.owlCarousel();
  // Go to the next item
  $('.customNextBtn').click(function() {
      owl.trigger('next.owl.carousel');
  });
  // Go to the previous item
  $('.customPrevBtn').click(function() {
      // With optional speed parameter
      // Parameters has to be in square bracket '[]'
      owl.trigger('prev.owl.carousel', [300]);
  });

  // Carousel Options d
  $('.ta-style-d .owl-carousel').owlCarousel({
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 3,
    center:true
  });

  // Carousel Options e
  $('.ta-style-e .owl-carousel').owlCarousel({
    margin:10,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 3,
    center:true,
    stagePadding: 119.5,
  });

  // Carousel Options f
  $('.ta-style-f .owl-carousel').owlCarousel({
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 3,
    center:true
  });

  // Carousel Options J
  $('.ta-style-j .owl-carousel').owlCarousel({
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 4,
    center:true,
    margin: 10
  });

  // posts Carousel Options
  $('.slider-posts .owl-carousel ,.slider-products .owl-carousel ').owlCarousel({
    dots: true,
    smartSpeed: 1100,
    dotsSpeed: 1000,
    dragEndSpeed: 1000,
    singleItem: true,
    pagination: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    loop: true,
    margin: 30,
    items: 4,
  });

  // Instagram Carousel Options
  $('.instagram-carousel .owl-carousel').owlCarousel({
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dragEndSpeed: 2500,
    smartSpeed: 2500,
    loop: true,
    items: 6,
    dots:false,
    center:true
  });

  $(".ta-search-toggle").click(function () {
    $(".ta-search-header").fadeToggle();
  });


  $(window).scroll(function () {
    if ($(this).scrollTop() > 240) {
        $('.ta-header-bottom').css("position", "fixed").addClass("ta-menu-top");
        $('.ta-header-bottom .ta-menu').removeClass("border");
    } else {
        $('.ta-header-bottom').css("position", "relative").removeClass("ta-menu-top");
        $('.ta-header-bottom .ta-menu').addClass("border");
    }
  });

  console.log($(window).scrollTop());

});
