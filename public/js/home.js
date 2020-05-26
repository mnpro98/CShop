var slideIndex = 1;
showSlides(slideIndex);

var arrItems = [];

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
} 

function watchItem(){
  let items = document.querySelectorAll('.item');

  for(i = 0; i < items.length; i++){
    items[i].addEventListener('click', (event) => {
      event.preventDefault();

      let url = `/item-info.html/${arrItems[event.currentTarget.id].id}`;
      let settings = {
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json'
        }
      }

      fetch( url, settings )
        .then( response => {
          if( response.ok ){
            return response.json();
          }
          throw new Error( response.statusText );
        })
        .catch( err => {
          console.log(err.message);
        });
    });
  }
}

function getItems(){
  let itemDisplay = document.getElementById('popular-item-box');

  let url = '/items';
  let settings = {
    method : 'GET',
    headers : {
      'Content-Type' : 'application/json'
    }
  }

  fetch( url, settings )
    .then( response => {
      if( response.ok ){
        return response.json();
      }
      throw new Error( response.statusText );
    })
    .then( responseJSON => {
      let limit = 0;

      if(responseJSON.length > 10)
        limit = 10;
      else
        limit = responseJSON.length;

      for(let i = 0; i < limit; i++){
        arrItems.push(responseJSON[i]);
        itemDisplay.innerHTML += `
        <div class="item" id="${i}">
          <h3>${responseJSON[i].name}</h3>
          <img src="${responseJSON[i].imageUrl}" class="item-image">
          <h4>Price: ${responseJSON[i].price}</h4>
        </div>`
      }
      watchItem();
    })
    .catch( err => {
      console.log(err.message);
    });
}

function init(){
  getItems();
}

init();