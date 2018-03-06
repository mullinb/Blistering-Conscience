# <a href="https://blistering-conscience.herokuapp.com/">Blistering-Conscience</a>

<h3>An interactive imageboard in the style of Pinterest, this project demonstrates familiarity with PostGreSQL, Amazon S3, Vue.js, and an (incomplete) approach to masonry-style layout. Vue.js provides for SPA (single page app) functionality, with the page dynamically updating it’s contents as they become available.</h3>
<div align="center">
<img src="https://s3.amazonaws.com/fluxlymoppings/pics/Screen+Shot+2018-02-27+at+12.08.32.png" width="700">
</div>
Users can upload photos to the imageboard either anonymously or with an account should they choose to register. Much of the account registration code on the backend was adapted from my <a href=“https://github.com/mullinb/Petition-To-Improve-The-Discourse”>petition project</a>. Both anonymous and registered users are able to comment on photos including using hashtags (borrowed directly from twitter’s own npm package). Hashtags are not yet functional, but the comments are protected from malicious code injection. You can use the arrow keys on your keyboard to cycle through the images in order and directly link any image to a third-party using the image modal's URL.
<div align="center">
<img src="https://s3.amazonaws.com/fluxlymoppings/pics/Screen+Shot+2018-02-27+at+12.08.17.png" width="700">
</div>
The server interacts with Amazon’s S3 service to host the image files that users have uploaded, before returning the new hyperlink that is automatically piped into Vue’s dynamically updated components. A database stores these references for later. Another database stores user comments.
<div align="center">
<img src="https://s3.amazonaws.com/fluxlymoppings/pics/Screen+Shot+2018-02-27+at+12.09.18.png" width="700">
</div>
The masonry layout is buggy, probably owing to the fact that I borrowed some vanilla JavaScript code from <a href=“https://medium.com/@_jh3y/how-to-the-masonry-layout-56f0fe0b19df”>Jhey Thompkins</a> for my implementation; that this leans on vanilla JS and CSS, while the appearance of the page is primarily controlled by Vue.js, must be the source of the bugginess. It resizes flawlessly, and this can be used to eliminate any mistakes in the render. Check out the reactive column number as your viewing window gets narrow(note: not ready for mobile consumption!!).
<div align="center">
<img src="https://s3.amazonaws.com/fluxlymoppings/pics/Screen+Shot+2018-02-27+at+12.09.48.png" width="700">
</div>
Check it out <a href="https://blistering-conscience.herokuapp.com/">here</a>.

## Technologies

<ul>
  <li>Vue.js</li>
  <li>Masonry layout</li>
  <li>Amazon Web Services S3</li>
  <li>bcrypt</li>
  <li>PostGreSQL</li>  
  <li>Node.js</li>
  <li>express.js</li>  
</ul>
  
