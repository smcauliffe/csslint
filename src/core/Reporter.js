/**
 * An instance of Report is used to report results of the
 * verification back to the main API.
 * @class Reporter
 * @constructor
 * @param {String[]} lines The text lines of the source.
 * @param {Object} ruleset The set of rules to work with, including if
 *      they are errors or warnings.
 */
function Reporter(lines, ruleset, ignore) {
    "use strict";

    /**
     * List of messages being reported.
     * @property messages
     * @type String[]
     */
    this.messages = [];

    /**
     * List of statistics being reported.
     * @property stats
     * @type String[]
     */
    this.stats = [];

    /**
     * Lines of code being reported on. Used to provide contextual information
     * for messages.
     * @property lines
     * @type String[]
     */
    this.lines = lines;

    /**
     * Information about the rules. Used to determine whether an issue is an
     * error or warning.
     * @property ruleset
     * @type Object
     */
    this.ruleset = ruleset;

    /**
     * Linesets not to include in the report.
     * @property ignore
     * @type [][]
     */
    this.ignore = ignore;
}

Reporter.prototype = {

    //restore constructor
    constructor: Reporter,

    /**
     * Report an error.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method error
     */
    error: function(message, line, col, rule) {
        "use strict";
        this.messages.push({
            type    : "error",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule || {}
        });
    },

    /**
     * Report an warning.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method warn
     * @deprecated Use report instead.
     */
    warn: function(message, line, col, rule) {
        "use strict";
        this.report(message, line, col, rule);
    },

    /**
     * Report an issue.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method report
     */
    report: function(message, line, col, rule) {
        "use strict";

        var ignore = false;
        CSSLint.Util.forEach(this.ignore, function (range) {
            if(range[0] <= line && line <= range[1]) {
                ignore = true;
            }
        });
        if(ignore) {
            return;
        }

        this.messages.push({
            type    : this.ruleset[rule.id] === 2 ? "error" : "warning",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * Report some informational text.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method info
     */
    info: function(message, line, col, rule) {
        "use strict";
        this.messages.push({
            type    : "info",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * Report some rollup error information.
     * @param {String} message The message to store.
     * @param {Object} rule The rule this message relates to.
     * @method rollupError
     */
    rollupError: function(message, rule) {
        "use strict";
        this.messages.push({
            type    : "error",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * Report some rollup warning information.
     * @param {String} message The message to store.
     * @param {Object} rule The rule this message relates to.
     * @method rollupWarn
     */
    rollupWarn: function(message, rule) {
        "use strict";
        this.messages.push({
            type    : "warning",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * Report a statistic.
     * @param {String} name The name of the stat to store.
     * @param {Variant} value The value of the stat.
     * @method stat
     */
    stat: function(name, value) {
        "use strict";
        this.stats[name] = value;
    }
};

//expose for testing purposes
CSSLint._Reporter = Reporter;
