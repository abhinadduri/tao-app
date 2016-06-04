/**
 * Created by abhinadduri on 6/1/16.
 */
export class Stats {

    public static expoRandomVariable = function(parameter) {
        return (
            -Math.log(Math.random()) / parameter
        );
    }

    public static normalRandomVariable = function(mu=0, stddev=1) {
        return (
            stddev*(Math.sqrt(-2*Math.log(Math.random())))*(Math.cos(2*Math.PI*Math.random())) + mu
        );
    }

    public static poissonRandomVariable = function(lambda) {
        var n = 0;
        var limit = Math.exp(-lambda);
        var u = Math.random();

        while (u > limit) {
            n++;
            u *= Math.random();
        }
        return n;
    }

    public static poissonpmf = function(lambda, x) {
        return (Math.pow(lambda, x)
             * Math.exp(-lambda)) / Stats.gamma(x+1);
    }

    public static gamma = function(t) {
        if (t == 0)
            return 1;

        else return Math.exp(-t)
            * Math.pow(t, t-1/2)
            * Math.sqrt(2*Math.PI)
            * (1 + 1/(12*t) + 1/(288*t*t) - 139/(51840*t*t*t) - 571/(2488320*t*t*t*t));
    }

    public static gammacdf = function(t, a, b, precision=.00001) {
        var normalize = Math.pow(b, a) / Stats.gamma(a);

        var pdf = function(y) {
            return (Math.pow(y, a-1)
            * Math.exp(-b*y));
        }

        return Stats.integrate(0, t, precision, pdf);
    }

    public static beta = function(alpha, beta, precision=.00001) {
        return Stats.integrate(0, 1, precision, function(x) {
            return Math.pow(x, alpha-1) * Math.pow((1-x), beta-1);
        });
    }

    public static betacdf = function(x, a, b, precision=.00001) {
        var betaConstant = Stats.beta(a, b);

        var pdf = function(y) {
            return (Math.pow(y, a-1)
            * Math.pow((1-y), b-1))
        }

        return Stats.integrate(0, x, precision, pdf) / betaConstant;
    }

    public static integrate = function(a, b, dx=.0001, func) {
        var neg = false;
        if (a > b) {
            neg = true;
            var temp = a;
            a = b;
            b = temp;
        }

        var sum = 0;
        while (a < b) {
            sum += func(a)*dx;
            a += dx;
        }

        if (neg)
            return -sum;

        return sum;
    }

    public static expcont = function(a, b, arg, pdf, precision=.0001) {
        return Stats.integrate(a, b, precision, function(y) {return arg(y) * pdf(y)});
    }

    public static expdisc = function(a, b, arg, pdf) {
        var sum = 0;

        while (a < b) {
            var curr_dens = pdf(a);
            if (curr_dens == 0 || isNaN(curr_dens))
                break;

            sum += arg(a) * curr_dens;
            a++;
        }

        return sum;
    }

    public static derv = function(f, x, error=.00001) {
        var h = .001;
        var d1 = (f(x + h) - f(x))/h;

        while (true) {
            h /= 10;
            var d2 = (f(x + h) - f(x))/h;
            var diff = Math.abs(d2 - d1);
            if (diff < error)
                break;
            d1 = d2;
        }

        return d2;
    }

    private static isInt(x) {
        return x % 1 == 0;
    }

}
