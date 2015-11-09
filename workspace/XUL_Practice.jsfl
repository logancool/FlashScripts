function test(a, b, c)
{
    trace('You chose ' + [a, b, c]);
}

var xul = new XUL('Test dialog');
xul
    .addTextbox('Value A')
    .addSlider('Value B')
    .addCheckbox('Value C')
    .show(test)