/*
	MobileMenu v1
	(c) 2013 Sargis Markosyan - https://github.com/sargismarkosyan/MobileMenu
	license: http://www.opensource.org/licenses/mit-license.php

  https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
      // Node/CommonJS
      module.exports = function( root, jQuery ) {
          if ( jQuery === undefined ) {
              // require('jQuery') returns a factory that requires window to
              // build a jQuery instance, we normalize how we use modules
              // that require this pattern but the window provided is a noop
              // if it's defined (how jquery works)
              if ( typeof window !== 'undefined' ) {
                  jQuery = require('jquery');
              }
              else {
                  jQuery = require('jquery')(root);
              }
          }
          factory(jQuery);
          return jQuery;
      };
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function ($, window, document) {

  $.fn.mobilemenu = function(userOptions){
    var menuCallObject = this;
    var menu;
    var menuInner;
    
    var options = {
      menu: false,
      menuOpenIcon: false,
      menuOpenObject: false,
      body: '',
      onInit: false,
      onOpen: false,
      onStartCloseAnimation: false,
      onClose: false,
      onUlInit: false,
      theme: 'mobilemenu-theme'
    };
    
    //Mearging defoult options with userOptions
    $.extend(true, options, userOptions);
    
    //This will create mobilemenu object if it needed
    var initMenu = function(){
      var body = options.body;
      if(!body)
        body = $('<div>').append(menuCallObject.clone()).html();
      return $('<div class="mobilemenu '+options.theme+'"><div class="mobilemenu--inner">'+body+'</div></div>').prependTo(document.body);
    };
    
    //This will open menu
    var openMenu = function(){
      menu.addClass('js-mobilemenu--opened');
      
      //$(document.documentElement).css({'overflow-y': 'hidden', 'height': '100%'});
      $(document.body).css({'overflow-y': 'hidden'/*, 'height': '100%'*/});
      
      updateHeight();
    
      if(options.onOpen)
        options.onOpen(menu, options);
    };
    
    //This will close menu
    var closeMenu = function(){
      menu.removeClass('js-mobilemenu--opened');
      
      //$(document.documentElement).css({'overflow-y': '', 'height': ''});
      $(document.body).css({'overflow-y': ''/*, 'height': ''*/});
    
      if(options.onClose)
        options.onClose(menu, options);
    };
    
    //This will add overflow-y: scroll if needed
    var updateHeight = function(){
      if(menu.height() < menuInner.height()){
        menu.css('overflow-y', 'scroll');
      } else {
        menu.css('overflow-y', 'visible');
      }
    };
     
    //If mobile open object is not defined, create it and attach open function
    if(!options.menuOpenIcon)
      options.menuOpenIcon = '<span class="mobilemenu--open-icon '+options.theme+'"></span>';
    if(!options.menuOpenObject)
      options.menuOpenObject = $(options.menuOpenIcon).insertBefore(menuCallObject);
    options.menuOpenObject.click(openMenu);
    
    //If menu is not defined create it
    if(options.menu){
      menu = options.menu;
    } else {
      menu = initMenu();
    }
    
    menuInner = menu.children().eq(0);
    
    //Attache close function
    menuInner.bind('touchstart mousedown', function(e){
      e.stopPropagation();
    });
    menu.bind('touchstart mousedown', function(){
      if(options.onStartCloseAnimation)
        options.onStartCloseAnimation(menu, options);
        
      menu.addClass('js-mobilemenu--animate-out');
      setTimeout(function(){
        menu.removeClass('js-mobilemenu--animate-out');
        closeMenu();
      }, 300);
    });
    
    //Add ul functions
    function updateUlLis(ul, index){
      $(ul).children('li').children('ul').each(function(subIndex){
        var li = $(this).parent();
        li.addClass('js-mobilemenu--li-with-child');
        
        var lastClick = 0;

        li.children('a').after('<span class="js-mobilemenu--child-toggler"><span></span></span>');
        li.children('.js-mobilemenu--child-toggler').click(function(e){
          if(li.hasClass('js-mobilemenu--li-active')){
            li.removeClass('js-mobilemenu--li-active');
          } else {
            li.addClass('js-mobilemenu--li-active');
          }
          
          if(options.theme == 'mobilemenu-theme'){
            setTimeout(function(){
              updateHeight();
            }, 300);
          } else {
            updateHeight();
          }
          
          if((new Date().getTime()) - lastClick < 500)
            return true;
            
          lastClick = new Date().getTime();
          
          return false;
        });
        
        updateUlLis(this, subIndex);
      });
      
      if(options.onUlInit)
        options.onUlInit(ul, index, menu, options);
    }
    
    //Update menu inner and readd ul function
    function updateMenu(){
      menuInner.children('ul').each(function(index){
        if(!$(this).hasClass('js-mobilemenu--ul-processed')){
          $(this).addClass('js-mobilemenu--ul-processed');
          updateUlLis(this, index);
        }
      });
    }
    
    updateMenu();
    
    if(options.onInit)
      options.onInit(menu, options);
      
    return {
      'menu': menu,
      'menuInner': menuInner,
      'openMenu': openMenu,
      'closeMenu': closeMenu,
      'updateMenu': updateMenu
    };
  };

  $.mobilemenu = function(options){
    return $(document.body).children().eq(0).mobilemenu(options);
  };

}(jQuery, window, document)));