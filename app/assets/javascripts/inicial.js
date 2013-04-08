// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
//------------------------------------------
//- gera Global User IDs p/ identificar unicamente um usuário
function guid() {
    return(     'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                .replace(/[xy]/g, function(c) {
                                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                    return v.toString(16);
                })
          );
}

$(document).on('pagecreate',  '#master-page', function(){

//----- global variable $originallist (dont use var here, so it will be global)
  //$originallist = $('#lista-principal').clone();
  //console.log('original list:\n' + $originallist.html());

  $('ul#lista-principal>li').attr('data-icon','false');

  var dividers = $('ul#lista-principal').find("li[data-role='list-divider']");
  var lis = $('ul#lista-principal>li').not(dividers);
  lis.css('display', 'none');

  $.mobile.defaultPageTransition = 'none';
  $.mobile.dialogTransition = 'none';

}); //pagecreate

//----- OUTROS EVENTOS -------------------------
$(document).on('pageinit', '#master-page', function(){

  //------ trata clique nos itens da lista ------
   $('ul#lista-principal>li').on('vclick', function(event) {
     event.preventDefault();
     //se for divider
     if ( $(this).attr('data-role')==='list-divider' ) {
         var divider = $(this);
         var group = divider.attr('data-groupoptions');
         var lis = $('li[data-groupoptions="'+group+'"]').not(divider);

         //verifica se o divider já está selecionado
         if ( divider.hasClass('myselected') )  {
             //verifica se os lis estão visiveis
             if ( lis.is(':visible') ) {
                 //lis visiveis, verifica se estão abertos
                 if ( lis.find('.ui-li-desc').hasClass('dont-truncate') ) {
                     // lis estão visiveis e abertos
                     // limpe todos e esconda
                     lis.find('.ui-li-desc.dont-truncate').removeClass('dont-truncate');
                     lis.find('.ui-li.myselected').removeClass('myselected');
                     lis.css('display', 'none'); //hide();
                     divider.removeClass('myselected');
                 }
                 else { //lis visiveis e fechados
                     //abra todos lis
                     lis.find('.ui-li-desc').addClass('dont-truncate');
                 }
             }
             else { //lis nao visiveis
                 // faça lis visiveis
                 lis.css('display', ''); //show();
             }
         }
         else { //divider não está selecionado
             // limpa selecionado
             $('.ui-li.myselected').removeClass('myselected');
             //selecione
             divider.addClass('myselected');
             lis.css('display', '');//.show();
         }
         //alert('list-divider');
     }
     else { //É um li comum
         var thisli = $(this);
         // verifica se o elemento já está aberto
         if ( thisli.find('.ui-li-desc').hasClass('dont-truncate') ) {

             //abre o popup
             lipopup( thisli );
             //limpa tudo
             //$('.ui-li-desc.dont-truncate').removeClass('dont-truncate');
             //$('.ui-li.myselected').removeClass('myselected');
             //return(false);
         }
         // limpa selecionado
         $('.ui-li.myselected').removeClass('myselected');
         // selecione  e abra
         $(this).find('.ui-li-desc').addClass('dont-truncate');
         $(this).addClass('myselected');
     }
     //return(false);
   });


   //------------------------------------------------
   //-
   $('#pageheader a#header-collapse').on('vclick', function(event) {
       event.preventDefault();
       event.stopPropagation();
       var lis = $('ul#lista-principal>li');
       var dividers = lis.filter("li[data-role='list-divider']");
       lis = lis.not(dividers);

       liopened = lis.find('.dont-truncate');
       if ( liopened.length > 0 ) { //trunca tudo
            liopened.removeClass('dont-truncate');
       }
       else {  //esconde tudo
           lis.css('display', 'none');
       }
       lis.removeClass('myselected');
       dividers.removeClass('myselected');
   });
   //------------------------------------------------
   //- abre o popup para seleção de status
   function lipopup(li) {
      var thisli = li;
      //não execute o click
      event.preventDefault();
      //setar o header com o conteúdo inicial da li
      var h = thisli.find('p').html().trim(); //.substring(0,60) + '...';
      $('#set-status .header').html(h);
      //carrega observação do item
      var liobs = thisli.find('span.obs');
      $('#set-status #obs').val(liobs.html());
      //abra o popup
      $('#set-status').popup("open");
      //------ trata clique no popup de status ------
      $( "#set-status a.action-links" ).on('vclick', function(event, ui) {
         var nova_classe = $(event.currentTarget).attr('id');  //botao limpar retorna undefined
         //desabilita input de observação (p/ não ganhar foco e chamar o teclado android
         $('#set-status input').attr('enable','false');
         //reverte a observação para o item
         liobs.html( $('#set-status #obs').val().trim() );
         //se existe obs, formate-a
         if ( liobs.html().length > 0 ) { liobs.addClass('info ui-li-desc dont-truncate'); }
         else { liobs.removeClass('info ui-li-desc'); }
         thisli.removeClass('pass att corr fail');
         thisli.addClass(nova_classe);

         $('#set-status').popup("close");
         event.preventDefault();
      });
      //------ remove click handler
      $('#set-status').on('popupafterclose', function(event, ui){
          $( "#set-status a" ).off('vclick'); //remove, pois o handler é customizado com currentTarget
          $( "#set-status" ).off('popupafterclose');
      });
   }
   //---------------------------------
   //- retrai todos LIs do mesmo grupo, menos o divider
   $(document).on('swipeleft', 'ul#lista-principal li',  function(event) {
        event.preventDefault();
        event.stopPropagation();
        var thisli = $(this);
        var group = thisli.attr('data-groupoptions');
        var lis = $('li[data-groupoptions="'+group+'"]');
        var divider = lis.filter("li[data-role='list-divider']");
        lis = lis.not(divider);

        lis.find('.ui-li-desc').removeClass('dont-truncate');
        // limpa selecionado e seleciona divider
        $('.ui-li.myselected').removeClass('myselected');
        divider.addClass('myselected');
   });
   //---------------------------------
   //- expande todos LIs do mesmo grupo, menos o divider
   $(document).on('swiperight', 'ul#lista-principal li',  function(event) {
        event.preventDefault();
        event.stopPropagation();
        var thisli = $(this);
        var group = thisli.attr('data-groupoptions');
        var lis = $('li[data-groupoptions="'+group+'"]');
        var divider = lis.filter("li[data-role='list-divider']");
        lis = lis.not(divider);

        lis.find('.ui-li-desc').addClass('dont-truncate');
        lis.css('display', '');
        // limpa selecionado e seleciona divider
        $('.ui-li.myselected').removeClass('myselected');
        divider.addClass('myselected');
   });

}); //pageinit
