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
var filterInfoZ = [];
var selectedPage = 1;
var paginas, resto;

var primerItem, ultimoItem, itemLooper, item, filtro, getCodigo, getGrupo, getNombre, getCategoria, getRareza, getGuardia, getNota;

var fGrupos, fCategorias, fEspecial, fRareza, fOrden, fName;
//----------------------------------------------

$(document).ready(function iniciaTodo() {
	$.get("https://raw.githubusercontent.com/Zunnay/EldaryaClothing/master/data/groupInfo.txt", function(dataInfo, success, xhr) {
		groupInfo = JSON.parse(dataInfo);
	});

	$.get("https://raw.githubusercontent.com/Zunnay/EldaryaClothing/master/data/groupList.txt", function(dataList, success, xhr) {
		groupList = JSON.parse(dataList);
		updateFilters();
	});

});

function limpiarCanvas(){
	
		document.getElementById("marketplace-avatar-background-preview").removeAttribute("style");

		$("canvas")[0].remove();
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "420");
		canvas.setAttribute("height", "594");
		document.getElementById("marketplace-avatar-preview").appendChild(canvas);

};

function selectItem(n) {
	limpiarCanvas();

	var img = document.getElementsByClassName("abstract-icon")[n].getAttribute("src");
	var newimg = img.replace("icon/", URL_FULL);
	var tipo = document.getElementsByClassName("abstract-type")[n].innerHTML;

	if (tipo == "Fondos") {
		document.getElementById("marketplace-avatar-background-preview").style.backgroundImage = "url('" + newimg + "')";

	} else {

		var canvas = document.getElementsByTagName("canvas");
		var ctx = canvas[0].getContext("2d");

		img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0);
		};

		img.src = newimg;
	};
};

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

	/////////////////////////////////////////////////////////////////////////////////////
	
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

// PENDIENTE
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

	if (getNota == "Premio del mes") {
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
	if (getGuardia != undefined) {

		var itemGuardia = document.createElement("div");
		switch (getGuardia) {
			case "Brillante":
				itemGuardia.setAttribute("class", "tooltip guard-gem guard-1");
				break;
			case "Obsidiana":
				itemGuardia.setAttribute("class", "tooltip guard-gem guard-2");
				break;
			case "Absenta":
				itemGuardia.setAttribute("class", "tooltip guard-gem guard-3");
				break;
			case "Sombra":
				itemGuardia.setAttribute("class", "tooltip guard-gem guard-4");
				break;
		};
		document.getElementsByClassName("img-container")[itemLooper].appendChild(itemGuardia);
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
	itemEX.setAttribute("data-itemid", getCodigo);

	// Codigo
	var itemCode = document.createElement("div");
	itemCode.setAttribute("class", "code-info");
	document.getElementsByClassName("abstract-code")[itemLooper].appendChild(itemCode);
	document.getElementsByClassName("code-info")[itemLooper].innerHTML = 'COD. <span class="universalCode">' + getCodigo + '</span>';

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
		getRareza = filtro[0].rarity;
		getGuardia = filtro[0].guard;
		getNota = filtro[0].note;

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
	if (fGrupos == "grupo") {
		var grupo = 0
		for (i = 0; i < groupList.length; i++) {
			if (grupo < groupInfo.length) {
				if (groupList[i].itemId == groupInfo[grupo].groupId) {
					filterA.push(groupList[i]);
					grupo++;
				};
			} else {
				break;
			};
			
		};

	} else if (fGrupos == "item") {
		for (i = 0; i < groupList.length; i++) {
			filterA.push(groupList[i]);
		};

	};

	// Categorías ---------------------------------------
	
	if (fCategorias != "") {

		filtro = groupInfo.filter(function(v){return v.category == fCategorias});

		for (b = 0; b < filtro.length;b++) {
			getGrupo = filtro[b].groupId;

			for (i = 0; i < filterA.length; i++) {
				if (filterA[i].groupId == getGrupo) {
					filterB.push(filterA[i]);
				};
			};

		};
		
		for (i = 0; i < filterA.length; i++) {
			getGrupo = filterA[i].groupId;
			
			if (fCategorias == filterA[i].category) {
				filterB.push(filterA[i]);
			};
		};

	} else {
		for (i = 0; i < filterA.length; i++) {
			filterB.push(filterA[i]);
		};
	};
	
	filterA.length = 0;

	// Guardias -----------------------------------------
	// Pendiente
	if (fEspecial != "") {
		filtro = groupInfo.filter(function(v){return v.especial == fEspecial});

		for (b = 0; b < filtro.length;b++) {
			getGrupo = filtro[b].groupId;

			for (i = 0; i < filterB.length; i++) {
				if (filterB[i].groupId == getGrupo) {
					filterA.push(filterB[i]);
				};
			};

		};

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
		fRareza=="epic"?fRareza="Ëpico":"";
		fRareza=="legendary"?fRareza="Legendario":"";
		fRareza=="event"?fRareza="Evento":"";

	filtro = groupInfo.filter(function(v){return v.rarity == fRareza});

	for (b = 0; b < filtro.length;b++) {
			getGrupo = filtro[b].groupId;

			for (i = 0; i < filterA.length; i++) {
				if (filterA[i].groupId == getGrupo) {
					filterB.push(filterA[i]);
				};
			};

		};
		
		for (i = 0; i < filterA.length; i++) {
			getGrupo = filterA[i].groupId;
			
			if (fCategorias == filterA[i].category) {
				filterB.push(filterA[i]);
			};
		};

	} else {
		for (i = 0; i < filterA.length; i++) {
			filterB.push(filterA[i]);
		};
	};

	filterA.length = 0;

	// Orden --------------------------------------------

	if (fOrden == "newest") {
		filterB.reverse();

	} else {

	}

	// Last ---------------------------------------------
	// Pasar todo a filterGroup
	for (i = 0; i < filterB.length; i++) {
		filterGroup.push(filterB[i]);
	};

	selectedPage = 1;
	crearPagination();

};