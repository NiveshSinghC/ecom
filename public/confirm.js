$('.btn-danger').on('click', function(e) {
    var ask = confirm('Do you want to delete this?');
    if (!ask) {
        e.preventDefault();
    }
});