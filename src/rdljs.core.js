// (function () {

Function.prototype.extend = function (extension) {
    if (typeof extension !== 'object') throw 'invalid argument: extension';
    var base = this.prototype;
    extension["super"] = base;
    for (var property in base) {
        extension[property] = extension[property] || base[property];
    }
    return extension;
};

Function.prototype.delegateTo = function (context) {
    var fn = this;
    return function () {
        return fn.apply(context, arguments);
    };
};

Function.prototype.invokeLater = function () {
    var ctx = Function.prototype.invokeLater;
    ctx.count = ctx.count || 1;
    setTimeout(this, ctx.count * 10);
    ctx.count++;
};

rdl = {

    isPromise: function (object) {
        return typeof object.done === 'function'
            && typeof object.fail === 'function'
            && typeof object.always === 'function';
    },

    randomId: function () {
        return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function () {
            return Math.random().toString(16).slice(2, 3);
        });
    },

    parseXml: function (xml) {

        if (typeof xml !== 'string') throw 'invalid argument: xml';

        xml = xml
            // fix empty tags
            .replace(/<([^>\s]+)([^>]*)\/>/gm, "<$1$2></$1>")
            // turn the XML tag to comment
            .replace(/<\?/gm, '<!--?').replace(/\?>/gm, '?-->')
            // make the RDL namespace explicit, in order to prevent conflicts with HTML
            .replace(/<Report([^>]*)xmlns="([^"]+)"([^>]*)>/m, '<Report$1xmlns:rdl="$2"$3>')
            // point the elements to RDL explicit namespace
            .replace(/<\/([^\:>]+)>/gm, '</rdl:$1>')
            .replace(/<([^!\?])([^\:>]*)(\s|>)/gm, '<rdl:$1$2$3');

        var doc = $("<iframe></iframe>")
            .css("display", "none")
            .appendTo("body")
            .contents();

        doc.get(0).write(xml);

        return doc.find("rdl\\:Report");
    },

    rendererFor: function (format) {

        if (typeof format !== 'string') throw 'invalid argument: format';

        var renderer = $renderers[format];

        if (!renderer) throw 'invalid or no loaded renderer: ' + format;

        return renderer;
    },

    makeReport: function (xml) {

        if (typeof xml !== 'string') throw 'invalid argument: xml';

        var dom = rdl.parseXml(xml);

        var report = new RdlReport().init(dom);

        return report;
    }
};

// })();
