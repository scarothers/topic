//widget script
(function() {

    //------- WIDGET SPECIFIC CODE BELOW HERE -------------
    function renderWidget(goesHere,passed) {
        goesHere.html(showData(passed, template));
        loadTopics();
    }
    
    function showData (data, template){
        //this is simple template routine that replaces {{keys}} with data
        //return populated html ready to insert
        var y;
        var x=template;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                y= new RegExp("{{ "+key+" }}", "g");                
                x=x.replace( y, data[key] );
            }
        }
        return x;
    }

    function getCacheToken(){
        //return an epoch timestamp rounded to the nearest five minutes
        var coeff = 1000 * 60 * 5;
        var date = new Date();
        var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
        return rounded.getTime();
    }

    function loadTopics(){
        $.ajax({
            type: "GET",
            url: "http://www.washingtonpost.com/wp-apps/topicly/?feed=mwidget",
            dataType: "jsonp",
            data: {
                token: getCacheToken()
            },
            cache: true,
            jsonpCallback: "topiclyCallback"
        });
    }

    window.topiclyCallback = function(data){
        $(".topicly-widget-content").html(data.html);
    }
    //------- WIDGET SPECIFIC CODE ENDS HERE ------------- 
    //------- WIDGET SPECIFIC CONFIG STARTS HERE --------------

    //---- wpWidge name is first variable and unique 
    var widget="topicly-widget";
    //------------------ html template here ----------------------------
    var template = '<div class="containerTitle"><a href="http://www.washingtonpost.com/wp-apps/topicly">Topicly</a></div><div class="module module-standard photo headlineOnly topicly-widget"><div class="topicly-widget-content"></div><div class="containerTitle credit"><a href="http://www.washingtonpost.com/wp-apps/topicly"></a></div></div>';
    //------------------ css here ----------------------------
    var css =   '.topicly-widget .topicly-topic{ background-repeat: no-repeat; background-position: center; background-size: cover; -webkit-box-shadow: inset 0px 0px 10px -3px black; -moz-box-shadow: inset 0px 0px 10px -3px black; box-shadow: inset 0px 0px 10px -3px black; height:100px; position:relative; }' +
                '.topicly-widget a .topicly-text{ position: absolute;width: 100%;bottom: 0px;text-decoration: none;color:white;font:bold 24px helvetica;padding:10px;text-shadow:1px 1px 5px rgba(0, 0, 0, 0.7);}'+
                '.topicly-widget .containerTitle.credit {text-align: right;border-top: 0;}';

    //----- start up each widget -------------------------------------
    var dataAttr='data-'+widget;
    jQuery("["+dataAttr+"]").each(function() {
        var goesHere = jQuery(this);
        var passed = JSON.parse(goesHere.attr(dataAttr));
        //line below will be reinstated when code supports multiple widgets
        goesHere.removeAttr(dataAttr);
        injectCss(css);
        renderWidget(goesHere, passed);
        //}); 
    });

    function injectCss(css) {
        //TODO css get injected multiple times for multiple games or when prefetched again
        var style = document.createElement('style');
        style.type = 'text/css';
        css = css.replace(/\}/g, "}\n");
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(style, entry);
    }
})();
