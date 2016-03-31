var refresh = true;
var refreshId = 0;

var selected_id = 0;

$(function() {

  $.get('/torrents', function( data ) {
    $('#torrent-list').html(data);
  });

  refreshId = setInterval(function() {
    $.get('/torrents', function( data ) {
      $('#torrent-list').html(data);
    });
    console.log("Refreshing");
  }, 10000);

  $('#nav-resume').click(function() {
    $.get('/torrent/'+selected_id+'/resume');
  });

  $('#nav-pause').click(function() {
    $.get('/torrent/'+selected_id+'/pause');
  });

  $('#nav-delete').click(function() {
    if(selected_id != 0) {
      $.get('/torrent/'+selected_id+'/remove');
    }
  });

  $('#torrent-list').selectable({
    filter: "a",
    cancel: ".handle",
    selected: function (event, ui) {
      if ($(ui.selected).hasClass('selectedfilter')) {
        $(ui.selected).removeClass('selectedfilter').removeClass('ui-selected');
        selected_id = 0;
      } else {            
          $(ui.selected).addClass('selectedfilter').addClass('ui-selected');
          selected_id = $(ui.selected).attr('id');
      }
    },
    unselected: function (event, ui) {
      $(ui.unselected).removeClass('selectedfilter');
      selected_id = 0;
    }
  });

  if(!$('#nav-torrents').hasClass('active')) {
    $('#nav-refresh').hide();
  }
  else {
    $('#nav-refresh').click(function() {
      if(refresh) {
        clearInterval(refreshId);
        refresh = false;
        console.log("Stopping Refresh");
      }
      else {
        console.log("Starting Refresh");
        refreshId = setInterval(function() {
          $.get('/torrents', function( data ) {
            $('#torrent-list').html(data);
          });
          console.log("Refreshing");
        }, 10000);
        refresh = true;
      }
      $.get('/torrents', function( data ) {
        $('#torrent-list').html(data);
      });
    });
  }
});