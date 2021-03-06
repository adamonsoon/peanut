treeRenderer = function renderDependencyTree(depTree) {

  var html = '',
      depContainer,
      depCount = depTree.__count,
      maxCollapsableSize = 5000;

      delete depTree.__count;

  function recurse(tree, first) {

    var html = '',
        keys = [],
        divClass = 'package',
        cursorClass = 'no-pointer',
        package = '',
        numOfKeys = 0,
        hasChildren = false;

    if (tree !== null) {

      keys = Object.keys(tree);
      numOfKeys = keys.length;

      if (first) {
      	if (depCount > maxCollapsableSize) {
	        html += '<ul class="package-group-root static">';    		
      	} else {
	        html += '<ul class="package-group-root collapse">';
        }
      } else {
        html += '<ul class="package-group">';
      }

      for(package in tree) {

        hasChildren = typeof tree[package] === 'object' && tree[package] !== null;

        if (hasChildren) {
          html += '<li><div class="' + divClass + '" id="' + package + '_' + getRandSuffix() + '"><span class="icon"></span>' + package + '</div>';
        } else {
          html += '<li><div class="' + divClass + ' ' + cursorClass + '" id="' + package + '_' + getRandSuffix() + '">' + package + '</div>';
        }

        html += recurse(tree[package], false);
        html += '</li>';
      }
      
      html += '</ul>';
    }

    return html;
  
  }

  html = recurse(depTree, true);

  var depContainer = document.querySelector('.dependency-container');
      depContainer.innerHTML = html;
      depContainer.className += ' show';

  var tweens = {};

  $('.package').on('click', function() {

    if (!($(this).children().length > 0)) {
      return;
    }

    var $branch = $(this).next(),
    	id = $(this).attr('id');

    if (depCount < maxCollapsableSize) {
	    if (!tweens.hasOwnProperty(id)) {
	      tweens[$(this).attr('id')] = TweenLite.to($branch, 0.2, { height:0, opacity:0, onReverseComplete: function() {
	        $branch.css('height', '');
	      }});
	    }

	    $(this).toggleClass('closed');
	    $branch.toggleClass('hidden');

	    if ($branch.hasClass('hidden')) {
	      tweens[id].play();
	      $(this).find('.icon').addClass('open');
	    } else {
	      tweens[id].reverse(1);
	      $(this).find('.icon').removeClass('open');
	    }
	}

  });

  function getRandSuffix() {
    return Math.random().toString(36).substr(2,4);
  }

};