(() => {
    const swiper = new Swiper('.swiper', {
        speed: 400,
        spaceBetween: 150,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        }
    });

    this.changeHeader();

    window.addEventListener('scroll', () => {
        this.changeHeader();
    });

    $("body").on("click", "a", function(event) {
        if(!$(this).attr('target')){
            event.preventDefault();
            var id = $(this).attr('href'),
                top = $(id).offset().top;
            $('body,html').animate({ scrollTop: top - 50 }, 500);
        }else if($(this).attr('target') == '_blank'){

        }
    });

    $('*[popup-open]').click(function() {
        popup = $(this).attr('popup-open');
        if (typeof popup != 'undefined') {
            arr = popup.split(',');
            arr.forEach((element) => {
                popup = element.trim();
                $('.' + popup).addClass('visible');
            });
        }
    });

    $('.views__content').on('click', '.swiper-slide-picture', function() {
        if(document.documentElement.clientWidth > 768){
            prewStart($(this));
        }
    });

    $('.PopupWindow .PhotoPrew').on('click', '.button', function() {
        if ($(this).hasClass('button-next')) {
            nextSlidePrewPhoto();
        } else {
            prevSlidePrewPhoto();
        }
    });

    $('.popup').on('click', '.button-close', function(e){
        $(this).parent().parent().removeClass('visible');
        $(this).parent().parent().parent().removeClass('visible');
    });

    $('.send-form .btn.submit').click(function() {
        phone = $(this).parent().parent().find('input[name="phone"]').val();
        username = $(this).parent().parent().find('input[name="username"]').val();
        time = $(this).parent().parent().find('input[name="time"]').val();
        err = 0;
        if (phone.length < 1) {
            err++;
            viewErr($(this).parent().find('input[name="phone"]'));
        }
        if (username.length < 1) {
            err++;
            viewErr($(this).parent().find('input[name="username"]'));
        }
        if (err == 0) {
            data = {
                'phone_number': phone,
                'username': username,
                'call_time': time
            }
            $(this).parent().parent().find('input[name="phone"]').val('');
            $(this).parent().parent().find('input[name="username"]').val('');
            $(this).parent().parent().find('input[name="time"]').val('');
            send_form(data);
        }
    });
})();

$(document).click((e) => {
    path = e.originalEvent.path;
    err = 0;
    path.forEach((elem) => {
        if ($(elem).attr('popup-open')) {
            err++;
        }
        if ($(elem).hasClass('swiper-slide-picture')) {
            err++;
        }
    });
    if (err == 0) {
        allPopupClosed($(this), e.originalEvent);
    }
});

function viewErr(block) {
    if (typeof pauseViewErr != 'undefined') {
        clearTimeout(pauseViewErr);
    }
    $(block).addClass('error');
    pauseViewErr = setTimeout(function() {
        $(block).parent().find('input').removeClass('error');
    }, 1000);
}

function prevSlidePrewPhoto() {
    index = Number($('.PopupWindow .PhotoPrew').attr('data-slide'));
    id = $('.PopupWindow .PhotoPrew').attr('data-id');
    countSlide = $('#' + id).find('div').length;
    var nextSlide;
    if ((index - 1) < 0) {
        nextSlide = countSlide - 1;
    } else {
        nextSlide = index - 1;
    }
    src = $('#' + id).find('div:eq(' + nextSlide + ') img').attr('src');
    $('.PopupWindow .PhotoPrew').attr({
        'data-slide': nextSlide
    });
    $('.PopupWindow .PhotoPrew .content_box img').attr({ 'src': src });
}

function nextSlidePrewPhoto() {
    index = $('.PopupWindow .PhotoPrew').attr('data-slide');
    id = $('.PopupWindow .PhotoPrew').attr('data-id');
    countSlide = $('#' + id).find('div').length;
    var nextSlide;
    if ((index + 1) > (countSlide - 1)) {
        nextSlide = 0;
    } else {
        nextSlide = index + 1;
    }
    src = $('#' + id).find('div:eq(' + nextSlide + ') img').attr('src');
    $('.PopupWindow .PhotoPrew').attr({
        'data-slide': nextSlide
    });
    $('.PopupWindow .PhotoPrew .content_box img').attr({ 'src': src });
}

function prewStart(block) {
    src = $(block).attr('src');
    index = $(block).parent().index();
    id = $(block).parent().parent().attr('id');
    $('.PopupWindow .PhotoPrew').attr({
        'data-slide': index,
        'data-id': id
    });
    $('.PopupWindow .PhotoPrew .content_box img').attr({ 'src': src });
    $('.PopupWindow').addClass('visible');
    $('.PopupWindow .PhotoPrew').addClass('visible');
}

function allPopupClosed(div, e) {
    var PopupArray = ['PopupCallMe', 'PopupPrice', 'PhotoPrew', 'MultiButtonTool'];
    var searchPop;
    err = 0;
    e.path.forEach(element => {
        PopupArray.forEach(pop => {
            if ($(element).hasClass(pop)) {
                err++;
                searchPop = pop;
            }
        });
    });
    if (err == 0) {
        $('.popup.visible').removeClass('visible');
    }
}

function changeHeader() {
    let header = document.querySelector(".header");
    if (pageYOffset > 30) {
        header.classList.add("header-attached");
    } else {
        header.classList.remove("header-attached");
    }
}

function send_form(dataForm) {
    $.ajax({
        type: "POST",
        url: "mail.php",
        dataType: "JSON",
        data: {
            'action': 'sendEmail',
            'data': dataForm
        },
        success: function(msg) {
            if (msg == true) {
                window.location.href = "https://pdpufa.ru/thanks.html";
                /* $('.popup').removeClass('visible');
                $('.PopupWindow').addClass('visible');
                $('.PopupWindow .PopupThanks').addClass('visible');
                setTimeout(function(){
                    $('.popup').removeClass('visible');
                }, 3000); */
            }
        }
    });
}