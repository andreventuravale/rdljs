/// <reference path="rdljs.core.js" />
/// <reference path="rdljs.plugin.abstract.js" />

// (function () {

SvgRenderer = function () {
};

SvgRenderer.prototype = Renderer.extend({

    init: function () {
        return this;
    },

    beginReport: function () {

        this.node = d3.select("body")
            .append("svg")
                .style("background", "silver");
    },

    updateReportBox: function (view) {

        var w = Math.max(
            this.node.node().getBBox().width
            view.node().getBBox().width
        );

        var h = Math.max(
            this.node.node().getBBox().height
            view.node().getBBox().height
        );

        this.node
            .attr("width", w)
            .attr("height", h);
    },

    endReport: function () { },

    beginSection: function () {

        this.node = this.report.node
            .append("rect")
                .attr("width", this.width())
                .attr("height", "100%")
                .attr("fill", "transparent");
    },

    endSection: function () { },

    beginBody: function () {

        this.node = this.section.report.node
            .append("rect")
                .attr("height", this.height())
                .attr("width", "100%")
                .attr("fill", "transparent");
    },

    endBody: function () { },

    beginPage: function () { },

    endPage: function () { },

    beginTextBox: function () {

        this.dy = 0;
        this.dx = 0;

        this.node = this.body.section.report.node
            .append("text")
                .attr("x", this.left())
                .attr("y", this.top())
                .attr("width", this.width())
                .attr("height", this.height())
                .style("fill", this.style().color);
    },

    endTextBox: function () {
    },

    beginParagraph: function () {

        this.text = "";
    },

    endParagraph: function () {

        this.node =
            this.textBox.node
                .append("tspan")
                    .attr("dy", this.dy)
                    .attr("dx", this.dx)
                    .text(this.text);

        this.dy += this.node.node().getBBox().height;
        this.dx = -this.node.node().getBBox().width;
    },

    beginTextRun: function () {

        var text = $(this.dom).find("> rdl\\:Value").html();

        this.paragraph.text += text;
    },

    endTextRun: function () {
    },

    beginRectangle: function () { },
    endRectangle: function () { },

    beginLine: function () { },
    endLine: function () { },

    beginTablix: function () { },
    endTablix: function () { }
});

$renderers["svg"] = new SvgRenderer().init();

// })();
