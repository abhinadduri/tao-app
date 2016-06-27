/**
 * Created by abhinadduri on 6/1/16.
 */
export class Stats {

    public expoRandomVariable = function(parameter) {
        return (
            -Math.log(Math.random()) / parameter
        );
    }

    public normalRandomVariable = function(mu=0, stddev=1) {
        return (
            stddev*(Math.sqrt(-2*Math.log(Math.random())))*(Math.cos(2*Math.PI*Math.random())) + mu
        );
    }

    public poissonRandomVariable = function(lambda) {
        let n = 0;
        let limit = Math.exp(-lambda);
        let u = Math.random();

        while (u > limit) {
            n++;
            u *= Math.random();
        }
        return n;
    }

    public poissonpmf = function(lambda, x) {
        return (Math.pow(lambda, x)
             * Math.exp(-lambda)) / this.gamma(x+1);
    }

    public poissoncdf = function(lambda, x) {
        let sum = 0;

        for (let i = 0; i < x; i++) {
            sum += this.poissonpmf(lambda, i);
        }
    }

    public binomRandomVariable = function(n, p) {
        let variate = 0;

        for (let i = 0; i < n; i++) {
            if (Math.random() < p)
                variate++;
        }

        return variate;
    }

    public binompmf = function(n, k, p) {
        return this.choose(n, k) * Math.pow(p, k) * Math.pow((1-p), (n-k));
    }

    public binomcdf = function(n, k, p) {
        let sum = 0;

        for (let i = 0; i < k; i++) {
            sum += this.binompmf(n, i, p);
        }

        return sum;
    }

    public gamma = function(t) {
        if (t == 0)
            return 1;

        else return Math.exp(-t)
            * Math.pow(t, t-1/2)
            * Math.sqrt(2*Math.PI)
            * (1 + 1/(12*t) + 1/(288*t*t) - 139/(51840*t*t*t) - 571/(2488320*t*t*t*t));
    }

    public gammaRandomVariable = function(alpha, beta) {
        let small = false;
        let betaCheck = false;

        if (alpha < 0)
            return null;
        if (alpha > 0 && alpha < 1) {
            small = true;
            alpha = alpha + 1;
        }
        if (beta != 1)
            betaCheck = true;

        let d = alpha-1/3;
        let c = 1/(Math.sqrt(9*d));
        let variate = 0;
        while (true) {
            let z = this.normalRandomVariable();
            let u = Math.random();
            let v = Math.pow((1 + c * z), 3);
            let product = z * z / 2 + d - d * v + d * Math.log(v);
            if ((z > -1 / c) && Math.log(u) < product) {
                variate = d * v;
                break;
            }
        }

        if (small)
            variate = variate * Math.pow(Math.random(), (1/alpha));
        if (betaCheck)
            variate = variate / beta;

        return variate;
    }

    public gammacdf = function(t, a, b, precision=.00001) {
        let normalize = Math.pow(b, a) / this.gamma(a);

        let pdf = function(y) {
            return (Math.pow(y, a-1)
            * Math.exp(-b*y));
        }

        return this.integrate(0, t, precision, pdf);
    }

    public beta = function(alpha, beta, precision=.00001) {
        return this.integrate(0, 1, precision, function(x) {
            return Math.pow(x, alpha-1) * Math.pow((1-x), beta-1);
        });
    }

    public betacdf = function(x, a, b, precision=.00001) {
        let betaConstant = this.beta(a, b);

        let pdf = function(y) {
            return (Math.pow(y, a-1)
            * Math.pow((1-y), b-1))
        }

        return this.integrate(0, x, precision, pdf) / betaConstant;
    }

    public integrate = function(a, b, dx=.0001, func) {
        let neg = false;
        if (a > b) {
            neg = true;
            var temp = a;
            a = b;
            b = temp;
        }

        let sum = 0;
        while (a < b) {
            sum += func(a)*dx;
            a += dx;
        }

        if (neg)
            return -sum;

        return sum;
    }

    public expcont = function(a, b, arg, pdf, precision=.0001) {
        return this.integrate(a, b, precision, function(y) {return arg(y) * pdf(y)});
    }

    public expdisc = function(a, b, arg, pdf) {
        let sum = 0;

        while (a < b) {
            var curr_dens = pdf(a);
            if (curr_dens == 0 || isNaN(curr_dens))
                break;

            sum += arg(a) * curr_dens;
            a++;
        }

        return sum;
    }

    public derv = function(f, x, error=.00001) {
        let h = .001;
        let d1 = (f(x + h) - f(x))/h;
        let d2 = 0;

        while (true) {
            h /= 10;
            let d2 = (f(x + h) - f(x))/h;
            let diff = Math.abs(d2 - d1);
            if (diff < error)
                break;
            d1 = d2;
        }

        return d2;
    }

    public choose = function(n, k) {
        return Math.round(this.gamma(n + 1) / (this.gamma(k + 1) * this.gamma(n - k + 1)));
    }

    private isInt(x) {
        return x % 1 == 0;
    }

}
