/// <reference path="rdljs.core.js" />
/// <reference path="rdljs.plugin.abstract.js" />

// (function () {

var $renderers = {};

(RdlElement = function () { }).prototype = {
    view: function () {
        return this.node;
    }
};

(RdlStyleableElement = function () { }).prototype = RdlElement.extend({

    left: function () { return this.dom.find("> rdl\\:Left").html(); },

    top: function () { return this.dom.find("> rdl\\:Top").html(); },

    width: function () { return this.dom.find("> rdl\\:Width").html(); },

    height: function () { return this.dom.find("> rdl\\:Height").html(); },

    style: function () {

        return (this._style = this._style || (function () {

            var node = this.dom.find("> rdl\\:Style");

            var data = {

                border: {
                    color: node.find("> rdl\\:Border > rdl\\:Color").html() || "black"
                    , style: node.find("> rdl\\:Border > rdl\\:Style").html()
                    , width: node.find("> rdl\\:Border > rdl\\:Width").html()
                }

                , backgroundColor: node.find("> rdl\\:BackgroundColor").html()

                , color: node.find("> rdl\\:Color").html()

                , fontFamily: node.find("> rdl\\:FontFamily").html()
                , fontSize: node.find("> rdl\\:FontSize").html()
                , verticalAlign: node.find("> rdl\\:VerticalAlign").html()

                , padding: {
                    left: node.find("> rdl\\:PaddingLeft").html()
                    , right: node.find("> rdl\\:PaddingLeft").html()
                    , top: node.find("> rdl\\:PaddingLeft").html()
                    , bottom: node.find("> rdl\\:PaddingLeft").html()
                }

                , textAlign: node.find("> rdl\\:TextAlign").html()
            };

            return data;

        }).delegateTo(this)());
    }
});

(RdlReportItem = function () { }).prototype = RdlStyleableElement.extend({

    init: function (container, dom) {
        this.container = container;
        this.dom = dom;
        return this;
    },

    load: function (renderer) {
        throw 'not implemented: RdlReportItem.load()';
    }
});

RdlReportItem.create = function (body, dom) {

    if (dom.is("rdl\\:TextBox")) return new RdlTextBox().init(body, dom);
    else if (dom.is("rdl\\:Rectangle")) return new RdlRectangle().init(body, dom);
    else if (dom.is("rdl\\:Line")) return new RdlLine().init(body, dom);
    else if (dom.is("rdl\\:Tablix")) return new RdlTablix().init(body, dom);
    else if (dom.is("rdl\\:Image")) return new RdlImage().init(body, dom);

    throw 'not implemented item: ' + dom.get(0).tagName;
};

(RdlTextRun = function () { }).prototype = RdlStyleableElement.extend({
    init: function (paragraph, dom) {
        this.paragraph = paragraph;
        this.dom = dom;
        return this;
    },
});

(RdlParagraph = function () { }).prototype = RdlStyleableElement.extend({
    init: function (textBox, dom) {
        this.textBox = textBox;
        this.dom = dom;
        this.textRuns = [];
        return this;
    },
});

(RdlTextBox = function () { }).prototype = RdlReportItem.extend({

    init: function () {
        this.super.init.apply(this, arguments);
        this.paragraphs = [];
        return this;
    },

    load: function (renderer) {

        renderer.beginTextBox(this);

        this.dom

            .find("> rdl\\:Paragraphs > rdl\\:Paragraph")

            .each(function () {

                var paragraph = new RdlParagraph().init(this, $(arguments[1]));

                this.paragraphs.push(paragraph);

                renderer.beginParagraph(paragraph);

                $(arguments[1])

                    .find("> rdl\\:TextRuns > rdl\\:TextRun")

                    .each(function () {

                        var textRun = new RdlTextRun().init(paragraph, $(arguments[1]));

                        paragraph.textRuns.push(textRun);

                        renderer.beginTextRun(textRun);

                        renderer.endTextRun(textRun);

                    }.delegateTo(this));

                renderer.endParagraph(paragraph);

            }.delegateTo(this));

        renderer.endTextBox(this);

        return this;
    }
});

(RdlShape = function () { }).prototype = RdlReportItem.extend({

});

(RdlRectangle = function () { }).prototype = RdlShape.extend({

    init: function () {
        this.super.init.apply(this, arguments);
        return this;
    },

    load: function (renderer) {

        renderer.beginRectangle(this);

        renderer.endRectangle(this);

        return this;
    }
});

(RdlEmbeddedImage = function () { }).prototype = RdlElement.extend({

    init: function (image, dom) {
        this.image = image;
        this.dom = dom;
        return this;
    },

    data: function () { return this.dom.find("> rdl\\:ImageData").html(); },

    mimeType: function () { return this.dom.find("> rdl\\:MIMEType").html(); },
});

(RdlImage = function () { }).prototype = RdlReportItem.extend({

    init: function () {
        this.super.init.apply(this, arguments);
        return this;
    },

    name: function () { return this.dom.attr("Name"); },

    embeddedImage: function () {

        return this.embeddedImage.field = this.embeddedImage.field || (function () {

            var dom = this.container.dom.closest("rdl\\:Report")
                .find("rdl\\:EmbeddedImage[Name='" + this.value() + "']");

            return new RdlEmbeddedImage().init(this, dom);

        }.delegateTo(this))();
    },

    sizing: function () { return this.dom.find("> rdl\\:Sizing").html(); },

    source: function () { return this.dom.find("> rdl\\:Source").html(); },

    value: function () { return this.dom.find("> rdl\\:Value").html(); },

    load: function (renderer) {

        renderer.beginImage(this);

        renderer.endImage(this);

        return this;
    }
});

(RdlLine = function () { }).prototype = RdlShape.extend({

    init: function () {
        this.super.init.apply(this, arguments);
        return this;
    },

    load: function (renderer) {

        renderer.beginLine(this);

        renderer.endLine(this);

        return this;
    }
});

(RdlTablixCell = function () { }).prototype = RdlElement.extend({

    init: function (row, dom, index) {
        this.row = row;
        this.dom = dom;
        this.index = index;
        this.contents = [];
        return this;
    },

    //height: function () { return this.dom.find("> rdl\\:Height").html(); },

    load: function (renderer) {

        renderer.beginTablixCell(this);

        this.dom

            .find("> rdl\\:CellContents > *")

            .each(function (i, element) {

                var item = RdlReportItem.create(this, $(element));

                this.contents.push(item);

                item.load(renderer);

            }.delegateTo(this));

        renderer.endTablixCell(this);
    }
});

(RdlTablixColumn = function () { }).prototype = RdlElement.extend({

    init: function (tablixBody, dom, index) {
        this.tablixBody = tablixBody;
        this.dom = dom;
        this.index = index;
        return this;
    },

    width: function () { return this.dom.find("> rdl\\:Width").html(); },

    load: function (renderer) {

        renderer.beginTablixColumn(this);

        renderer.endTablixColumn(this);

        return this;
    }
});

(RdlTablixRow = function () { }).prototype = RdlElement.extend({

    init: function (tablixBody, dom, index) {
        this.tablixBody = tablixBody;
        this.dom = dom;
        this.index = index;
        this.cells = [];
        return this;
    },

    height: function () { return this.dom.find("> rdl\\:Height").html(); },

    load: function (renderer) {

        renderer.beginTablixRow(this);

        this.dom
            .find("> rdl\\:TablixCells > rdl\\:TablixCell")
            .each(function (i, element) {

                this.cells.push(
                    new RdlTablixCell()
                        .init(this, $(element), i)
                        .load(renderer)
                );

            }.delegateTo(this));

        renderer.endTablixRow(this);

        return this;
    }
});

(RdlTablixBody = function () { }).prototype = RdlElement.extend({

    init: function (tablix, dom) {
        this.tablix = tablix;
        this.dom = dom;
        this.columns = [];
        this.rows = [];
        return this;
    },

    load: function (renderer) {

        renderer.beginTablixBody(this);

        this.dom
            .find("> rdl\\:TablixColumns > rdl\\:TablixColumn")
            .each(function (i, element) {
                this.columns.push(
                    new RdlTablixColumn()
                        .init(this, $(element), i)
                        .load(renderer)
                );
            }.delegateTo(this));

        this.dom
            .find("> rdl\\:TablixRows > rdl\\:TablixRow")
            .each(function (i, element) {
                this.rows.push(new RdlTablixRow().init(this, $(element), i).load(renderer));
            }.delegateTo(this));

        renderer.endTablixBody(this);

        return this;
    }
});

(RdlTablix = function () { }).prototype = RdlReportItem.extend({

    load: function (renderer) {

        renderer.beginTablix(this);

        this.myBody = new RdlTablixBody().init(this, this.dom.find("> rdl\\:TablixBody")).load(renderer);

        var dataSet = this.container.section.report.dataResolver.resolve(this.dataSetName());

        if (rdl.isPromise(dataSet)) {

            dataSet.done(function (result) {

                this.render(renderer, result);

            }.delegateTo(this));

        } else {

            this.render(renderer, dataSet);
        }

        renderer.endTablix(this);

        return this;
    },

    dataSetName: function () { return this.dom.find("> rdl\\:DataSetName").html(); },

    render: function (renderer, dataSet) {

        $(dataSet).each(function (rowDataIndex, data) {

            $(this.myBody.rows).each(function (rowIndex, row) {

                renderer.beginTablixDataRow(this, rowIndex, row, data);

                $(this.columns).each(function (columnIndex, column) {

                    renderer.beginTablixDataColumn(this, rowIndex, row, columnIndex, column, data);

                    var cell = row.cells[columnIndex];

                    renderer.beginTablixDataCell(this, rowIndex, row, columnIndex, column, cell, data);

                    renderer.endTablixDataCell(this, rowIndex, row, columnIndex, column, cell, data);

                    renderer.endTablixDataColumn(this, rowIndex, row, columnIndex, column, data);

                }.delegateTo(this));

                renderer.endTablixDataRow(this, rowIndex, row, data);

            }.delegateTo(this));

        }.delegateTo(this));
    }
});

(RdlContainer = function () { }).prototype = RdlElement.extend({

    init: function () {
        this.items = [];
        return this;
    },

    height: function () { return this.dom.find("> rdl\\:Height").html(); },

    loadContent: function (renderer) {

        this.dom

            .find("> rdl\\:ReportItems > *")

            .each(function (i, element) {

                var item = RdlReportItem.create(this, $(element));

                this.items.push(item);

                item.load(renderer);

            }.delegateTo(this));

        return this;
    }
});

(RdlReportBody = function () { }).prototype = RdlContainer.extend({

    init: function (section, dom) {
        this.super.init.apply(this, arguments);
        this.section = section;
        this.dom = dom;
        return this;
    },

    load: function (renderer) {

        renderer.beginBody(this);

        this.loadContent(renderer);

        renderer.endBody(this);

        this.section.report.updateBox(renderer, this.view());

        return this;
    }
});

(RdlReportPageHeader = function () { }).prototype = RdlContainer.extend({

    init: function (page, dom) {
        this.super.init.apply(this, arguments);
        this.page = page;
        this.dom = dom;
        return this;
    },

    load: function (renderer) {

        renderer.beginPageHeader(this);

        this.loadContent(renderer);

        renderer.endPageHeader(this);

        return this;
    }
});

(RdlReportPage = function () { }).prototype = RdlElement.extend({

    init: function (section, dom) {
        this.section = section;
        this.dom = dom;
        return this;
    },

    load: function (renderer) {

        this.header = new RdlReportPageHeader()
            .init(this, this.dom.find("> rdl\\:PageHeader"));

        renderer.beginPage(this);

        this.header.load(renderer);

        renderer.endPage(this);

        return this;
    }
});

(RdlReportSection = function () { }).prototype = RdlElement.extend({

    init: function (report, dom) {
        this.report = report;
        this.dom = dom;
        return this;
    },

    width: function () { return this.dom.find("> rdl\\:Width").html(); },

    load: function (renderer) {

        this.page = new RdlReportPage().init(this, this.dom.find("> rdl\\:Page"));

        this.body = new RdlReportBody().init(this, this.dom.find("> rdl\\:Body"));

        renderer.beginSection(this);

        this.page.load(renderer);

        this.body.load(renderer);

        renderer.endSection(this);

        this.report.updateBox(renderer, this.view());

        return this;
    }
});

(RdlDataResolver = function () { }).prototype = {

    init: function (report, callback) {
        this.report = report;
        this.callback = callback;
        return this;
    },

    resolve: function (dataSetName) {

        var deferred = $.Deferred();

        var data = this.callback(dataSetName);

        if (data) {

            if (rdl.isPromise(data)) {

                data.done(function (result) {

                    deferred.resolve(result);
                });

            } else {

                deferred.resolve(data);
            }
        }

        return deferred.promise();
    }
};

(RdlReport = function () { }).prototype = RdlElement.extend({

    init: function (dom) {
        this.dom = dom;
        this.sections = [];
        return this;
    },

    updateBox: function (renderer, node) {

        (function () {

            renderer.updateReportBox(this, node);

        }).delegateTo(this).invokeLater();
    },

    dataResolver: function (callback) {

        if (callback)
            this.dataResolver = new RdlDataResolver().init(this, callback);
        else
            return this.dataResolver;
    },

    load: function (renderer) {

        this.id = this.dom.find("> rd\\:ReportID").html();

        renderer.beginReport(this);

        this.dom

            .find("> rdl\\:ReportSections > rdl\\:ReportSection")

            .each(function (i, element) {

                this.sections.push(
                    new RdlReportSection()
                        .init(this, $(element))
                        .load(renderer)
                );

            }.delegateTo(this));

        renderer.endReport(this);

        return this;
    }
});

// })();
