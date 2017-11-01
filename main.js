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

            	}).error(function(errors){
            		$this.button('reset');
            		console.log("errors: "+errors);
            	});//fin getJSON
            	setTimeout(function(){
            		$("<p />",{"text":"Datos enviados"}).appendTo('#textresult');
            	}, 3000);    
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
});
