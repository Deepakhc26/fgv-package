# fgv-package
fgv stands for form generation and validation package which includes library files which will help you to generate and validate forms automatically when this files are imported in your application.

##Requirment
> 1. Download nodejs from https://nodejs.org/en/ 
> 2. You need to have any editor, I am using visual studio 2015 (IDE) to develop nodejs application or you can use any editor to do the       same.
> 3. Download fgv-package from github : https://github.com/Deepakhc/fgv-package

##Setup
> 1. Install nodejs setup file that you have downloaded.
> 2. Install Express and other packages $npm install express or just select a node js project in your visual studio 2015 (IDE)
> 3. [Importent] : Copy fgv folder to node_modules folder which is created in your workspace. if the folder name is other than fgv eg.        fgv-package-master then rename it to fgv.
> 4. Now in your app.js which is an entry point for your app must import fgv module and then declare varibles for fields, validators       and widgets.

##Example

Here is an example how you import fgv file.
```
var express = require('express');
var forms = require('fgv'); //import fgv-package module.
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
```
Once that is done then you can code according to your requirment.

####Creating an example form.

```
var reg_form = forms.create({
    Name: fields.string({
    }),
    email: fields.email({ required: true, label: 'Email Address' }),
    Url: fields.url({
        required: true
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
```
When you run this test form if your input is correct and when you click on submit button it will show `Success!` message else it will show `Error!` message.
####Available types in this module

A list of the fields, widgets, validators and renderers available as part of the forms module. 

#####Fields
string,
number,
boolean,
password,
email,
url

#####Widgets
text,
email,
number,
password,
hidden,
checkbox,
select,
textarea,
multipleCheckbox,
multipleRadio,
multipleSelect,
label

#####Validators

matchField,
matchValue,
required,
requiresFieldIfEmpty,
min,
max,
range,
minlength,
maxlength,
rangelength,
email,
url,
alphanumeric,
digits,
integer

####Please check the example in the repository to get the complete picture of this module...!

#License

(The MIT License)

Copyright (c) 2016 Deepak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
