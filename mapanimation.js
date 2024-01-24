async function getBusLocations() {
    const url =
      "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
  }

  async function run() {
    const buses = await getBusLocations();
    return buses;
  }

  mapboxgl.accessToken =
    "pk.eyJ1IjoiZmJkYWYiLCJhIjoiY2xycGgyaGtlMDRvZDJqbjdiaTJ4N3lodSJ9._MyPu5Nu9mA_TvnKM4fUjg";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-71.104081, 42.365554],
    zoom: 12,
  });

  function hideMarker(id) {
    if (id in markers) {
      console.log(id);
      markers[id].forEach((marker) => {
        marker[0].remove();
        marker[1].remove();
      });
    }
  }

  function showMarker(id) {
    if (id in markers) {
      console.log(id);
      markers[id].forEach((marker) => {
        marker[0].addTo(map);
        marker[1].addTo(map);
      });
    }
  }

  function hideAll() {
    for (const id in markers) {
      hideMarker(id);
    }
  }

  function showAll() {
    for (const id in markers) {
      showMarker(id);
    }
  }

var color = ["#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF", "#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF", "#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF", "#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF", "#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF", "#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF", "#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF", "#FF5733", "#3399FF", "#33FF57", "#FF3399", "#FF33FF", "#FFFF33", "#33FFFF"];
var c = 0;
var busColor = {};
var j = 0;
var markers = {}

async function setPoints() {
  const buses = await run();
  let marker = null;
  let textMarker = null;
  console.log("Updating...");
  buses.forEach((bus, i) => {
    if (!(bus.id in busColor)) {
      busColor[bus.id] = color[c];
      c++;
    }
    marker = new mapboxgl.Marker({ color: busColor[bus.id] })
      .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
      .addTo(map);

    var textElement = document.createElement("div");
    textElement.style.color = "#333";
    textElement.style.backgroundColor = "#fff";
    textElement.style.fontSize = "14px";
    textElement.textContent = `${j}`;
    textElement.style.padding = "0px 2px 0px 2px";

    // Position the text element relative to the marker
    textMarker = new mapboxgl.Marker({
      element: textElement,
    })
      .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
      .addTo(map);

    if (bus.id in markers) {
      markers[bus.id].push([marker, textMarker]);
    } else {
      markers[bus.id] = [[marker, textMarker]];
    }
  });

  j++;
}

function listAddMarker(color, id) {
  let father = document.createElement("div");
  father.style.display = "flex";
  father.style.alignItems = "center";
  father.style.justifyContent = "space-between";
  father.style.gap = "5px";

  let child = document.createElement("div");
  child.style.borderRadius = "50%";
    child.style.width = "15px";
    child.style.height = "15px";
    child.style.backgroundColor = color;

    let child2 = document.createElement("p");
    child2.innerHTML = id;

    let child3 = document.createElement("p");
    child3.innerHTML = markers[id].length;
    child3.style.backgroundColor = "black";
    child3.style.color = "white";
    child3.style.padding = "3px";

    let child4 = document.createElement("button");
    child4.innerHTML = "H";
    child4.style.fontSize = "10px";
    child4.style.backgroundColor = "red";
    child4.style.color = "white";
    child4.onclick = function() {
        hideMarker(id);
    }

    let child5 = document.createElement("button");
    child5.innerHTML = "S";
    child5.style.fontSize = "10px";
    child5.style.backgroundColor = "green";
    child5.style.color = "white";
    child5.onclick = function() {
        showMarker(id);
    }

    let child6 = document.createElement("div");
    // child6.style.display = "flex";
    // child6.style.flexDirection = "column";

    child6.appendChild(child4);
    child6.appendChild(child5);

    father.appendChild(child);
    father.appendChild(child2);
    father.appendChild(child3);
    father.appendChild(child6);


    document.getElementById("buses").appendChild(father);
}

function listRemoveMarkers() {
    const parentElement = document.getElementById("buses");
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
}

function listMarkers() {
    listRemoveMarkers();
    for (const id in busColor) {
        listAddMarker(busColor[id], id);
    };
}

function startRunning() {
    let button = document.getElementById("startButton");
    if (running) {
        clearInterval(running);
        clearInterval(listAll);
        running = null;
        button.innerHTML = "Start";
        button.style.backgroundColor = "green";
        button.style.color = "white";
        pauseTimer()
    } else {
        running = setInterval(setPoints, 15000);
        listAll = setInterval(listMarkers, 15000);
        button.innerHTML = "Stop";
        button.style.backgroundColor = "red";
        button.style.color = "white";
        restartTimer()
    }
    
}

setPoints();
var running = setInterval(setPoints, 15000);
var listAll = setInterval(listMarkers, 15000);


// Timer
const timerContainer = document.getElementById('timer');
let timerInterval;
let totalSeconds = 0;

function updateTimer() {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    timerContainer.textContent = `${hours}:${minutes}:${seconds}`;
    totalSeconds++;
}

timerInterval = setInterval(updateTimer, 1000);

function pauseTimer() {
    clearInterval(timerInterval);
}

function restartTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}