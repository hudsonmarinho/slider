/*************************************************************************/
/**																		**/
/**		Development: Hudson Marinho										**/
/**		Phone: +55 (84) 8821 5277										**/
/**		URL: http://hudsonmarinho.com/									**/
/**																		**/
/**		----------------------------------------------------------		**/
/**																		**/
/**		Plugin Name: Shutter Slide										**/
/**		URL: http://hudsonmarinho.com/lab/jquery/shutter-slide/			**/
/**		GitHub: http://github.com/hudsonmarinho/shutter-slide/			**/
/**																		**/
/**		----------------------------------------------------------		**/
/**																		**/
/*************************************************************************/

(function($)
{
	$.fn.shutter = function(action, hide_me)
	{
		var $self 			= this,		
			max_pieces		= 7,
			$images			= $('figure img', $self),
			total_width		= $images.width(),
			total_height	= $images.height();
		
		var actions	= 
		{
			'start': function()
			{
				$self.trigger('start-shutter');
		
				$self.each(function()
				{
					var $li			= $(this),
						$container 	= $('figure', $li),
						$image 		= $('img', $container);
						
					$(new Array(max_pieces)).each(function(i)
					{			
						var $piece 				= $('<div class="piece"></div>').appendTo($container),
							piece_width 		= $piece.width(),
							individual_class	= 'piece-' + (i+1),
							background			= null;
							
						if(i <=2 ) $piece.addClass('firsts-pieces');
						else $piece.addClass('lasts-pieces');
						
						background_css = 'url('+$image.attr('src')+') -' + (i * piece_width) + 'px ' + ($piece.hasClass('firsts-pieces') ? total_height : '-'+total_height ) + 'px no-repeat';
					
						$piece.addClass(individual_class).css({'background': background_css, opacity: 0});
					});
				});
				$self.filter(':first').shutter();				

			},
			'prev_or_next': function(is_prev)
			{
				var _action = 'next',
					_filter = ':first';
				
				if(is_prev)
				{
					_action = 'prev';
					_filter = ':last';
				}
				
				var $target = $self.filter('.shutter-current')[_action]();
				
				if($target.length == 0) $target = $self.filter(_filter);
				
				$target.shutter();
				return $self;			
			},
			'prev': function()
			{
				actions.prev_or_next(true);
			},
			'next': function()
			{
				actions.prev_or_next();
			},
			'animation': function()
			{
				var $li			= $($($self).get(action)),
					$container 	= $('figure', $li),
					$image 		= $('img', $container),
					$pieces		= $container.find('.piece');
					
				if($self.data('timeout')) clearTimeout($self.data('timeout'));
				$self.data('timeout', setTimeout(function()
				{
					$li.parent().find('li').shutter('next');
				}, 5000));
				
				if(!hide_me)
				{
					$self.parent().find('.shutter-current').shutter(null, true).removeClass('shutter-current');
					$li.show().addClass('shutter-current');
				
					$li.trigger('start-anim-shutter');
          $li.find('.slide-info').fadeIn(2000);
        } else $li.find('.slide-info').fadeOut(2000);

				
				$pieces.each(function(i)
				{		
					var $piece 		= $(this),
						piece_width = $piece.width(),
						hided_class = null;
						
					if($piece.hasClass('firsts-pieces')) hided_class = total_height+'px';
					else hided_class = '-'+total_height+'px';
						
					if($piece.data('timeout')) clearTimeout($piece.data('timeout'));
						
					$piece.data('timeout', setTimeout(function()
					{
						$piece.stop().animate(
						{
							opacity: (hide_me ? 0 : 1),
							backgroundPosition : '-' + (i * piece_width) + 'px '+ (hide_me ? hided_class : '0')
						}, 1000, function()
						{
							$piece.removeData('timeout');
							if(i == max_pieces-1) $li.trigger('end-anim-shutter');
						});
					}, 300*i));
				});
			}
		};
		
		if($self.length == 1) action = 0;		
			
		//Play it babe!
		if(action === undefined && hide_me === undefined) actions.start();
		else if(action === 'next') actions.next();
		else if(action === 'prev') actions.prev();
		else if(typeof(action) == 'number') actions.animation();
		
		return $self;
		
		$('#prev').click(function(){ $self.shutter('prev') });
		$('#next').click(function(){ $self.shutter('next') });
		
	}
})(jQuery);
