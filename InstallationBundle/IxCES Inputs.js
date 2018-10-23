id2valuebup = {};
id2callback = {};
test2inputs = {};
Array.from($('div input[data-test-id="CustomTestName"]')).forEach(function(x, i) {
	id = x.getAttribute('id');
	name = x.getAttribute('name');
	id2valuebup[id] = x.value;
	$('#'+id).replaceWith('<select data-test-id="CustomTestName" id="'+id+'" name="'+name+'"><option value="Loading...">Loading...</option></select>');
	id2callback[id] = function(id2, items) {
		$('#'+id2).empty();
		Array.from(items).forEach(function(xx, ii) {
			if(xx == id2valuebup[id2]) {
				$('#'+id2).append('<option selected="yes" value="' + xx + '">' + xx + '</option>');
			} else {
				$('#'+id2).append('<option value="' + xx + '">' + xx + '</option>');
			}

		});
      $('#'+id2).chosen({search_contains:true});
      $('#'+id2+'_chosen').width('50%');
        $('#'+id2).on('change', function(evt, params) {
          $('#'+id2).parent().parent().find('input[data-test-id="CustomTestParameter"]')[0].value = test2inputs[$('#'+id2)[0].value];
        });
	};

});

$.ajax('/tests.txt', {
    'success': function(data, textStatus, oo) {
        data = JSON.parse(data);
        rv = ['Select a test'];
        data['tests'].forEach(function(a) {
          var test = Object.keys(a)[0];
          rv.push(test);
          test2inputs[test] = a[test];
        });
        for(id in id2callback) {
        	id2callback[id](id, rv);
        }
    },
    'error': function(oo, textStatus, errorThrown) {
    	rv = [];
        var e = textStatus+': ' + errorThrown;
        e = e.replace('\n', ' ').replace('\r', ' ');
        rv.push(e);
        for(id in id2callback) {
        	id2callback[id](id, rv);
        }
    }
});

return data;
