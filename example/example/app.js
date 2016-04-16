
/**
 * Module dependencies.
 */

var express = require('express');
var forms = require('fgv'); //imported fgv-package by just adding my fgv folder in node_modules folder
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');
var fs = require('fs');
var parse = require('url').parse;


var app = express();

var fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var reg_form = forms.create({
    Name: fields.string({
        validators: [
            function (form, field, callback) {
                if (field.string === null) {
                    alert("Plz enter");
                } else {
                    callback();
                }
            }
        ]
    }),
    email: fields.email({ required: true, label: 'Email Address' }),
    Url: fields.url({
        required: true,
        required: validators.required('You definitely want a password')
    }),
    password: fields.password({ required: true }),
    password_confirm: fields.password({
        required: true,
        validators: [validators.matchField('password')]
    }),
    phone: fields.string({
        validators: [validators.requiresFieldIfEmpty('phone')]
    }),
    options: fields.string({
        choices: {
            one: 'Mango',
            two: 'Apple',
            three: 'Banana'
        },
        widget: widgets.select(),
        validators: [
            function (form, field, callback) {
                if (field.data === 'two') {
                    callback('two?!!');
                } else {
                    callback();
                }
            }
        ]
    }),
    MultipleCheckbox: fields.array({
        choices: { one: 'Mango', two: 'Apple', three: 'Banana' },
        widget: widgets.multipleCheckbox()
    }),
    MultipleRadio: fields.string({
        choices: { one: 'Mango', two: 'Apple', three: 'Banana' },
        widget: widgets.multipleRadio()
    }),
    MultipleSelect: fields.array({
        choices: { one: 'Mango', two: 'Apple', three: 'Banana' },
        widget: widgets.multipleSelect()
    }),
    notes: fields.string({
        widget: widgets.textarea({ rows: 4 })
    })
});


// all environments
app.set('port', process.env.PORT || 3000);

app.configure(function () {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function (req, res) {
    res.render('index', {
        title: '[Test form generation and validation]', 
        form: reg_form.toHTML()
    });
});

app.post('/', function (req, res) {
    reg_form.handle(req, {
        success: function (form) {
            res.render('index', {                
                    title: 'Success!'
            });
        },
        other: function (form) {
            res.render('index', {
                    title: 'Error!'
            });
        }
    });
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
                                                                        