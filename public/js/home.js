let headerText = document.querySelector("#HeaderText")
let body = document.querySelector("#body")
const random = Math.floor(Math.random() * 3)

if (random == 1) {
    headerText.innerText = "Navigate the city, with"
    body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)), url(https://res.cloudinary.com/djgibqxxv/image/upload/v1697073878/Hang/pxb6xdn7slqvrtlylukh.jpg)";

} else if (random == 2) {
    headerText.innerText = "Find new places, with"
    body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)), url(https://res.cloudinary.com/djgibqxxv/image/upload/v1697074244/Hang/qo2xtoi31i6qlptzcfma.jpg)";

} else {
    headerText.innerText = "Explore, with"
    body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)), url(https://res.cloudinary.com/djgibqxxv/image/upload/v1697076237/Hang/mvnlkkpzlir0zlubstql.jpg)";

}
