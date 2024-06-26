export default function Hero() {

  return (

    <div style={{width: 100 + 'vw' }}>

        <div id="hero-container" class="p-5 text-center d-flex align-items-center justify-content-center">
          <div class="mask">
            <div class="">
              <div class="text-white d-flex flex-column align-items-center justify-content-center">
                <h1 class="mb-3">Easing Separation Anxiety One Pup At A Time!</h1>
                <h5 class="mb-4">Click Below To View Our Products.</h5>
                <a
                  class="btn btn-outline-light btn-lg m-2"
                  href="/catalog"
                  role="button"
                >Shop Now</a>

              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}
