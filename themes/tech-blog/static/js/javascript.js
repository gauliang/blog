// Scroll to top
$(function () {
    var btn = $('#scroll-to-top');

    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    });

})

// External links
$(function () {
    var content = $('#post-content');
    var links = content.find('a');
    var hostname = window.location.hostname;

    links.each(function (index, item) {
        if (item.hostname != hostname) {
            $(item).attr({ 'target': '_blank', 'class': 'ext-link' })
        }
    })
})

// Responsive code-block and table
$(function () {
    var Responsive = function (select, inner, padding) {
        var tableResponsive = $(select);
        padding = padding ? padding : 60;
        var _box, _boxWidth, _boxWidthMax, _boxLeft, _boxLeftMax, _table, _tableWidth, _timer, _timer2;

        tableResponsive.hover(function () {
            _box = $(this);

            if (_timer) {
                clearTimeout(_timer);
                clearTimeout(_timer2);
                _timer = _timer2 = null
            }

            _timer = setTimeout(function () {

                _table = _box.find(inner);
                _boxWidth = _box.width();
                _box.width(_boxWidth)
                _boxLeft = _box.offset().left;
                _boxWidthMax = Math.floor($('#navigation').width() - 60)
                _boxLeftMax = Math.floor(30 - _box.offset().left)
                _tableWidth = _table.width()


                if (_box.width() >= _tableWidth) {
                    return null;
                }

                _box.css({
                    'margin-left': (_boxWidth - _tableWidth) / 2 < _boxLeftMax ? _boxLeftMax : 0 - Math.floor((_tableWidth - _boxWidth) / 2),
                    'width': _tableWidth + padding > _boxWidthMax ? _boxWidthMax : _tableWidth + padding,
                })
                _timer2 = setTimeout(function () {
                    _box.css({ 'overflow-x': 'auto' })
                }, 300)
            }, 300)

        }, function () {
            $(this).css({ 'margin-left': '0', width: '100%', 'overflow-x': 'hidden' })
            clearTimeout(_timer);
            clearTimeout(_timer2);
            _timer = _timer2 = null
        })
    }

    Responsive('.table-responsive', 'table');
    Responsive('.highlight', 'table', 1);
})

// Hero animate
+ function () {
    var svgbox = $('#hero-svg');

    if(svgbox.length==0){
        return false;
    }
    
    var draw = SVG().addTo('#hero-svg').size("100%", "100%")
    var width = svgbox.width();
    var height = svgbox.height();
    var types = ['rect','circle','line'];
    var elements = []
    var number = 80;    

    var random = function(min, max){
        return Math.floor(Math.random() * max + min)
    }
    var a = [];

    var generateElement = function(elementType){
        var element = null
        var randomnumber = random(5,80);
        var randomx = random(0,width);
        var randomy = random(0,height);
        var group = null

        switch (elementType){
            case 'rect':
                group = draw.group()

                element = draw.rect(randomnumber, randomnumber).attr({ fill: '#fff', opacity:.6-randomnumber/80}).radius(randomnumber*.1);
                element.attr({ x: randomx, y: randomy+height }).rotate(45);
                group.add(element)
                group.animate({ ease: '=', duration: randomnumber*800 }).dmove(0, - height*2 -80).loop();
                break;
            case 'circle':
                element = draw.circle(randomnumber).attr({ fill: '#fff', opacity:.6-randomnumber/80})
                element.attr({ cx: randomx, cy: randomy+height })
                element.animate({ ease: '=', duration: randomnumber*800 }).dmove(0, - height*2-80).loop();

                break;
            case 'line':
                element = draw.rect(3, randomnumber*2).attr({ fill: '#fff',  opacity:.6-randomnumber/80}).radius(randomnumber*.1);
                element.attr({ x: randomx, y: randomy+height })
                element.animate({ ease: '=', duration: randomnumber*800 }).dmove(0, - height*2-randomnumber*2).loop();
                break
        }
        return element;
    }

    for (let index = 0; index < number; index++) {
        // let ee = generateElement(types[random(0,2)])
        // if (index<5) ee.rotate(45)
        elements.push(generateElement(types[random(0,4)]))
    }

}()