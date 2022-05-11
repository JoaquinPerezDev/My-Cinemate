document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("movie-app JS imported successfully!");
    document.getElementById('lang').addEventListener(
      "change", (e) => {
        console.log(e.target.value)
        fetch(`/lang/${e.target.value}`)
          .then((res) => res.json())
          .then((json) => console.log(json))
          .catch((err) => console.log(err))
      }
    )
  },
  false
);


