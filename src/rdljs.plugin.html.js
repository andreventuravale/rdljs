/// <reference path="rdljs.core.js" />
/// <reference path="rdljs.plugin.abstract.js" />

// (function () {

HtmlRenderer = function () {
};

HtmlRenderer.prototype = Renderer.extend({

    init: function () {
        return this;
    },

    originOf: function (element) {
        if (element.container instanceof RdlReportPageHeader) {
            return {
                left: 0,
                top: 0
            };
        } else {
            var left = 0;
			var top = 0;
			try {
				if (element.container.section) {
					top += element.container.section.page.header.height().toPixels()
				}
				return {
					left: left,
					top: top
				};
			} catch (e) {
				debugger
			}
        }
    },

    sizeFor: function (element) {
        if (element.container instanceof RdlReportPageHeader) {
            return {
                width: 0,
                height: 0
            };
        } else {
			return {
                width: element.container.section.width(),
                height: element.container.height()
			};
        }
    },

    beginReport: function (element) {

        element.node = $("<div></div>")
            .addClass("rdl rdl-report")
            //.css("width", "0")
            //.css("height", "0")
            .appendTo("body");
    },

    updateReportBox: function (element, view) {

        //var w = Math.max(
        //    element.node.outerWidth(true),
        //    view.outerWidth(true)
        //);

        //var h = Math.max(
        //    element.node.outerHeight(true),
        //    view.outerHeight(true)
        //);

        //element.node
        //    .css("width", w)
        //    .css("height", h);
    },

    endReport: function (element) { },

    beginSection: function (element) {

        element.node = $("<div></div>")
            .addClass("rdl rdl-section")
            .appendTo(element.report.node)
                .css("width", element.width())
                .css("height", "100%")
                .css("background", "transparent");
    },

    endSection: function (element) { },

    beginBody: function (element) {

        element.node = $("<div></div>")
            .addClass("rdl rdl-body")
            .appendTo(element.section.node)
                .css("height", element.height())
                .css("width", "100%")
                .css("background", "transparent");
    },

    endBody: function (element) {


    },

    beginPage: function (element) {

    },

    endPage: function (element) {


    },

    beginPageHeader: function (element) {

        element.node = $("<div></div>")
            .addClass("rdl rdl-page")
            .appendTo(element.page.section.node)
                .css("height", element.height())
                .css("width", "100%")
                .css("background", "transparent");

        element.page.section.node.insertAfter(".rdl-body");
    },

    endPageHeader: function (element) {


    },

    beginTextBox: function (element) {

        element.node = $("<div></div>")
            .addClass("rdl rdl-textbox")
            .appendTo(element.container.node);

        if (element.container instanceof RdlTablixCell) {

            element.node
                .css("padding-left", element.style().padding.left.toPixels())
                .css("padding-top", element.style().padding.top.toPixels())
                .css("padding-right", element.style().padding.right.toPixels())
                .css("padding-bottom", element.style().padding.bottom.toPixels());

            var w = element.container.row.tablixBody.columns[element.container.index].width().toPixels();
            var h = element.container.row.height().toPixels();

            element.node
                .css("width", w - element.style().padding.left.toPixels() - element.style().padding.right.toPixels())
                .css("height", h - element.style().padding.top.toPixels() - element.style().padding.bottom.toPixels());

        } else {

            var origin = this.originOf(element);

            element.node
                .css("position", "absolute")
                .css("left", element.left())
                .css("top", origin.top + element.top().toPixels())
                .css("width", element.width())
                .css("height", element.height())
                .css("padding-left", element.style().padding.left)
                .css("padding-top", element.style().padding.top)
                .css("padding-right", element.style().padding.right)
                .css("padding-bottom", element.style().padding.bottom);
        }

        element.node
            .css("color", element.style().color)
            .css("background", element.style().backgroundColor);
    },

    endTextBox: function (element) {
    },

    beginParagraph: function (element) {

        element.node =
            $("<p></p>")
                .addClass("rdl rdl-paragraph")
                .css("text-align", element.style().textAlign)
                .appendTo(element.textBox.node);
    },

    endParagraph: function (element) {

        if (!element.node.text())
            element.node.html("&nbsp;");
    },

    beginTextRun: function (element) {

        element.text = $(element.dom).find("> rdl\\:Value").html();

        var html = element.text;

        html
            .replace(/[^\r\n]+/g, '\n')
            .replace(/\n/g, '<br>');

        element.node =
            $("<span></span>")
                .addClass("rdl rdl-textrun")
                .appendTo(element.paragraph.node)
                    .css("color", element.style().color)
                    .css("background", element.style().backgroundColor)
                    .css("font-family", element.style().fontFamily)
                    .css("font-size", element.style().fontSize)
                    .css("color", element.style().color)
                    .html(html);
    },

    endTextRun: function (element) {

    },

    beginRectangle: function (element) {

        var origin = this.originOf(element);

        element.node = $("<div></div>")
            .addClass("rdl rdl-rectangle")
            .appendTo(element.container.node)
                .css("position", "absolute")
                .css("left", element.left())
                .css("top", origin.top + element.top().toPixels())
                .css("width", element.width())
                .css("height", element.height())
                .css("background", element.style().backgroundColor);
    },

    endRectangle: function (element) { },

    beginLine: function (element) {

        var origin = this.originOf(element);
		var size = this.sizeFor(element);
		
        element.node = d3.select(element.container.node.get(0))
            .append("svg")
                .style("position", "absolute")
                //.style("left", "0")
                //.style("top", "0")
                .style("width", size.width)
                .style("height", size.height)
                .append("line")
                    .attr("x1", element.left().toPixels())
                    .attr("y1", origin.top + element.top().toPixels())
                    .attr("x2", element.left().toPixels() + element.width().toPixels())
                    .attr("y2", origin.top + element.top().toPixels() + element.height().toPixels())
                    .attr("stroke", element.style().border.color)
                    .attr("stroke-width", element.style().border.width);
    },

    endLine: function (element) {
    },

    beginTablix: function (element) {

        var origin = this.originOf(element);

        element.node = $("<table><colgroup></colgroup><tbody></tbody></table>")
            .addClass("rdl rdl-tablix")
            .appendTo(element.container.node)
                .attr("border", "0")
                .attr("cellpadding", "0")
                .attr("cellspacing", "0")
                .css("position", "absolute")
                .css("left", element.left())
                .css("top", origin.top + element.top().toPixels())
                .css("width", element.width())
                .css("height", element.height())
                //.css("color", element.style().color)
                .css("background", element.style().backgroundColor)
        //.css("padding-left", element.style().padding.left)
        //.css("padding-top", element.style().padding.top)
        //.css("padding-right", element.style().padding.right)
        //.css("padding-bottom", element.style().padding.bottom)
        ;
    },

    endTablix: function (element) {

    },

    beginTablixBody: function (element) {

        element.node = element.tablix.node.find("tbody");
    },

    endTablixBody: function (element) {


    },

    beginTablixColumn: function (element) {

        element.node = $("<col />")
            .appendTo(element.tablixBody.tablix.node.find("colgroup"))
            .css("width", element.width());
    },

    endTablixColumn: function (element) {


    },

    beginTablixRow: function (element) {

        element.node = $("<tr></tr>")
            .hide()
            .appendTo(element.tablixBody.node)
            .css("height", element.height());
    },

    endTablixRow: function (element) {


    },

    beginTablixCell: function (element) {

        element.node = $("<td></td>")
            .appendTo(element.row.node);
    },

    endTablixCell: function (element) {


    },

    beginTablixDataRow: function (element, rowIndex, row, data) {

        var tr = row.node.clone(false);

        tr.show().appendTo(row.node.parent());
    },

    beginTablixDataColumn: function (element, rowIndex, row, columnIndex, column, data) {

    },

    beginTablixDataCell: function (element, rowIndex, row, columnIndex, column, cell, data) {
    },

    endTablixDataCell: function (element, rowIndex, row, columnIndex, column, cell, data) {
    },

    endTablixDataColumn: function (element, rowIndex, row, columnIndex, column, data) {
    },

    endTablixDataRow: function (element, rowIndex, row, data) {
    },

    beginImage: function (element) {

        var src;

        if (element.source() == "Embedded") {
            src = "data:" + element.embeddedImage().mimeType() + ";base64," + element.embeddedImage().data();
        }

        element.node = $("<img />")
            .addClass("rdl rdl-image")
            .attr("src", src)
            .appendTo(element.container.node);

        var origin = this.originOf(element);

        element.node
            .css("position", "absolute")
            .css("left", element.left())
            .css("top", origin.top + element.top().toPixels())
            .css("width", element.width())
            .css("height", element.height())
            .css("padding-left", element.style().padding.left)
            .css("padding-top", element.style().padding.top)
            .css("padding-right", element.style().padding.right)
            .css("padding-bottom", element.style().padding.bottom);

        element.node
            .css("color", element.style().color)
            .css("background", element.style().backgroundColor);
    },

    endImage: function (element) {
    },
	
    beginColumnSpan: function (element) {

        if (element.container instanceof RdlTablixCell) {

			element.container.node.attr("colspan", element.span());
			
        } else {

			throw new "not implemented";
        }
    },

    endColumnSpan: function (element) {
    }
});

$renderers["html"] = new HtmlRenderer().init();

// })();
