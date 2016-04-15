
module.exports = (function () {

    var rAmp = /&/g;
    var rLt = /</g;
    var rGt = />/g;
    var rApos = /\'/g;
    var rQuot = /\"/g;
    var hChars = /[&<>\"\']/;

    var coerceToString = function (value) {
        return typeof value === 'undefined' || value === null ? '' : String(value);
    };

    var htmlEscape = function (value) {
        var str = coerceToString(value);
        return hChars.test(str) ?
            str.replace(rAmp, '&amp;')
                .replace(rLt, '&lt;')
                .replace(rGt, '&gt;')
                .replace(rApos, '&#39;')
                .replace(rQuot, '&quot;') :
            str;
    };

    return htmlEscape;
}());
