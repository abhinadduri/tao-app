System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Stats;
    return {
        setters:[],
        execute: function() {
            /**
             * Created by abhinadduri on 6/1/16.
             */
            Stats = (function () {
                function Stats() {
                    this.expoRandomVariable = function (parameter) {
                        return (-Math.log(Math.random()) / parameter);
                    };
                    this.normalRandomVariable = function (mu, stddev) {
                        if (mu === void 0) { mu = 0; }
                        if (stddev === void 0) { stddev = 1; }
                        return (stddev * (Math.sqrt(-2 * Math.log(Math.random()))) * (Math.cos(2 * Math.PI * Math.random())) + mu);
                    };
                    this.poissonRandomVariable = function (lambda) {
                        var n = 0;
                        var limit = Math.exp(-lambda);
                        var u = Math.random();
                        while (u > limit) {
                            n++;
                            u *= Math.random();
                        }
                        return n;
                    };
                    this.poissonpmf = function (lambda, x) {
                        return (Math.pow(lambda, x)
                            * Math.exp(-lambda)) / this.gamma(x + 1);
                    };
                    this.poissoncdf = function (lambda, x) {
                        var sum = 0;
                        for (var i = 0; i < x; i++) {
                            sum += this.poissonpmf(lambda, i);
                        }
                    };
                    this.binomRandomVariable = function (n, p) {
                        var variate = 0;
                        for (var i = 0; i < n; i++) {
                            if (Math.random() < p)
                                variate++;
                        }
                        return variate;
                    };
                    this.binompmf = function (n, k, p) {
                        return this.choose(n, k) * Math.pow(p, k) * Math.pow((1 - p), (n - k));
                    };
                    this.binomcdf = function (n, k, p) {
                        var sum = 0;
                        for (var i = 0; i < k; i++) {
                            sum += this.binompmf(n, i, p);
                        }
                        return sum;
                    };
                    this.gamma = function (t) {
                        if (t == 0)
                            return 1;
                        else
                            return Math.exp(-t)
                                * Math.pow(t, t - 1 / 2)
                                * Math.sqrt(2 * Math.PI)
                                * (1 + 1 / (12 * t) + 1 / (288 * t * t) - 139 / (51840 * t * t * t) - 571 / (2488320 * t * t * t * t));
                    };
                    this.gammaRandomVariable = function (alpha, beta) {
                        var small = false;
                        var betaCheck = false;
                        if (alpha < 0)
                            return null;
                        if (alpha > 0 && alpha < 1) {
                            small = true;
                            alpha = alpha + 1;
                        }
                        if (beta != 1)
                            betaCheck = true;
                        var d = alpha - 1 / 3;
                        var c = 1 / (Math.sqrt(9 * d));
                        var variate = 0;
                        while (true) {
                            var z = this.normalRandomVariable();
                            var u = Math.random();
                            var v = Math.pow((1 + c * z), 3);
                            var product = z * z / 2 + d - d * v + d * Math.log(v);
                            if ((z > -1 / c) && Math.log(u) < product) {
                                variate = d * v;
                                break;
                            }
                        }
                        if (small)
                            variate = variate * Math.pow(Math.random(), (1 / alpha));
                        if (betaCheck)
                            variate = variate / beta;
                        return variate;
                    };
                    this.gammacdf = function (t, a, b, precision) {
                        if (precision === void 0) { precision = .00001; }
                        var normalize = Math.pow(b, a) / this.gamma(a);
                        var pdf = function (y) {
                            return (Math.pow(y, a - 1)
                                * Math.exp(-b * y));
                        };
                        return this.integrate(0, t, precision, pdf);
                    };
                    this.beta = function (alpha, beta, precision) {
                        if (precision === void 0) { precision = .00001; }
                        return this.integrate(0, 1, precision, function (x) {
                            return Math.pow(x, alpha - 1) * Math.pow((1 - x), beta - 1);
                        });
                    };
                    this.betacdf = function (x, a, b, precision) {
                        if (precision === void 0) { precision = .00001; }
                        var betaConstant = this.beta(a, b);
                        var pdf = function (y) {
                            return (Math.pow(y, a - 1)
                                * Math.pow((1 - y), b - 1));
                        };
                        return this.integrate(0, x, precision, pdf) / betaConstant;
                    };
                    this.integrate = function (a, b, dx, func) {
                        if (dx === void 0) { dx = .0001; }
                        var neg = false;
                        if (a > b) {
                            neg = true;
                            var temp = a;
                            a = b;
                            b = temp;
                        }
                        var sum = 0;
                        while (a < b) {
                            sum += func(a) * dx;
                            a += dx;
                        }
                        if (neg)
                            return -sum;
                        return sum;
                    };
                    this.expcont = function (a, b, arg, pdf, precision) {
                        if (precision === void 0) { precision = .0001; }
                        return this.integrate(a, b, precision, function (y) { return arg(y) * pdf(y); });
                    };
                    this.expdisc = function (a, b, arg, pdf) {
                        var sum = 0;
                        while (a < b) {
                            var curr_dens = pdf(a);
                            if (curr_dens == 0 || isNaN(curr_dens))
                                break;
                            sum += arg(a) * curr_dens;
                            a++;
                        }
                        return sum;
                    };
                    this.derv = function (f, x, error) {
                        if (error === void 0) { error = .00001; }
                        var h = .001;
                        var d1 = (f(x + h) - f(x)) / h;
                        var d2 = 0;
                        while (true) {
                            h /= 10;
                            var d2_1 = (f(x + h) - f(x)) / h;
                            var diff = Math.abs(d2_1 - d1);
                            if (diff < error)
                                break;
                            d1 = d2_1;
                        }
                        return d2;
                    };
                    this.choose = function (n, k) {
                        return Math.round(this.gamma(n + 1) / (this.gamma(k + 1) * this.gamma(n - k + 1)));
                    };
                }
                Stats.prototype.isInt = function (x) {
                    return x % 1 == 0;
                };
                return Stats;
            }());
            exports_1("Stats", Stats);
        }
    }
});
//# sourceMappingURL=stats.js.map