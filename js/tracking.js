const URL_SRC = "https://www.eldarya.es/assets/img/player/hair/icon/";

var trackingList;
//================================================================
$(document).ready(function () {
	$.get("https://raw.githubusercontent.com/Zunnay/EldaryaClothing/master/data/trackingList.json", function(groupList, success, xhr) {
		trackingList = JSON.parse(groupList);
		checkLoad();
	});

});


function checkLoad() {

	try {
		if (trackingList != undefined) {
			firstLoad();
		};
	} catch {
		alert("Se ha producido un error, la página se actualizará");
		//location.reload();
	};
};


function firstLoad() {

	var pageMain = document.getElementsByClassName("page-main-container")[0];

	var iconListCounter = 0;

	// Debe contar cuantos grupos contiene

	for (a = 0; a < trackingList.length; a++) {

		var nombre = trackingList[a].name;
		var items = trackingList[a].items;
		var disponibles = items.filter(function(v){return v[0] != 0}); 

		//alert('"' + nombre + '" contiene ' + disponibles.length + " artículos de un total de " + items.length + ".");
		//alert(items[0][1]);

		// Crear info de cada grupo

		var h1 = document.createElement("h1");
		h1.setAttribute("class", "itemInfo");
		pageMain.appendChild(h1);

		var itemInfo = document.getElementsByClassName("itemInfo")[a];

		var span = document.createElement("span");
		span.setAttribute("class", "diamond");
		itemInfo.appendChild(span);

		span = document.createElement("span");
		span.setAttribute("class", "itemName");
		span.innerHTML = nombre;
		itemInfo.appendChild(span);

		span = document.createElement("span");
		span.setAttribute("class", "countItemsOuter");
		itemInfo.appendChild(span);

		span = document.createElement("span");
		span.setAttribute("class", "countItems");
		span.innerHTML = disponibles.length + "/" + items.length;
		document.getElementsByClassName("countItemsOuter")[a].appendChild(span);

		// Crear contenedor

		var ul = document.createElement("ul");
		ul.setAttribute("class", "itemList");
		pageMain.appendChild(ul);

		var itemList = document.getElementsByClassName("itemList")[a];

		for (b = 0; b < items.length; b++) {

			var li = document.createElement("li");
			li.setAttribute("class", "iconList")
			itemList.appendChild(li);

			var img = document.createElement("img");
			(items[b][0] == 0)?(img.setAttribute("class", "itemIcon")):(img.setAttribute("class", "itemIcon true"));

			img.src = URL_SRC + items[b][2];
			document.getElementsByClassName("iconList")[iconListCounter].appendChild(img);

			iconListCounter++;

		};

	};
};




/*
	<h1 class="itemInfo">
		<span class="diamond"></span>
		<span class="itemName">Bridín (San Valentín 2018)</span>
		<span class="countItemsOuter">
			<span class="countItems">1/42</span>
		</span>
	</h1>

	<ul class="itemList">
		<li><img class="itemIcon" src="d9a616ae1c9b443bde6abedb5024f0e5.png"></li>
		<li><img class="itemIcon" src="5dd9d145839d15ffa9862ca6c2493618.png"></li>
		<li><img class="itemIcon" src="851c400b18fc4f750d8d1c36b1d36c8d.png"></li>
		<li><img class="itemIcon" src="1b68a0ebda071a2dde3ae9191b481659.png"></li>
	</ul>
*/