var refresh = true;
var refreshId = 0;

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

  $('#torrent-list').selectable({
    filter: "a",
    cancel: ".handle",
    selected: function (event, ui) {
      if ($(ui.selected).hasClass('selectedfilter')) {
        $(ui.selected).removeClass('selectedfilter').removeClass('ui-selected');
      } else {            
          $(ui.selected).addClass('selectedfilter').addClass('ui-selected');
      }
    },
    unselected: function (event, ui) {
        $(ui.unselected).removeClass('selectedfilter');
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