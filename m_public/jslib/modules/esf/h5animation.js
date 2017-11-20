/**
 * Created by lina on 2016/12/19.
 */
(function () {
    function findKeyframeRules(styles, func) {
        var rules = styles.cssRules || styles.rules || [];
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (rule.type === CSSRule.IMPORT_RULE) {
                findKeyframeRules(rule.styleSheet, func);
            } else {
                if (rule.type === CSSRule.KEYFRAMES_RULE || rule.type === CSSRule.MOZ_KEYFRAMES_RULE || rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE) {
                    func(rule, styles, i);
                }
            }
        }
    }
    function KeyframeRule(r) {
        this.original = r;
        this.keyText = r.keyText;
        this.css = {};
        var rules = r.style.cssText.split(';');
        for (var i = 0; i < rules.length; i++) {
            var parts = rules[i].split(':');
            if (parts.length === 2) {
                var key = parts[0].replace(/^\s+|\s+$/g, '');
                var value = parts[1].replace(/^\s+|\s+$/g, '');
                this.css[key] = value;
            }
        }
    }

    function KeyframeAnimation(kf) {
        this.original = kf;
        this.name = kf.name;
        this.keyframes = [];
        this.keytexts = [];
        this.keyframeHash = {};
        this.initKeyframes();
    }

    KeyframeAnimation.prototype.initKeyframes = function () {
        this.keyframes = [];
        this.keytexts = [];
        this.keyframeHash = {};
        var rules = this.original;
        for (var i = 0; i < rules.cssRules.length; i++) {
            var rule = new KeyframeRule(rules.cssRules[i]);
            this.keyframes.push(rule);
            this.keytexts.push(rule.keyText);
            this.keyframeHash[rule.keyText] = rule;
        }
    };
    KeyframeAnimation.prototype.getKeyframeTexts = function () {
        return this.keytexts;
    };
    KeyframeAnimation.prototype.getKeyframe = function (text) {
        return this.keyframeHash[text];
    };
    KeyframeAnimation.prototype.setKeyframe = function (text, css) {
        var cssRule = text + '{';
        for (var k in css) {
            cssRule += k + ':' + css[k] + ';';
        }
        cssRule += '}';
        if ('appendRule'in this.original) {
            this.original.appendRule(cssRule);
        } else {
            this.original.insertRule(cssRule);
        }
        this.initKeyframes();
        return this;
    };
    KeyframeAnimation.prototype.setKeyframes = function (obj) {
        for (var k in obj) {
            this.setKeyframe(k, obj[k]);
        }
    };
    KeyframeAnimation.prototype.clear = function () {
        for (var i = 0; i < this.keyframes.length; i++) {
            this.original.deleteRule(this.keyframes[i].keyText);
        }
    };
    function Animations() {
        this.animations = {};
        var styles = document.styleSheets;
        var anims = this.animations;
        for (var i = 0; i < styles.length; i++) {
            try {
                findKeyframeRules(styles[i], function (rule) {
                    anims[rule.name] = new KeyframeAnimation(rule);
                });
            } catch (e) {
            }
        }
    }

    Animations.prototype.get = function (name) {
        return this.animations[name];
    };
    Animations.prototype.getDynamicSheet = function () {
        if (!this.dynamicSheet) {
            var style = document.createElement('style');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
            this.dynamicSheet = style.sheet;
        }
        return this.dynamicSheet;
    };
    Animations.prototype.create = function (name, frames) {
        var styles = this.getDynamicSheet();
        if (typeof name === 'object') {
            frames = name;
            name = null;
        }
        if (!name) {
            name = 'anim' + Math.floor(Math.random() * 1e5);
        }
        try {
            var idx = styles.insertRule('@keyframes ' + name + '{}', styles.cssRules.length);
        } catch (e) {
            if (e.name === 'SYNTAX_ERR' || e.name === 'SyntaxError') {
                idx = styles.insertRule('@-webkit-keyframes ' + name + '{}', styles.cssRules.length);
            } else {
                throw e;
            }
        }
        var anim = new KeyframeAnimation(styles.cssRules[idx]);
        this.animations[name] = anim;
        if (frames) {
            anim.setKeyframes(frames);
        }
        return anim;
    };
    Animations.prototype.remove = function (name) {
        var styles = this.getDynamicSheet();
        name = name instanceof KeyframeAnimation ? name.name : name;
        this.animations[name] = null;
        try {
            findKeyframeRules(styles, function (rule, styles, i) {
                if (rule.name === name) {
                    styles.deleteRule(i);
                }
            });
        } catch (e) {
        }
    };
    if (typeof define === 'function') {
        define('modules/esf/h5animation', [], function () {
            return new Animations;
        });
    } else {
        window.CSSAnimations = new Animations;
    }
    window.CSSAnimations = new Animations;
})();