// (function () {

function toPixels() {

    var element;

    try {

        toPixels.container = toPixels.container || (function () {

            var iframe = $("<iframe></iframe>")
                .hide()
                .appendTo("body");

            var contents = iframe.contents();

            var metas = $("<div></div>").append($("head > meta").clone()).html();

            contents.get(0).write("<html><head>" + metas + "</head><body></body></html>");

            return contents.find("body");
        })();

        element = $("<div></div>")
            .appendTo(toPixels.container)
            .css("width", this);

        var pixels = element.outerWidth(true);

        return pixels;

    } finally {

        element.remove();
    }
};

String.prototype.toPixels = toPixels;

// })();
