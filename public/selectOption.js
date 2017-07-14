$(document).ready(function() {
    var val = $('#select-cat').val();
    var html = '';
    $.ajax({
        url: '/cms/catdet',
        method: 'POST',
        dataType: 'json',
        data: {
            name: val
        },
        success: function(result) {

            result.cat.subcat.forEach(function(i) {
                html = html.concat("<option value='" + i.name + "'>" + i.name + "</option>");
            });
            $('#select-subcat').html(html);
        }
    });

});
$('#select-cat').on('change', function() {
    var val = $('#select-cat').val();
    var html = '';
    $.ajax({
        url: '/cms/catdet',
        method: 'POST',
        dataType: 'json',
        data: {
            name: val
        },
        success: function(result) {
            result.cat.subcat.forEach(function(i) {
                html = html.concat("<option value='" + i.name + "'>" + i.name + "</option>");
            });
            $('#select-subcat').html(html);
        }
    });


});