//未完善的地图插件

const mapBox = document.getElementById("map");
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	console.log(locations);
}
