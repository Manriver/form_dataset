var field, nuevofields;

$(function(){

    var objsql = new cartodb.SQL({ user : 'finanzasdf-admin' });

        objsql.execute("SELECT DISTINCT(categoria) FROM sismo_categoria_1 ORDER BY categoria ASC")
        .on("done",function(data){

                for(idx in data.rows){
                    $("<option />",{"value":data.rows[idx].categoria,"text":data.rows[idx].categoria}).appendTo("#selectDel");
                }//Fin for(idx in data.rows){

        });//Fin .on("done",function(data){

        $("#enviar").on("click",function(evt){
        	// console.log(this);
        	var $this = $(this);
        	$this.button('loading');
        	waitingDialog.show('Enviando datos');
            var optiondelegacion = $("#selectDel").val();
            var optionnamedataset = $("#inputdataset").val();
            var optionnamecapa = $("#inputcapa").val();

	            var qrycolumname = "SELECT array_agg(quote_literal(column_name)) AS fields FROM information_schema.columns WHERE table_schema = 'finanzasdf-admin' AND table_name = '"+optionnamedataset+"' AND column_name NOT IN ('cartodb_id','the_geom','the_geom_webmercator')";
	            // console.log(qrycolumname);
	            var strsql ='https://finanzasdf-admin.carto.com/api/v2/sql?q='+qrycolumname+'&api_key=9636b95f3e6c01a780c65a869e491303ed330f9c';
	            $.getJSON(strsql,function(data){
	            	for(idx in data.rows){
	            		var field;
	            		field = data.rows[idx].fields;
		            	var field_string = field.toString();
			            var sustituir = /'/g;
			            var sustituto = "";
	            		var nuevofields = field_string.replace(sustituir, sustituto);
	            		$('#fields').val(nuevofields);

			            var optionfields = $("#fields").val();

			            var strsqlinsert ="INSERT INTO "+'"finanzasdf-admin"'+".sismo_categoria_capa_1 (categoria, dataset, fields, nombre_de_capa) VALUES ('"+optiondelegacion+"','"+optionnamedataset+"','"+nuevofields+"','"+optionnamecapa+"')" ;
			            console.log(strsqlinsert);
			            // $.getJSON("https://finanzasdf-admin.carto.com/api/v2/sql?q="+strsqlinsert+"&api_key=9636b95f3e6c01a780c65a869e491303ed330f9c", function(data){
			            //      $.each(data.rows, function(key, val) {
			            //          alert("llave "+key+" "+val);
			            //      });
			            // });//end getJSON
	            	}//fin for
            	$this.button('reset');
            	waitingDialog.hide();
            	}).error(function(errors){
            		$this.button('reset');
            		console.log("errors: "+errors);
            	});//fin getJSON
            	// setTimeout(function(){
            	// 	$("<p />",{"text":"Datos enviados"}).appendTo('#textresult');
            	// }, 3000);    
        });//fin  on click

        $('#selectDel').on("change",function(event) {
        	/* Act on the event */
        	var optionDel = $("#selectDel").val();
			$("#detalledatset").empty();

			objsql.execute("SELECT cartodb_id, categoria, dataset, nombre_de_capa FROM sismo_categoria_capa_1 WHERE categoria = '"+optionDel+"'")
			.done(function(data){

				$("#detalledatset").html("");
				for(idx in data.rows){
					$tr = $("<tr>",{"id":data.rows[idx].cartodb_id});
					$("<td />",{"text":data.rows[idx].nombre_de_capa}).appendTo($tr);
					$("<td />",{"text":data.rows[idx].dataset}).appendTo($tr);
					$tr.appendTo("#detalledatset");
				}

			});      	
        });

	var waitingDialog = waitingDialog || (function ($) {
	    'use strict';

		// Creating modal dialog's DOM
		var $dialog = $(
			'<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
			'<div class="modal-dialog modal-m">' +
			'<div class="modal-content">' +
				'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
				'<div class="modal-body">' +
					'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
				'</div>' +
			'</div></div></div>');

		return {
			/**
			 * Opens our dialog
			 * @param message Custom message
			 * @param options Custom options:
			 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
			 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
			 */
			show: function (message, options) {
				// Assigning defaults
				if (typeof options === 'undefined') {
					options = {};
				}
				if (typeof message === 'undefined') {
					message = 'Loading';
				}
				var settings = $.extend({
					dialogSize: 'm',
					progressType: '',
					onHide: null // This callback runs after the dialog was hidden
				}, options);

				// Configuring dialog
				$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
				$dialog.find('.progress-bar').attr('class', 'progress-bar');
				if (settings.progressType) {
					$dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
				}
				$dialog.find('h3').text(message);
				// Adding callbacks
				if (typeof settings.onHide === 'function') {
					$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
						settings.onHide.call($dialog);
					});
				}
				// Opening dialog
				$dialog.modal();
			},
			/**
			 * Closes dialog
			 */
			hide: function () {
				$dialog.modal('hide');
			}
		};

	})(jQuery);


});
