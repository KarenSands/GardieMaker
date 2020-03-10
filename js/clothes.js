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
var selectedPage = 0;
var selectedIndex = 0;
var paginas, resto;

var primerItem, ultimoItem, itemLooper, item, filtro, getCodigo, getGrupo, getNombre, getCategoria, getRareza, getGuardia, getNota;

var fGrupos, fCategorias, fEspecial, fRareza, fOrden;
//----------------------------------------------

$(document).ready(function iniciaTodo() {
	$.get("https://raw.githubusercontent.com/Zunnay/EldaryaClothing/master/data/groupInfo.txt", function(dataInfo, success, xhr) {
		groupInfo = JSON.parse(dataInfo);
	});

	$.get("https://raw.githubusercontent.com/Zunnay/EldaryaClothing/master/data/groupList.txt", function(dataList, success, xhr) {
		groupList = JSON.parse(dataList);
		crearPagination();
	});

});

function crearPagination(){

	// Borra pagination
	$("div").remove(".page");
	$("span").remove(".truncation");

	// Cada página tiene 7 elementos

	if (groupList.length <= 7) {

		// Borrar items extras
		for (i= 7; i >= groupList.length; i--){
			$(".marketplace-abstract.marketplace-search-item").eq(i).remove();
		};

	// Calcular cantidad de páginas
	} else if (groupList.length > 7) {
		paginas = groupList.length / 7
		resto = groupList.length % 7;

		// Comprobar si hay páginas incompletas
		if (resto != 0) {
			paginas = Math.ceil(paginas);
		};

		// --------------------------------------------------
		// ---------------- Crea pagination -----------------
		// --------------------------------------------------

		// Debe ejecutarse cada vez que se cambie de página.

		if (paginas <= 12) {
			var indice = 0;
			limpiaElementos();

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
			cargaItems(selectedIndex);
			
		} else if (paginas > 12) {

			// Verificar truncation

			if (selectedPage < 8) {
				// Inicio  ->  x 2 3 4 5 6 7 8 9 ... last-1 last
				var indice = 0;
				for (i = 1; i <= paginas; i++) {
					if (i < 10) {
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
					} else {
						var page = document.createElement("div");
						page.innerHTML = i;
						page.setAttribute("class", "page");
						page.setAttribute("onclick", "selectPage(" + indice + ")");
						document.getElementsByClassName("pagination")[0].appendChild(page);

						indice++;
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
						page.setAttribute("onclick", "selectedPage(" + indice + ")");
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
						page.setAttribute("onclick", "selectedPage(" + indice + ")");
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

	};

	document.getElementsByClassName("page")[selectedIndex].setAttribute("class", "page selected");

};

	/////////////////////////////////////////////////////////////////////////////////////
	
function limpiaElementos() {
	var itemsVisibles = document.getElementsByClassName("marketplace-abstract marketplace-search-item");
	for (i = 0; i < 7; i++) {
		itemsVisibles[i].innerHTML = "";
	}
}

// PENDIENTE
function selectPage(n) {

	selectedIndex = n;
	n>8?(selectedIndex = n-2):"";


	selectedPage = document.getElementsByClassName("page")[n].innerHTML;
	crearPagination();


};

function cargaItems(pagsel) {

	if (pagsel + 1 == paginas) {
		primerItem = pagsel * 7;
		ultimoItem = groupList.length;
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

	getCodigo = groupList[item].itemId;
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

	getGrupo = groupList[item].groupId;

	if (groupInfo != undefined) {
		filtro = groupInfo.filter(function(v){return v.groupId == getGrupo});

		getNombre = filtro[0].name;
		getCategoria = filtro[0].category;
		getRareza = filtro[0].rarity;
		getGuardia = filtro[0].guard;
		getNota = filtro[0].note;

		switch (getCategoria) {
			case "Pieles":
				imgurl = URL_SRC + URL_SKIN + URL_ICON + groupList[item].itemURL;
				break;
			case "Bocas":
				imgurl = URL_SRC + URL_MOUTH + URL_ICON + groupList[item].itemURL;
				break;
			case "Ojos":
				imgurl = URL_SRC + URL_EYES + URL_ICON + groupList[item].itemURL;
				break;
			case "Cabello":
				imgurl = URL_SRC + URL_HAIR + URL_ICON + groupList[item].itemURL;
				break;
			default:
				imgurl = URL_SRC + URL_CLOTHES + URL_ICON + groupList[item].itemURL;
		
		};

	} else {
		iniciaTodo();
	}

};

function filtroGrupos() {
	fGrupos = document.getElementById("filter-codeOptions").value;
	if (fGrupos == "item") {
		
	}
};
function filtroCategorias() {
	fCategorias = document.getElementById("filter-bodyLocationOptions").value;
};

function filtroEspecial() {
	fEspecial = document.getElementById("filter-guardOptions").value;

};

function filtroRareza() {
	fRareza = document.getElementById("filter-rarityOptions").value;
};

function filtroOrden() {
	fOrden = document.getElementById("filter-orderOptions").value;
};

/*

						<div class="pagination">
							<a class="page selected" rel="1">1</a>
							<a class="page" rel="2">2</a>
							<a class="page" rel="3">3</a>
							<a class="page" rel="4">4</a>
							<a class="page" rel="5">5</a>
							<a class="page" rel="6">6</a>
							<a class="page" rel="8">7</a>
							<a class="page" rel="9">8</a>
							<a class="page" rel="9">9</a>
							<span class="truncation">...</span>
							<a class="page" rel="9">19</a>
							<a class="page" rel="9">20</a>
						</div>
*/