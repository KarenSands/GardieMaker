const URL_SRC = "https://www.eldarya.es/assets/img/"; 

const URL_CLOTHES = "item/player/";
const URL_SKIN = "player/skin/";
const URL_MOUTH = "player/mouth/";
const URL_EYES = "player/eyes/";
const URL_HAIR = "player/hair/";

const URL_ICON = "icon/";
const URL_FULL ="web_full/";
const URL_PORTRAIT = "web_portrait/";
var imgurl;

var groupInfo, groupList;
var filterGroup = [];
var selectedPage = 1;
var paginas, resto;

// Variables para cargar items
var primerItem, ultimoItem, itemLooper, item, filtro, getCodigo, getGrupo, getNombre, getCategoria, getRareza, getEspecial, getNota;
//Variables para filtros
var fGrupos, fCategorias, fEspecial, fRareza, fOrden, fName;
// Variables para fijar items
var customArray = [], selectedCode;
//----------------------------------------------

$(document).ready(function iniciaTodo() {
	$.get("https://raw.githubusercontent.com/Zunnay/EldaryaClothing/master/data/groupInfo.txt", function(dataInfo, success, xhr) {
		groupInfo = JSON.parse(dataInfo);
	});

	$.get("https://raw.githubusercontent.com/Zunnay/EldaryaClothing/master/data/groupList.txt", function(dataList, success, xhr) {
		groupList = JSON.parse(dataList);
		updateFilters();
		getCustom();
	});

});

function getCustom() {
	var str = window.location.search;
	if (str != "") {
		str = str.slice(3);
		customArray = str.split("&");
		selectLoad ();
	};
};

function selectLoad() {

	// Carga los items de customArray en canvas
	for (i = 0; i < customArray.length; i++) {
		searchtoSelect(customArray[i]);
	};

	limpiarCanvas();
};


function searchtoSelect(code) {
	var lista = document.getElementsByClassName("marketplace-abstract marketplace-search-item");
	
	for (i = 0; i < lista.length; i++) {
		var busca = lista[i].getAttribute("data-itemid");

		if (busca == code) {
			busca = lista[i].getAttribute("class");
			
			if (busca.includes("selected")) {
				lista[i].setAttribute("class", "marketplace-abstract marketplace-search-item");
				document.getElementById("marketplace-itemDetail").setAttribute("style","display:none");
				selectedCode = "";
				//limpiarCanvas();

			} else {
				lista[i].setAttribute("class", "marketplace-abstract marketplace-search-item selected");

				if (lista[i].getAttribute("data-itemid") != "undefined") {
					document.getElementById("marketplace-itemDetail").setAttribute("style","dislpay:block");
				} 
				cargarCanvas(i);

			};

		} else {
			lista[i].setAttribute("class", "marketplace-abstract marketplace-search-item");
		};

	};

};

function cargarCanvas(n) {

	var img = document.getElementsByClassName("abstract-icon")[n].getAttribute("src");
	var newimg = img.replace("icon/", URL_FULL);
	var tipo = document.getElementsByClassName("abstract-type")[n].innerHTML;

	if (tipo == "Fondos") {
		document.getElementById("marketplace-avatar-background-preview").style.backgroundImage = "url('" + newimg + "')";
		//
	} else {
//*------------------
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "420");
		canvas.setAttribute("height", "594");
		document.getElementById("marketplace-avatar-preview").appendChild(canvas);
//-----------------*/
		var canvas = document.getElementsByTagName("canvas");
		var ctx = canvas[canvas.length-1].getContext("2d");

		img = new Image();

		img.onload = function() {
			ctx.drawImage(img, 0, 0);
		};

		img.src = newimg;
	};
}

function cargarArray(i) {
		var img, img2;

		
			//Es necesario saber si hay un fondo 
			var buscaMain = groupList.filter(function(v){return v.itemId == customArray[i]});
			var filtro = groupInfo.filter(function(v){return v.groupId == buscaMain[0].groupId});

			switch (filtro[0].category) {
				case "Fondos": img = URL_SRC + URL_CLOTHES + URL_FULL + buscaMain[0].itemURL; break;
				case "Pieles": img = URL_SRC + URL_SKIN + URL_FULL + buscaMain[0].itemURL; break;
				case "Bocas": img = URL_SRC + URL_MOUTH + URL_FULL + buscaMain[0].itemURL; break;
				case "Ojos": img = URL_SRC + URL_EYES + URL_FULL + buscaMain[0].itemURL; break;
				case "Cabello": img = URL_SRC + URL_HAIR + URL_FULL + buscaMain[0].itemURL; break;
				default: img = URL_SRC + URL_CLOTHES + URL_FULL + buscaMain[0].itemURL;
			};

			if (filtro[0].category == "Fondos") {
				document.getElementById("marketplace-avatar-background-preview").style.backgroundImage = "url('" + img + "')";
			} else {

				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", "420");
				canvas.setAttribute("height", "594");
				document.getElementById("marketplace-avatar-preview").appendChild(canvas);

				canvas = document.getElementsByTagName("canvas");
				var ctx = canvas[i].getContext("2d");

				img2 = new Image();
				img2.onload = function() {
					ctx.drawImage(img2, 0, 0);
				};

				img2.src = img;

			};

	if (i < customArray.length - 1) {
		i++
		cargarArray(i);
	}

}


function limpiarCanvas(){

	document.getElementById("marketplace-avatar-background-preview").removeAttribute("style");
	var child = document.getElementsByTagName("canvas");
	var parent = document.getElementById("marketplace-avatar-preview");

	for (i = child.length-1; i >= 0; i--) {
		parent.removeChild(child[i]);
		
	};

	// Si hay algo fijado en array, cargarlo
	if (customArray.length != 0) {
			cargarArray(0);

	};
		
};

function selectItem(n) {
	limpiarCanvas();

	var addselect = document.getElementsByClassName("marketplace-abstract marketplace-search-item")[n];
	selectedCode = addselect.getAttribute("data-itemid");

	searchtoSelect(selectedCode);

};

function doSet(code) {
	customArray.push(code);

	var str = "?s=";

	for (i = 0; i < customArray.length; i++) {

		(i == 0)? (str = str + customArray[i]):(str = str + "&" + customArray[i]);

	};
	
	window.location.search = str;

};

/////////////////////////////////////////////////////////////////////////////////////

function crearPagination() {

	// Borra pagination
	$("div").remove(".page");
	$("span").remove(".truncation");

	// Cada página tiene 7 elementos)
	if (filterGroup.length <= 7) {

		paginas = 0;
		resto = filterGroup.length;

	} else if (filterGroup.length > 7) {

		paginas = filterGroup.length / 7
		resto = filterGroup.length % 7;

		// Comprobar si hay páginas incompletas
		if (resto != 0) {
			paginas = Math.ceil(paginas);
		};

	};

		// --------------------------------------------------
		// ---------------- Crea pagination -----------------
		// --------------------------------------------------

		// Debe ejecutarse cada vez que se cambie de página.
	limpiaElementos();

	if (paginas <= 12) {
		var indice = 0;
			
		for (i = 1; i <= paginas; i++) {
			// Crear elementos
			var page = document.createElement("div");
			page.innerHTML = i;
			page.setAttribute("class", "page");
			page.setAttribute("onclick", "selectPage(" + indice + ")");
			document.getElementsByClassName("pagination")[0].appendChild(page);
			indice++;
		};

		// Cargar items
		cargaItems(selectedPage - 1);

	} else if (paginas > 12) {

		hacerTruncation();
		cargaItems(selectedPage - 1);

	};

	var att = document.getElementsByClassName("marketplace-abstract marketplace-search-item")[0].getAttribute("style");

	if (att != null) {
		if (att == "display: none;") {
			var e = document.createElement("span");
			e.setAttribute("id", "empty");
			e.innerHTML = "No hay ningún objeto disponible en esta categoría.";
			document.getElementById("marketplace-search-items").appendChild(e);
		};
	};

	var pregunta;
	var divPages = document.getElementsByClassName("page").length;
	if (divPages != 0) {
		for (i = 0; i <= divPages; i++) {
			if (i == divPages) {
				document.getElementsByClassName("page")[i - 1].setAttribute("class", "page selected");
				break;

			} else {

				pregunta = document.getElementsByClassName("page")[i].innerHTML;

				if ((Number(pregunta) - 1) == Number(selectedPage)) {

					if (i == 0) {

						document.getElementsByClassName("page")[i].setAttribute("class", "page selected");
						break;

					} else {

						document.getElementsByClassName("page")[i - 1].setAttribute("class", "page selected");
						break;

					};
				};
			};
		};
	};
};
	
function limpiaElementos() {
	var itemsVisibles = document.getElementsByClassName("marketplace-abstract marketplace-search-item");
	for (i = 0; i < 7; i++) {
		itemsVisibles[i].innerHTML = "";
		itemsVisibles[i].removeAttribute("style");

		if (itemsVisibles[i].style.display == "none") {
				itemsVisibles[i].removeAttribute("style");
			};
	};
};

function selectPage(n) {

	selectedPage = document.getElementsByClassName("page")[n].innerHTML;
	crearPagination();

};

function hacerTruncation() {
	// Verificar truncation

	if (selectedPage < 8) {
		// Inicio  ->  x 2 3 4 5 6 7 8 9 ... last-1 last
		var indice = 0;
		for (i = 1; i <= paginas; i++) {
			if (i < 10 || i > (paginas - 2)) {
				var page = document.createElement("div");
				page.innerHTML = i;
				page.setAttribute("class", "page");
				page.setAttribute("onclick", "selectPage(" + indice + ")");
				document.getElementsByClassName("pagination")[0].appendChild(page);

				indice++;
			} else if (i == 10) {
				var truncation = document.createElement("span");
				truncation.innerHTML = "...";
				truncation.setAttribute("class", "truncation");
				document.getElementsByClassName("pagination")[0].appendChild(truncation);
				i = (paginas - 2);
			};
		};

	} else if (selectedPage > (paginas - 7)) {
		// Final  ->  1 2 ... last-8 last-7 last-6 last-5 last-4 last-3 last-2 last-1 last
		var indice = 0;
		for (i = 1; i <= paginas; i++) {
			if ((i <= 2) || (i > (paginas - 10))) {
				var page = document.createElement("div");
				page.innerHTML = i;
				page.setAttribute("class", "page");
				page.setAttribute("onclick", "selectPage(" + indice + ")");
				document.getElementsByClassName("pagination")[0].appendChild(page);

				indice++;

			} else {
				var truncation = document.createElement("span");
				truncation.innerHTML = "...";
				truncation.setAttribute("class", "truncation");
				document.getElementsByClassName("pagination")[0].appendChild(truncation);
				i = (paginas - 9);
			};
		};

	} else {
		// Medio  ->  1 2 ... x1 x2 3 x4 x5 .. last-1 last-2
		var indice = 0;
		for (i = 1; i <= paginas; i++) {
			if (i <= 2 || i >= (paginas- 2) || (i-3 <= selectedPage && i+3 >= selectedPage)) {
				var page = document.createElement("div");
				page.innerHTML = i;
				page.setAttribute("class", "page");
				page.setAttribute("onclick", "selectPage(" + indice + ")");
				document.getElementsByClassName("pagination")[0].appendChild(page);

				indice++;

			} else if (i == 3 || i < paginas -2) {

				var truncation = document.createElement("span");
				truncation.innerHTML = "...";
				truncation.setAttribute("class", "truncation");
				document.getElementsByClassName("pagination")[0].appendChild(truncation);

				i == 3 ? (i = selectedPage - 4):(i = paginas - 2);

			};
		};

	};

};

function cargaItems(pagsel) {

	if (pagsel + 1 == paginas) {
		primerItem = pagsel * 7;
		ultimoItem = filterGroup.length;
		itemLooper = 0;
		for (item = primerItem; item < ultimoItem; item++) {
			
			getInfo();
			getItems();
			itemLooper++;

		};

		for (item = itemLooper; item < 7; item++) {
			document.getElementsByClassName("marketplace-abstract marketplace-search-item")[item].innerHTML = "";
			document.getElementsByClassName("marketplace-abstract marketplace-search-item")[item].style.display = "none";
		};
	} else if (paginas == 0) {
		primerItem = 0;
		ultimoItem = resto;
		itemLooper = 0;
		for (item = primerItem; item < ultimoItem; item++) {
			getInfo();
			getItems();
			itemLooper++;
		};

		for (item = itemLooper; item < 7; item++) {
			document.getElementsByClassName("marketplace-abstract marketplace-search-item")[item].innerHTML = "";
			document.getElementsByClassName("marketplace-abstract marketplace-search-item")[item].style.display = "none";
		};

	} else {
		primerItem = pagsel * 7;
		ultimoItem = primerItem + 7;
		itemLooper = 0;
		for (item = primerItem; item < ultimoItem; item++) {
			if (document.getElementsByClassName("marketplace-abstract marketplace-search-item")[itemLooper].style.display == "none") {
				document.getElementsByClassName("marketplace-abstract marketplace-search-item")[itemLooper].removeAttribute("style");
			};
			getInfo();
			getItems();
			itemLooper++;

		};

	};

	searchtoSelect(selectedCode);
};

function getItems() {
	// Imagen
	var itemIMGc = document.createElement("div");
	itemIMGc.setAttribute("class", "img-container");
	document.getElementsByClassName("marketplace-abstract marketplace-search-item")[itemLooper].appendChild(itemIMGc);

	var itemIMG = document.createElement("img");
	itemIMG.setAttribute("class", "abstract-icon");
	itemIMG.setAttribute("src", imgurl);
	document.getElementsByClassName("img-container")[itemLooper].appendChild(itemIMG);

	// Rareza
	var itemRarity = document.createElement("div");

	if (getNota.includes("Premio del mes")) {
		itemRarity.setAttribute("class", "anim-marker");
	} else {
		switch (getRareza) {
			case "Común":
				itemRarity.setAttribute("class", "rarity-marker-common");
				break;
			case "Raro":
				itemRarity.setAttribute("class", "rarity-marker-rare");
				break;
			case "Épico":
				itemRarity.setAttribute("class", "rarity-marker-epic");
				break;
			case "Legendario":
				itemRarity.setAttribute("class", "rarity-marker-legendary");
				break;
			case "Evento":
				itemRarity.setAttribute("class", "rarity-marker-event");
				break;
		};
	};

	document.getElementsByClassName("img-container")[itemLooper].appendChild(itemRarity);

	// Guardia
	if (getEspecial != undefined) {

		var itemEspecial = document.createElement("div");
		switch (getEspecial) {
			case "Brillante":
				itemEspecial.setAttribute("class", "tooltip guard-gem guard-1");
				break;
			case "Obsidiana":
				itemEspecial.setAttribute("class", "tooltip guard-gem guard-2");
				break;
			case "Absenta":
				itemEspecial.setAttribute("class", "tooltip guard-gem guard-3");
				break;
			case "Sombra":
				itemEspecial.setAttribute("class", "tooltip guard-gem guard-4");
				break;
			default:
			break;
		};
		document.getElementsByClassName("img-container")[itemLooper].appendChild(itemEspecial);
	};

	// Contenedor
	var itemContainer = document.createElement("div");
	itemContainer.setAttribute("class", "abstract-container");
	document.getElementsByClassName("marketplace-abstract marketplace-search-item")[itemLooper].appendChild(itemContainer);

	// Nombre
	var itemName = document.createElement("div");
	itemName.setAttribute("class", "abstract-name");
	document.getElementsByClassName("abstract-container")[itemLooper].appendChild(itemName);
	document.getElementsByClassName("abstract-name")[itemLooper].innerHTML = getNombre;

	var itemContent = document.createElement("div");
	itemContent.setAttribute("class", "abstract-content");
	document.getElementsByClassName("abstract-container")[itemLooper].appendChild(itemContent);

	// Categoría
	var itemCategory = document.createElement("div");
	itemCategory.setAttribute("class", "abstract-type");
	document.getElementsByClassName("abstract-content")[itemLooper].appendChild(itemCategory);
	document.getElementsByClassName("abstract-type")[itemLooper].innerHTML = getCategoria;

	var itemCodeCont = document.createElement("div");
	itemCodeCont.setAttribute("class", "abstract-code");
	document.getElementsByClassName("abstract-content")[itemLooper].appendChild(itemCodeCont);

	getCodigo = filterGroup[item].itemId;
	var itemEX = document.getElementsByClassName("marketplace-abstract marketplace-search-item")[itemLooper];
	itemEX.setAttribute("data-groupid", getGrupo);

	if (typeof(getCodigo) === "string") {

		itemEX.setAttribute("data-itemid", undefined);

		// No mostrar código
		var itemCode = document.createElement("div");
		itemCode.setAttribute("class", "code-info");
		document.getElementsByClassName("abstract-code")[itemLooper].appendChild(itemCode);

	} else {
		
		itemEX.setAttribute("data-itemid", getCodigo);

		// Codigo
		var itemCode = document.createElement("div");
		itemCode.setAttribute("class", "code-info");
		document.getElementsByClassName("abstract-code")[itemLooper].appendChild(itemCode);
		document.getElementsByClassName("code-info")[itemLooper].innerHTML = 'COD. <span class="universalCode">' + getCodigo + '</span>';
		
	};

	// Nota
	var itemNote = document.createElement("div");
	itemNote.setAttribute("class", "abstract-note");
	document.getElementsByClassName("abstract-container")[itemLooper].appendChild(itemNote);
	document.getElementsByClassName("abstract-note")[itemLooper].innerHTML = getNota;

};

function getInfo() {

	getGrupo = filterGroup[item].groupId;
	
	if (groupInfo != undefined) {
		filtro = groupInfo.filter(function(v){return v.groupId == getGrupo});

		getNombre = filtro[0].name;
		getCategoria = filtro[0].category;

		(filterGroup[item].rarity == undefined)?(getRareza = filtro[0].rarity):(getRareza = filterGroup[item].rarity);
		(filterGroup[item].note == undefined)?(getNota = filtro[0].note):(getNota = filterGroup[item].note);
		(filterGroup[item].especial == undefined)?(getEspecial = filtro[0].especial):(getEspecial = filterGroup[item].especial);
		

		switch (getCategoria) {
			case "Pieles":
				imgurl = URL_SRC + URL_SKIN + URL_ICON + filterGroup[item].itemURL;
				break;
			case "Bocas":
				imgurl = URL_SRC + URL_MOUTH + URL_ICON + filterGroup[item].itemURL;
				break;
			case "Ojos":
				imgurl = URL_SRC + URL_EYES + URL_ICON + filterGroup[item].itemURL;
				break;
			case "Cabello":
				imgurl = URL_SRC + URL_HAIR + URL_ICON + filterGroup[item].itemURL;
				break;
			default:
				imgurl = URL_SRC + URL_CLOTHES + URL_ICON + filterGroup[item].itemURL;
		
		};

	} else {
		iniciaTodo();
	}

};

function updateFilters() {
	$("span").remove("#empty");

	fGrupos = $("#filter-codeOptions").val();				// item / grupo
	fCategorias = $("#filter-bodyLocationOptions").val();	// categorias
	fEspecial = $("#filter-guardOptions").val();			// Guardias / Premio del mes
	fRareza = $("#filter-rarityOptions").val();				// rareza
	fOrden = $("#filter-orderOptions").val();				// newest / oldest
	fName = $("#filter-itemName").val();

	// ----------------------------------------------

	var filterA = [];
	var filterB = [];
	filterGroup.length = 0;

	// Grupo --------------------------------------------

	try {
		if (fEspecial == "Arcoíris") {
			fGrupos = "all";
		}

		if (fGrupos == "first") {

			//filtro = groupInfo;

			for (i = 0; i < groupInfo.length; i++) {
				for (b = 0; b < groupList.length; b++) {
					if (groupInfo[i].groupId == groupList[b].groupId) {
						filterA.push(groupList[b]);
					break;
					};
				};
			};			

		} else if (fGrupos == "all") {

			for (i = 0; i < groupList.length; i++) {
				filterA.push(groupList[i]);

				var s = filterA[i].itemId;
				if (typeof(s) === "string") {

					if ( s.charAt(s.length - 1) == "s") {
						s = s.slice(0,-1);
						filterA[filterA.length - 1].itemId = s;
					};

				};
				
			};

		};


	} catch {

		alert("Se ha producido un error, la página se actualizará");
		location.reload();

	};

	

	// Categorías ---------------------------------------
	
	if (fCategorias != "") {

		filtro = groupInfo.filter(function(v){return v.category == fCategorias});

		for (i = 0; i < filterA.length; i++) {
			var currentGroup = filtro.filter(function(v){return v.groupId == filterA[i].groupId});

			if (currentGroup.length != 0) {
				if (filterA[i].groupId == currentGroup[0].groupId) {
					filterB.push(filterA[i]);
				};

			};

		};

	} else {
		for (i = 0; i < filterA.length; i++) {
			filterB.push(filterA[i]);
		};
	};
	
	filterA.length = 0;

	// Especial -----------------------------------------

	if (fEspecial != "") {
		
		filterA = filterB.filter(function(v){return v.especial == fEspecial});

	} else {
		for (i = 0; i < filterB.length; i++) {
			filterA.push(filterB[i]);
		};
	};

	filterB.length = 0;

	// Rareza -------------------------------------------

	if (fRareza != "") {
		fRareza=="common"?fRareza="Común":"";
		fRareza=="rare"?fRareza="Raro":"";
		fRareza=="epic"?fRareza="Épico":"";
		fRareza=="legendary"?fRareza="Legendario":"";
		fRareza=="event"?fRareza="Evento":"";

		filtro = groupInfo.filter(function(v){return v.rarity == fRareza});

		for (i = 0; i < filterA.length; i++) {
			var currentGroup = filtro.filter(function(v){return v.groupId == filterA[i].groupId});

			if (currentGroup.length != 0) {
				if (filterA[i].groupId == currentGroup[0].groupId) {
					filterB.push(filterA[i]);
				};

			};

		};

	} else {
		for (i = 0; i < filterA.length; i++) {
			filterB.push(filterA[i]);
		};
	};

	filterA.length = 0;

	// txt ----------------------------------------------

	if (fName != "") {
		if (isNaN(fName) ) {
			// Buscar por Nombre

			var nombre = normalize(fName).toLowerCase();

			filtro = groupInfo.filter(function(v){return (normalize(v.name).toLowerCase()).includes(nombre)});

			for (i = 0; i < filterB.length; i++) {
				var currentGroup = filtro.filter(function(v){return v.groupId == filterB[i].groupId});

				if (currentGroup.length != 0) {
					if (filterB[i].groupId == currentGroup[0].groupId) {
						filterA.push(filterB[i]);
					};

				};

			};

		// -----------------------------------------------------------

		} else {
			// Reiniciar todos los filtros

			fGrupos = $("#filter-codeOptions").val("all");				// item / grupo
			fCategorias = $("#filter-bodyLocationOptions").val("");	// categorias
			fEspecial = $("#filter-guardOptions").val("");			// Guardias / Premio del mes
			fRareza = $("#filter-rarityOptions").val("");				// rareza

			// Buscar por código

			for (grupo = 0; grupo < groupInfo.length; grupo++) {
				getGrupo = groupInfo[grupo].groupId;

				for (i = 0; i < filterB.length; i++) {
					if (filterB[i].itemId == fName) {
						filterA.push(filterB[i]);
						grupo = groupInfo.length;
						break;
					};
				};

			};

		// -----------------------------------------------------------

		};
		
	} else {

		for (i = 0; i < filterB.length; i++) {
			filterA.push(filterB[i]);
		};

	};

	filterB.length = 0;

	// Orden --------------------------------------------

	if (fOrden == "newest") {
		filterA.reverse();

	} else {

	};

	// Pasar todo a filterGroup ---------------------------

	for (i = 0; i < filterA.length; i++) {
		filterGroup.push(filterA[i]);
	};

	$("#footer-links").html("Mostrando " + filterGroup.length + " artículos de los " + groupList.length + " artículos disponibles.");

	selectedPage = 1;
	crearPagination();
};


// Normalize ----------------------------------------------

var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }      
      return ret.join( '' );
  }
 
})();

// ------------------------------------------------------

function key() {

	var input = document.getElementById("filter-itemName");

	input.addEventListener("keypress", function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			document.getElementById("filter").click();
		};
	});

};