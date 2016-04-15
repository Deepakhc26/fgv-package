var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    forms = require('../lib/forms'),
    jsontemplate = require('./json-template'),
    parse = require('url').parse;

var fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var template = jsontemplate.Template(
    fs.readFileSync(__dirname + '/index.jsont').toString()
);

var Form = forms.create({
    name: fields.string({
        required: validators.required('%s is required!')
    }),
    email: fields.email({ required: true, label: 'Email Address' }),
    website: fields.url({required: true, label: 'URL'}),
    password: fields.password({ required: true }),
    password_confirm: fields.password({
        required: true,
        validators: [validators.matchField('password Miss Match!!!')]
    }),
    phone: fields.string({
        validators: [validators.requiresFieldIfEmpty('phone')]
    }),
    
    options: fields.string({
        choices: {
            one: 'option one',
            two: 'option two',
            three: 'option three'
        },
        widget: widgets.select(),
        validators: [
            function (form, field, callback) {
                if (field.data === 'two') {
                    callback('two?!');
                } else {
                    callback();
                }
            }
        ]
    }),
    more_options: fields.array({
        choices: { one: 'item 1', two: 'item 2', three: 'item 3' },
        widget: widgets.multipleCheckbox()
    }),
    even_more: fields.string({
        choices: { one: 'item 1', two: 'item 2', three: 'item 3' },
        widget: widgets.multipleRadio()
    }),
    and_more: fields.array({
        choices: { one: 'item 1', two: 'item 2', three: 'item 3' },
        widget: widgets.multipleSelect()
    }),
    notes: fields.string({
        widget: widgets.textarea({ rows: 6 })
    })    
});

http.createServer(function (req, res) {
    Form.handle(req, {
        success: function (form) {
            var req_data = parse(req.url, 1).query;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h1>Success!</h1>');
            res.write('<h2>' + util.inspect(req_data) + '</h2>');
            res.end('<pre>' + util.inspect(form.data) + '</pre>');
        },
        other: function (form) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(template.expand({
                form: form.toHTML(),
                method: 'POST',
                enctype: 'multipart/form-data'
            }));
        }
    });

}).listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');
