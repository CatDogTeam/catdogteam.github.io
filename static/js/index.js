window.HELP_IMPROVE_VIDEOJS = false;

// Object to store preloaded images for each folder
const preloadedImages = {};
let totalImagesToLoad = 0;
let loadedImages = 0;

function preloadInterpolationImages(callback) {
  $('.interpolation-container').each(function() {
    const folder = this.dataset.folder;
    const frames = parseInt(this.dataset.frames);
    preloadedImages[folder] = [];
    totalImagesToLoad += frames;

    for (let i = 0; i < frames; i++) {
      const img = new Image();
      img.onload = function() {
        loadedImages++;
        if (loadedImages === totalImagesToLoad) {
          callback();
        }
      };
      img.src = `./static/interpolation/${folder}/${String(i)}.webp`;
      // Try PNG if WebP fails
      img.onerror = function() {
        img.src = `./static/interpolation/${folder}/${String(i)}.png`;
      };
      preloadedImages[folder][i] = img;
    }
  });
}

function createInterpolationSlider(container) {
  const folder = container.dataset.folder;
  const frames = parseInt(container.dataset.frames);
  const sliderId = `interpolation-slider-${folder}`;
  const imageWrapperId = `interpolation-image-wrapper-${folder}`;

  const sliderHtml = `
    <div class="columns is-vcentered interpolation-panel">
      <div class="column interpolation-video-column">
        <div id="${imageWrapperId}">
          <div class="loading">Loading...</div>
        </div>
        <input class="slider is-fullwidth is-large is-info"
               id="${sliderId}"
               step="1" min="0" max="${frames - 1}" value="0" type="range">
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', sliderHtml);

  $(`#${sliderId}`).on('input', function(event) {
    const image = preloadedImages[folder][this.value];
    
    setInterpolationImage(imageWrapperId, image);
  });
  // Set initial image
  setInterpolationImage(imageWrapperId, preloadedImages[folder][0]);
}

function setInterpolationImage(imageWrapperId, image) {
  image.ondragstart = () => false;
  image.oncontextmenu = () => false;
  var element = $("#" + imageWrapperId);
  element.empty().append(image);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
      $('.interpolation-container').each(function() {
        createInterpolationSlider(this);
      });

    });

    var options = {
			slidesToScroll: 3,
			slidesToShow: 5,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
      pagination: false
    }
		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    // // Loop on each carousel initialized
    // for(var i = 0; i < carousels.length; i++) {
    // 	// Add listener to  event
    // 	carousels[i].on('before:show', state => {
    // 		console.log(state);
    // 	});
    // }

    // // Access to bulmaCarousel instance of an element
    // var element = document.querySelector('#my-element');
    // if (element && element.bulmaCarousel) {
    // 	// bulmaCarousel instance is available as element.bulmaCarousel
    // 	element.bulmaCarousel.on('before-show', function(state) {
    // 		console.log(state);
    // 	});
    // }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages(function() {
      // Remove loading indicator
      $('#global-loading').remove();

      // Create sliders for each interpolation-container
      $('.interpolation-container').each(function() {
        createInterpolationSlider(this);
      });

      // Enable sliders
      $('.interpolation-container input[type="range"]').prop('disabled', false);
    });

    // Disable sliders until images are loaded
    $('.interpolation-container input[type="range"]').prop('disabled', true);

    // Show loading indicator
    $('body').append('<div id="global-loading" class="loading">Loading images...</div>');

    bulmaSlider.attach('.interpolation-container input[type="range"]');
})
