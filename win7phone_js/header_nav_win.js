var cText = '';
cText += '<div data-role="header" data-position="fixed">';
cText +=            '<a href="#" data-icon="arrow-l" icon-pos="left" data-ajax="false" onclick="prevDay()">Previous</a>';
cText +=            '<h3>Daily overview</h3>';
cText +=            '<a href="#" data-icon="arrow-r" icon-pos="right" data-ajax="false" onclick="nextDay()">Next</a>';
cText += '</div>';
document.write(cText);