function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

window.onscroll = function () {
  let scroll = window.scrollY;
  document.querySelector(".hero-bg").style.top = scroll * 0.2 + "px";
};

let viewer;

function openModal() {
  document.getElementById("modal").style.display = "block";

  if (viewer) viewer.destroy();

  viewer = pannellum.viewer('panorama', {
    type: 'equirectangular',
    panorama: 'room1.jpg',
    autoLoad: true
  });
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  if (viewer) viewer.destroy();
}

function book(e) {
  e.preventDefault();
  alert("Booking Confirmed!");
}
