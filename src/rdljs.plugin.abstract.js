/// <reference path="rdljs.core.js" />

// (function () {

Renderer = function () {
};

Renderer.prototype = {

    init: function () {
        /* do initialization */
        return this;
    },

    beginReport: function () { },
    updateReportBox: function (view) { },
    endReport: function () { },

    beginSection: function () { },
    endSection: function () { },

    beginBody: function () { },
    endBody: function () { },

    beginPage: function () { },
    endPage: function () { },

    beginPageHeader: function () { },
    endPageHeader: function () { },

    beginTextBox: function () { },
    endTextBox: function () { },

    beginParagraph: function () { },
    endParagraph: function () { },

    beginTextRun: function () { },
    endTextRun: function () { },

    beginRectangle: function () { },
    endRectangle: function () { },

    beginLine: function () { },
    endLine: function () { },

    beginTablix: function () { },
    endTablix: function () { },

    beginTablixBody: function () { },
    endTablixBody: function () { },

    beginTablixColumn: function () { },
    endTablixColumn: function () { },

    beginTablixRow: function () { },
    endTablixRow: function () { },

    beginTablixCell: function () { },
    endTablixCell: function () { },

    beginTablixDataRow: function (rowIndex, row, data) { },
    beginTablixDataColumn: function (rowIndex, row, columnIndex, column, data) { },
    beginTablixDataCell: function (rowIndex, row, columnIndex, column, cell, data) { },
    endTablixDataCell: function (rowIndex, row, columnIndex, column, cell, data) { },
    endTablixDataColumn: function (rowIndex, row, columnIndex, column, data) { },
    endTablixDataRow: function (rowIndex, row, data) { },
    
    beginImage: function () { },
    endImage: function () { }
};

// },)();
