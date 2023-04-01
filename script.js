let favMovies = [];
const movieSearchBox = document.getElementById("search");
const searchList = document.getElementById("search-list");
const movieDetailContainer = document.getElementById('movie-container');
const movieCardContainer = document.getElementById("movie-card-container");
const goToMyFavouriteMoviePage = document.getElementById("goToMyfavouriteMoviesPage");
const homeData = document.getElementById("home-data");
const homeDataChild = document.getElementById("home-data-child");


// Function to show any alert
function showAlert(message) {
  alert(message);
}

// Storing searched result in local storage and calling to CallAPI function for fetching data.
function findMovies() {
  const searchResult = (movieSearchBox.value).trim();
  if (searchResult.length > 0) {
    searchList.classList.remove("hide-search-list");
    var searchedMovie = localStorage.setItem("movie", searchResult);
    var searchedMovie = localStorage.getItem("movie", searchResult);
    console.log(searchedMovie);
    callAPI(searchedMovie);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

//For calling the fetchMovie function
function callAPI(searchedMovie) {
  fetchMovie(searchedMovie);
}

// Fetching data of searched result from API.
function fetchMovie(searchedMovie) {
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    var responseJSON = JSON.parse(xhrRequest.response);
    if (responseJSON.Response == "True") {
      localStorage.setItem('searchedResultObject', JSON.stringify(responseJSON.Search));
      var searchedResultObject = JSON.parse(localStorage.getItem('searchedResultObject'));
      console.log(responseJSON);
      favMovies = responseJSON.Search;
      displayMovieList("favourite");
    }
  };
  xhrRequest.open(
    "get",
    `http://www.omdbapi.com/?s=${searchedMovie}&apikey=94bacef1`,
    true
  );
  xhrRequest.send();
}

// Function to display searched result movies as a cards on screen
function displayMovieList(actionForButton) {
  movieSearchBox.value= "";
  homeData.innerHTML = "";
  movieDetailContainer.innerHTML = "";
  var searchedResultObject = JSON.parse(localStorage.getItem('searchedResultObject'));
  movieCardContainer.innerHTML = "";
  for (let idx = 0; idx < favMovies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = favMovies[idx].imdbID;
    movieListItem.classList.add("card");
    if (favMovies[idx].Poster != "N/A") {
      moviePoster = favMovies[idx].Poster;
    } else {
      moviePoster = "image_not_found.png";
    }
    console.log(favMovies);
    console.log(favMovies[0]);
    movieListItem.innerHTML = `
    <img class="card-image" src="${moviePoster}" alt="Image not found">
      <div class="card-rating flex">
        <span class="text-yellow-1"><i class="fa-regular fa-calendar-days"></i></span>
        <span style="color:rgb(174, 171, 171)">${favMovies[idx].Year}</span>
      </div>
      <div class="card-title-box">
      ${favMovies[idx].Title} 
      </div>
      <button id="${favMovies[idx].imdbID}" onclick="loadMovieDetails(this)" >Show Movie Details</button>
      <button data-id="${favMovies[idx].imdbID}" onclick="${actionForButton}(this)">
        <span>${actionForButton}</span>
      </button>
    `;
    movieCardContainer.appendChild(movieListItem);
  }
}

// Function to load particular movie details
function loadMovieDetails(element) {
  console.log("in load movie details");
  // console.log(element);
  // console.log(element.getAttribute('id'));
  fetch(`http://www.omdbapi.com/?i=${element.getAttribute('id')}&apikey=94bacef1`)
    .then((response) => response.json())
    .then((data) => displayMovieDetails(data))
    .catch((err) => console.log("Error"));
}

// Function to display particular movie details
function displayMovieDetails(details) {
  console.log(details);
  movieSearchBox.value= "";
  movieCardContainer.innerHTML = "";
  homeData.innerHTML = "";
  let movieDetail = document.createElement("div");
  movieDetail.classList.add("movie-c-sm");
  movieDetail.innerHTML = `
   <section id="movie-c-sm">
   <!-- movie section header starts:--- -->
   <header>
     <!-- section 1 of header starts -->
     <div class="flex text-white-1 flex-end mv-hd-sone align-center">
       <span>Cast & crew</span>
       <span>User reviews</span>
       <span>Trivia</span>
       <i class="fa-solid fa-pipe vertical-line"></i>
       <span>IMDbPro</span>
       <i class="fa-solid fa-pipe vertical-line"></i>
       <div class="all-topics">
         <span>All topics</span>
       </div>
       <i class="fa-solid fa-pipe vertical-line"></i>

       <i class="fa-sharp fa-solid fa-share-nodes share-icon"></i>
     </div>
     <!-- section 1 of header ends -->

     <!-- section 2 of header starts -->
     <div class="flex space-between align-center mv-h2-stwo">
       <!-- sub section 1 of section 2 starts -->
       <div class="mv-h2-stwo-sone">
         <h1 class="text-white-1 ">${details.Title}</h1>
         <div class="flex text-grey-1">
           <span>${details.Type}</span>
           <span>${details.Year}</span>
           <span>${details.Rated}</span>
           <span>${details.Runtime}</span>
         </div>
       </div>
       <!-- sub section 1 of section 2 ends -->

       <!-- sub section 2 of section 2 starts -->
       <section class="mv-h2-stwo-stwo">
         <div class="flex space-around m-16 ">
           <div class="flex flex-col align-center h-20">
             <div class="text-grey-1 varela-round">IMDb RATING</div>
             <div class="flex space-between align-center justify-center">
               <span class="text-yellow-1"><i class="fa-solid fa-star"></i></span>
               <div>
                 <div>
                   <span class="text-white-1">${details.imdbRating}</span><span class="text-grey-1">/10</span>
                 </div>
                 <div class="text-grey-1">${details.imdbVotes}</div>
               </div>
             </div>
           </div>

           <div class="flex flex-col h-20">
             <div class="text-grey-1 varela-round">YOUR RATING</div>
             <div class="text-blue-1 flex justify-center">
               <span class="m-10"><i class="fa-solid fa-star"></i></span>
               <span class="m-10">Rate</span>
             </div>
           </div>

           <div class="flex flex-col align-center h-20">
             <div class="text-grey-1 varela-round">POPULARITY</div>
             <div class="flex justify-center">
               <span class="text-green-1 m-10"><i class="fa-solid fa-fire-flame-curved"></i></span>
               <span class="text-white-1 m-10">422</span>
               <span class=" text-white-1 m-10"><i class="fa-solid fa-caret-down"></i></span>
               <span class="text-grey-1 m-10">1,471</span>
             </div>
           </div>
         </div>
       </section>
       <!-- sub section 2 of section 2 ends -->
     </div>
     <!-- section 2 of header ends -->
   </header>
   <!-- movie section header ends:--- -->



   <!-- movie section preview section starts:-- -->
   <div>
     <div class="mv-p-s1 flex">
       <div class="movie-poster"> <img style="width:100% ; height:100%;" src="${(details.Poster != 'N/A') ? details.Poster : "image_not_found.png"}" alt="poster">
       </div>
       <!-- <div class="main-preview"></div> -->
       <!-- <div class="photo-video-buttons"></div> -->

     </div>
     <div class="mv-p1-s2 flex">
       <div class="mv-info">
         <div>
           <span class="genre">${details.Genre}</span>
         </div>
         <div class="plot">${details.Plot}
         </div>
         <div class="divider"></div>
         <div class="director-box">
           <span class="director">Director</span>
           <span class="director-name text-blue-1 my-10">${details.Director}</span>
         </div>
         <div class="divider"></div>
         <div class="writer-box">
           <span class="writer">Writer</span>
           <span class="writer-name text-blue-1 my-10">${details.Writer}</span>
         </div>
         <div class="divider"></div>
         <div class="stars-box">
           <span class="stars">Stars</span>
           <span class="stars-name text-blue-1 my-10">${details.Actors}</span>
         </div>
         <div class="divider"></div>
         <div class="box-office-box hover-cursor-pointer hover-bg-grey">
           <img class="imdb-pro-2 " src="/imdb-pro-logo.jpg" alt="imdb-pro" />
           <span class="hover-underline">See production, box office & company info logo</span>
         </div>
       </div>
       <div class="mv-p1-s2-sidebar">
         <div class="addToWatchList flex">
           <div class="hover-cursor-pointer hover-bg-grey2">
             <span><i class="fa-solid fa-house"></i></span>
             <span onclick="goToHomePage()">Home</span>
           </div>
           <span class="watchlist-dropdown hover-cursor-pointer hover-bg-grey2"><i class="fa-solid fa-caret-down"></i></span>
         </div>

       </div>
     </div>
   </div>
   <!-- movie section preview section ends:-- -->
   </section>
   `;
  movieDetailContainer.appendChild(movieDetail);
}

// Function to add any movie to My Favourite List
function favourite(element) {
  let id = element.dataset.id;
  for (let i = 0; i < favMovies.length; i++) {
    if (favMovies[i].imdbID == id) {
      let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
      if (favouriteMovies == null) {
        favouriteMovies = [];
      }
      favouriteMovies.unshift(favMovies[i]);
      localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovies));
      showAlert(favMovies[i].Title + " " + "added to favourites")
      return;
    }
  }
}

// Function to remove any movie from My Favourite List
function remove(element) {
  let id = element.dataset.id;
  let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
  let newFavouriteMovies = [];
  for (let i = 0; i < favouriteMovies.length; i++) {
    if (favouriteMovies[i].imdbID == id) {
      continue;
    }
    newFavouriteMovies.push(favouriteMovies[i]);
  }
  localStorage.setItem("favouriteMovies", JSON.stringify(newFavouriteMovies));
  favMovies = newFavouriteMovies;
  displayMovieList('remove');
}

// Add click event listener to the goToMyFavouriteMoviePage Button
goToMyFavouriteMoviePage.addEventListener('click', () => {
  let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
  if (favouriteMovies == null || favouriteMovies.length < 1) {
    showAlert("Oops!! There is no movie in fav list..");
    return;
  }

  favMovies = favouriteMovies;
  displayMovieList("remove");
})

// Function for going to the Home Page
function goToHomePage() {
  movieSearchBox.value= "";
  console.log("in the go to home page");
  movieDetailContainer.innerHTML = "";
  movieCardContainer.innerHTML = "";
  homeData.appendChild(homeDataChild);
}


// Happy Ending :)

