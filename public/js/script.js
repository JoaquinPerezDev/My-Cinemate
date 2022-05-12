document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("movie-app JS imported successfully!");
    document.querySelectorAll('[name="lang"]').forEach((element) => {
      console.log(element)
      element.addEventListener(
        "change", (e) => {
          console.log(e.target.value)
          fetch(`/lang/${e.target.value}`)
            .then((res) => res.json())
            .then((json) => {
              console.log(json)
              window.location.reload()
            })
            .catch((err) => console.log(err))
        }
      )
    })
  },
  false
);


