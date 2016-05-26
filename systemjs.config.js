System.config({
    transpiler: 'typescript',
    typescriptOptions: {emitDecoratorMetadata: true},
    map: {
        'app' : 'app',
        'rxjs': 'node_modules/rxjs',
        '@angular'                         : 'node_modules/@angular',
        'ng2-bs3-modal': 'node_modules/ng2-bs3-modal'
    },
    packages: {
        'app'                              : {main: 'main.ts', defaultExtension: 'ts'},
        'rxjs'                             : {main: 'index.js'},
        '@angular/core'                    : {main: 'index.js'},
        '@angular/common'                  : {main: 'index.js'},
        '@angular/compiler'                : {main: 'index.js'},
        '@angular/router'                  : {main: 'index.js'},
        '@angular/platform-browser'        : {main: 'index.js'},
        '@angular/platform-browser-dynamic': {main: 'index.js'}
    },
    paths: {
        handlebars: './node_modules/handlebars/dist/handlebars.js',
        underscore: './node_modules/underscore/underscore.js'
    }
});
