export default function Container() {

  let style = {
    height: "93vh",
  };

  let styleTwo = {
    
  };

  return (

    <div>

    <header>

      <nav class="navbar navbar-expand-lg navbar-light bg-white">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarExample01"
            aria-controls="navbarExample01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars"></i>
          </button>
          <div class="collapse navbar-collapse" id="navbarExample01">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item active">
                <a class="nav-link" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Features</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Pricing</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">About</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
   

      <div
        id="intro-example"
        class="p-5 text-center bg-black"
        style={style}
      >
        <div class="mask">
          <div class="">
            <div class="text-white d-flex flex-column align-items-center justify-content-center">
              <h1 class="mb-3">Learn Bootstrap 5 with MDB</h1>
              <h5 class="mb-4">Best & free guide of responsive web design</h5>
              <a
                class="btn btn-outline-light btn-lg m-2"
                href="https://www.youtube.com/watch?v=c9B4TPnak1A"
                role="button"
                rel="nofollow"
                target="_blank"
              >Start tutorial</a
              >
              <a
                class="btn btn-outline-light btn-lg m-2"
                href="https://mdbootstrap.com/docs/standard/"
                target="_blank"
                role="button"
              >Download MDB UI KIT</a
              >
            </div>
          </div>
        </div>
      </div>
    </header>
      
    </div>
  );
}
