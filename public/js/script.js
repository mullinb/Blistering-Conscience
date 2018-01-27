(function() {

    var lastUpdate;

    var bus = new Vue();

    Vue.component('error-message', {
        props: ['message'],
        template: `<h2 class="error-message"> {{message}} </h2>`
    })

    Vue.component('register', {
        props: [],
        template:
            `<div class="registrationform">
                <h1>Register to upload, comment, hashtag, all the rage!</h1>
                <error-message v-if="showError" v-bind:message="error.message"></error-message>
                <label>Username <input v-model="registerStuff.username" required></label>
                <label>Email Address <input type="email" v-model="registerStuff.email" required></label>
                <label>Password <input type="password" v-model="registerStuff.password1" required></label>
                <label>Enter again this password <input type="password" v-model="registerStuff.password2" required></label>
                <br>
                <button type="submit" class="submitbutton" @click="register"> REGISTER </button>
            </div>`,
        data: function() {
            return {
                registerStuff: {
                    username: '',
                    email: '',
                    password1: '',
                    password2: ''
                },
                error: {
                    message: ''
                },
                showError: false
            }
        },
        methods: {
            register: function() {
                var email = this.registerStuff.email;
                console.log(this.registerStuff.email);
                if (!this.registerStuff.username.length > 0) {
                    this.error.message = 'Please enter a username.'
                    this.showError = true;
                } else if (this.registerStuff.username.indexOf(" ") >= 0) {
                this.error.message = 'Please enter a valid username (no spaces please!).'
                this.showError = true;
                } else if (!this.registerStuff.email.length > 0) {
                    this.error.message = 'Please enter an email address.'
                    this.showError = true;
                } else if (this.registerStuff.email.indexOf(" ") >= 0) {
                    console.log(this.registerStuff.email);
                    this.error.message = 'Please enter a valid email address.'
                    this.showError = true;
                } else if (this.registerStuff.email.split("@").length !== 2) {
                    console.log(this.registerStuff.email);
                    this.error.message = 'Please enter a valid email address.'
                    this.showError = true;
                } else if (!this.registerStuff.password1.length > 0) {
                    this.error.message = 'Please enter a password.'
                    this.showError = true;
                } else if (this.registerStuff.password1.indexOf(" ") >= 0) {
                    this.error.message = 'Please enter a password containing no spaces.'
                    this.showError = true;
                } else if (this.registerStuff.password1 !== this.registerStuff.password2) {
                    this.error.message = 'Passwords do not match.'
                    this.showError = true;
                } else {
                    this.registerStuff.email = email;
                    console.log(this.registerStuff)
                    axios.post('/register', this.registerStuff)
                    .then(function(response) {
                        app.loggedIn = true;
                        app.loggedOut = false;
                        app.currentUser = response.data.currentUser
                        console.log(response);
                    })
                }
            }
        }
    })

    Vue.component('login', {
        props: [],
        template:
        `<span class="loginfields">
            <error-message v-if="showError" v-bind:message="error.message"></error-message>
            <label>Username <input v-model="loginStuff.username"></label>
            <label>Password <input v-model="loginStuff.password"></label>
        </span>`,
        data: function() {
            return {
                loginStuff: {
                    username: '',
                    password: ''
                },
                error: {
                    message: ''
                },
                showError: false
            }
        },
        methods: {
            login: function () {
                if (!this.loginStuff.username.length > 0) {
                    this.error.message = 'Please enter a username.'
                    this.showError = true;
                } else if (!this.loginStuff.password1.length > 0) {
                    this.error.message = 'Please enter a password.'
                    this.showError = true;
                } else {
                axios.post("/login", this.loginStuff)
                .then(function(response) {
                    console.log(response);
                })
                }
            }
        },
        created: function () {
            bus.$on('loginAttempt', function () {
                this.login();
            })
        }
    })

    Vue.component('image-submission', {
        props: ["loggedOut"],
        template:
            `<div class="newfiles">
                <h1>{{submissionHeading}}</h1>
                <label>Title <input v-model="formStuff.title"></label>
                <label>Description <input v-model="formStuff.description"></label>
                <login v-if="loggedOut"></login>
                <br>
                <label>File <input type="file" value="SUPPPP" v-on:change="chooseFile"></label>
                <br>
                <button type="submit" class="submitbutton" @click="upload"> UPLOAD </button>
                <h3 v-if="loggedOut" class="submitbutton" @click="showRegister">Haven't registered yet? </h3>
            </div>`,
            data: function() {
                return {
                    formStuff: {
                        title: '',
                        description: '',
                        file: null
                    },
                    submissionHeading: "Upload a new one you Wumper, ye be well invited"
                }
            },
            methods: {
                chooseFile: function(e) {
                    this.formStuff.file = e.target.files[0];
                },
                uploadCheck: function(e) {
                    if (loggedOut) {
                        bus.$emit('loginAttempt')
                    } else {
                        this.upload();
                    }
                },
                upload: function(e) {
                    console.log(this.formStuff.file)
                    var formData = new FormData();
                    formData.append('file', this.formStuff.file)
                    formData.append('title', this.formStuff.title);
                    formData.append('description', this.formStuff.description);
                    formData.append('username', app.currentUser);
                    console.log(formData);
                    axios.post('/upload', formData)
                    .then(function (response) {
                        console.log(response.data.newphoto[0]);
                        response.data.newphoto[0].url = "/#" + response.data.newphoto[0].id;
                        app.pics.unshift(response.data.newphoto[0]);
                    });
                },
                showRegister: function(e) {
                    app.registerNow = true;
                    location.hash = "#register"
                }
            }
    })

    Vue.component('image-modal', {
        props: ['imgId'],
        template: `
        <div class="modal">
            <div class="shader" @click="hide">
            </div>
            <div class="inner">
                <div class="banner">
                    <img class="leftArrow arrow" src="leftArrow.png" @click="left"><img class="hero" v-bind:src="modal.image"><img class="rightArrow arrow" src="rightArrow.png" @click="right">
                </div>
                <div class="comments">
                    <h1>{{modal.title}}</h1>
                    <p>Uploaded by {{modal.username}} on {{modal.timestamp}}</p>
                    <h3>{{modal.description}}</h3>
                    <h4>Snatch somethin phrasical ya wuss, n place it here, be ye not fearful!</h4>
                    <br>
                    <h4> Comment </h4> <input class="commentbox" v-model="commentmessage">
                    <br>
                    <button v-on:click="submitComment">Add Comment</button>
                    <div v-for="comment in comments">
                        <commentslot v-bind:message="comment.message" v-bind:commentname="comment.username" v-bind:stamp="comment.created_at"></commentslot>
                    </div>
                </div>
            </div>
        </div>
        `,
        methods: {
            submitComment: function() {
                var self = this;
                console.log(this.commentmessage);
                axios.post('/addComment', {
                    message: this.commentmessage,
                    imageId: window.location.hash.slice(1),
                })
                .then(function (response) {
                    console.log("success")
                    if (response.data) {
                        self.comments.unshift(response.data[0])
                    }
                    self.commentname = '';
                    self.commentmessage = '';
                })
                .catch((err) => {
                    console.log(err);
                });
            },
            expand: function(e, value) {
                var self = this;
                value = value || e.target.parentElement.attributes.databaseid.value;
                axios.get('/pictures/' + value)
                .then((response) => {
                    console.log(response.status);
                    if (response.data) {
                        self.modal = {
                            image: response.data[0].image,
                            title: response.data[0].title,
                            description: response.data[0].description,
                            username: response.data[0].username,
                            timestamp: response.data[0].created_at,
                        }
                        window.location.hash = "#" + response.data[0].id;
                        app.show = true;

                    } else {
                        window.location.hash = "";
                        app.show = false;
                    }
                })
            },
            hide: function () {
                var d = document.documentElement;
                var x = d.scrollTop;
                window.location.hash = "";
                app.show = false;
                d.scrollTop = x;
            },
            left: function () {
                window.location.hash = (parseInt(window.location.hash.slice(1)) + 1);
            },
            right: function () {
                window.location.hash = window.location.hash.slice(1) - 1;
            }
        },
        data: function () {
            return {
                comments: [],
                commentmessage: '',
                modal: {
                    image: '',
                    title: '',
                    description: '',
                    username: '',
                    timestamp: '',
                },
            }
        },
        mounted: function() {
            console.log('remounting')
            this.expand(null, window.location.hash.slice(1))
            var self = this;
            axios.get('/comments/' + window.location.hash.slice(1))
            .then(function (response) {
                if (response.data.comments) {
                    self.comments=response.data.comments;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        watch: {
            imgId: function(val) {
                console.log(val);
                this.expand(null, window.location.hash.slice(1));
            }
        }
    })

    Vue.component('commentslot', {
        props: ['message', "commentname", "stamp"],
        template: "<div class='comment'><h4>{{message}}</h4><br><h5 class='sig'>{{commentname}} on {{stamp}}</h5></div>"
    })

    var app = new Vue({
        el: '#main',
        data: {
            loggedOut: true,
            loggedIn: false,
            currentUser: '',
            page: 1,
            imgId: window.location.hash.slice(1),
            pics: [],
            show: false,
            loadMessage: "LAODING MOAR",
            heading: "These be latest photos Chauncey",
            headingClassName: 'heading',
            csrfToken: '',
            registerNow: false
        },
        methods: {
            hide: function(e) {
                    window.location.hash = "";
                    this.show = false;
            },
            getMore: function() {
                var self = this;
                axios.get('/pictures/page/' + this.page++)
                .then(function (response) {
                    console.log(response.status);
                    if (response.status === 204) {
                        console.log("end of the line");
                        self.loadMessage = "END OF STREAM";
                    }
                    for (var i = 0; i < response.data.length; i++) {
                        app.pics.push(response.data[i]);
                        app.pics[i].url = "/#" + app.pics[i].id;
                        console.log(app.pics[i]);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

            }
        },
        mounted: function() {
            var self = this;
            if (window.location.hash.length > 1) {
                this.show = true;
            }
            axios.get('/pictures')
            .then(function (response) {
                console.log(response);
                for (var i = 0; i < response.data.results.length; i++) {
                    app.pics.push(response.data.results[i]);
                    app.pics[i].url = "/#" + app.pics[i].id;
                }
                self.csrfToken = response.data.csrf;
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    });

    window.addEventListener('hashchange', function() {
        if (window.location.hash.length > 1 && window.location.hash !== "#register") {
            app.show = true;
            app.imgId = window.location.hash.slice(1);
        } else if (window.location.hash !== "#register") {
            app.registerNow = false;
        }
    })
    var bottom = false;
    window.onscroll = function(e) {
        var d = document.documentElement;
        var offset = d.scrollTop + window.innerHeight;
        var height = d.offsetHeight;

        // console.log('offset = ' + offset);
        // console.log('height = ' + height);

        if (offset === height) {
            var page = document.getElementById("main");
            if (!page.classList.contains("noscroll")) {
                //do nothing
                bottom=true;
                setTimeout(function() {
                    if (bottom===true) {
                        app.getMore();
                    }
                }, 900);
            }
        } else {
            bottom = false;
        }
    };

    window.addEventListener('keydown', shuffle)

    function shuffle (e) {
        var page = document.getElementById("maindiv");
        if (page.classList.contains("noscroll")) {
            if (e.keyCode===37) {
                window.removeEventListener('keydown', shuffle);
                console.log(shuffle);
                e.preventDefault();
                window.location.hash = (parseInt(window.location.hash.slice(1)) + 1);
                setTimeout(reAdd, 200);
            }
            if (e.keyCode===39) {
                window.removeEventListener('keydown', shuffle);
                e.preventDefault();
                window.location.hash = window.location.hash.slice(1) - 1;
                setTimeout(reAdd, 200);
            }
        }
    }

    window.addEventListener('keydown', shuffle)

    function reAdd() {
        window.addEventListener('keydown', shuffle)
    }

})();
