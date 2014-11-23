    $(document).ready(function(){
      $('.box').find('.pic').each(function(){
      var imgClass = (this.width / this.height > 1) ? 'wide' : 'tall';
      $(this).addClass(imgClass);
     });
    });

    $("#background").css("background", "url(images/ex.jpg) no-repeat center center fixed");
