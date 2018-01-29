(function() {

    const CLASSES = {
        MASONRY: 'masonry',
        PANEL  : 'masonry-panel',
        PAD    : 'masonry-pad',
    }

    class Masonry {

    constructor(el) {
        this.container = el
        this.panels = document.querySelectorAll(`.masonry-panel`)
        this.state = {
            heights: [],
        }
        this.layout()
    }
    /**
    * Reset the layout by removing padding elements, resetting heights
    * reference and removing the container inline style
    */
    reset() {
        const {
            container,
        } = this
        this.state.heights = []
        const fillers = container.querySelectorAll(`.${CLASSES.PAD}`)
        if (fillers.length) {
            for(let f = 0; f < fillers.length; f++) {
                fillers[f].parentNode.removeChild(fillers[f])
            }
        }
        this.panels = document.querySelectorAll(`.masonry-panel`)
        container.removeAttribute('style')
    }
    /**
    * Iterate through panels and work out the height of the layout
    */
        /**
    * Set the layout height based on referencing the content cumulative height
    * This probably doesn't need its own function but felt right to be nice
    * and neat
    */

    // /**
    //   * JavaScript method for setting order of each panel based on panels.length and desired number of columns
    // */
    setOrders() {
        const {
            panels,
        } = this
        var idx = 0;
        var element = document.querySelector('.masonry-panel');
        console.log(element);

        var style = window.getComputedStyle(element),
            width = style.getPropertyValue('width');
            width = width.replace('px', '');
            width = width/window.innerWidth;

        var cols = Math.ceil(1/width) - 1;
        panels.forEach((panel, idx) => {
            panel.style.order = ((idx + 1) % cols === 0) ? cols : (idx + 1) % cols
        })
    }

    populateHeights() {
        const {
            panels,
            state,
        } = this
        const {
            heights,
        } = state
        for (let p = 0; p < panels.length; p++) {
            const panel = panels[p]
            const {
                order: cssOrder,
                msFlexOrder,
                height,
            } = getComputedStyle(panel)
            const order = cssOrder || msFlexOrder
            if (!heights[order - 1]) heights[order - 1] = 0
                heights[order - 1] += parseInt(height, 10)
        }
    }
    /**
    * Pad out layout "columns" with padding elements that make heights equal
    */

    setLayout() {
        const {
            container,
            state,
        } = this
        const {
            heights,
        } = state
        var element = document.querySelector('.masonry-panel'),
            elements = document.querySelectorAll('.masonry-panel'),
            style = window.getComputedStyle(element),
            width = style.getPropertyValue('width');
            width = width.replace('px', '');
            width = width/window.innerWidth;

        var cols = Math.ceil(1/width) - 1;
        var number = (Math.ceil(elements.length/cols) + 1);
        this.state.maxHeight = (Math.max(...heights));
        var targetHeight = this.state.maxHeight + (16 * number);
        container.style.height = `${targetHeight}px`
    }

    pad() {
        const {
            container,
        } = this
        const {
            heights,
            maxHeight,
        } = this.state
        heights.map((height, idx) => {
            if (height < maxHeight && height > 0) {
                const pad             = document.createElement('div')
                pad.className         = CLASSES.PAD
                pad.style.height      = `${maxHeight - height}px`
                pad.style.order       = idx + 1
                pad.style.msFlexOrder = idx + 1
                container.appendChild(pad)
            }
        })
    }

/**
* Resets and lays out elements
*/
    layout() {
        this.reset()
        this.setOrders()
        this.populateHeights()
        this.setLayout()
        this.pad()
        }
    }

  //     * To make responsive, onResize layout again
  //   * NOTE:: For better performance, please debounce this!
  // */


        function makeMasonry() {
            window.myMasonry = new Masonry(document.querySelector(`.${CLASSES.MASONRY}`))
            myMasonry.layout()
        }

        window.addEventListener('resize', () => {
            myMasonry.layout()
        })


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
                <button type="submit" class="submitbutton" @click="register"> BECOME DEATH ITSELF </button>
                <h4 class="registerLink" @click="hideRegister">Button only of fools</h4>
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
                var self = this;
                var email = this.registerStuff.email;
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
                    this.error.message = 'Please enter a valid email address.'
                    this.showError = true;
                } else if (this.registerStuff.email.split("@").length !== 2) {
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
                    axios.post('/register', this.registerStuff)
                    .then(function(response) {
                        self.$emit("loggedin", response.data.userSession)
                    })
                }
            },
            hideRegister: function(e) {
                app.registerNow = false;
            }
        }
    })

    Vue.component('logged-in', {
        props: ["username"],
        template: `<div class=loggedIn><p>Avast, {{username}}. Flee your destiny <br><a class="logoutlink" @click="logout">down this vorpal tunnel</a>(LOGOUT YOU RUBE)</p></div>`,
        methods: {
            logout: function () {
                var self = this;
                axios.get("/logout")
                .then(function(response) {
                    if (response.data.success) {
                        self.$emit("logout");
                    } else {

                    }
                })
            }
        },
        data: function() {
            return {
                errorMessage: ''
            }
        }
    })

    Vue.component('login', {
        props: ["register-now"],
        template:
        `<div class="loginfields">
            <register v-if="registerNow" nv-on:loggedin="registerUser"></register>
            <div v-else>
            <h1> Log in and prove your worth, have ye no mettle, remain ya ANON as we proceed. <i>Think it over</i> </h1>
            <error-message v-if="showError" v-bind:message="error.message"></error-message>
            <label>Username <input v-model="loginStuff.username"></label>
            <label>Password <input v-model="loginStuff.password"></label>
            <br>
            <button type="submit" class="submitbutton" @click="login"><i>respawn</i></button>
            <h4 class="registerLink" @click="showRegister">Need ye register? Click here <h3>you weasel</h3> </h4>
            </div>
        </div>`,
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
                var self = this;
                if (!this.loginStuff.username.length > 0) {
                    this.error.message = 'Please enter a username.'
                    this.showError = true;
                } else if (!this.loginStuff.password.length > 0) {
                    this.error.message = 'Please enter a password.'
                    this.showError = true;
                } else {
                axios.post("/login", this.loginStuff)
                .then(function(response) {
                    if (response.data.success) {
                        self.$emit("loggedin", response.data.userSession);
                    }
                })
                }
            },
            registerUser: function (val) {
                self.$emit("loggedin", val);
            },
            showRegister: function(e) {
                app.registerNow = true;
            }
        }
    })

    Vue.component('image-submission', {
        props: [],
        template:
            `<div class="newfiles">
                <h1>{{submissionHeading}}<i>{{loversTitle}}</i></h1>
                <label>Title <input v-model="formStuff.title"></label>
                <label>Description <input v-model="formStuff.description"></label>
                <br>
                <label>File <input type="file" value="SUPPPP" v-on:change="chooseFile"></label>
                <br>
                <button type="submit" class="submitbutton" @click="upload"> UPLADD </button>
            </div>`,
            data: function() {
                return {
                    formStuff: {
                        title: '',
                        description: '',
                        file: null
                    },
                    submissionHeading: "Upload a new one you Wumper, ye be well invited",
                    loversTitle: ''
                }
            },
            methods: {
                chooseFile: function(e) {
                    this.formStuff.file = e.target.files[0];
                },
                upload: function(e) {
                    var self = this;
                    var formData = new FormData();
                    formData.append('file', this.formStuff.file)
                    formData.append('title', this.formStuff.title);
                    formData.append('description', this.formStuff.description);
                    formData.append('username', app.currentUser);
                    axios.post('/upload', formData)
                    .then(function (response) {
                        response.data.newphoto[0].url = "/#" + response.data.newphoto[0].id;
                        app.pics.unshift(response.data.newphoto[0]);
                        self.formStuff = {
                            title: '',
                            description: '',
                            file: null
                        };
                        myMasonry.layout()
                        console.log(self.formStuff);
                        self.submissionHeading = "That's one down, let it load n don't be shy bout showin what is you've got ";
                        self.loversTitle = "honey";
                        self.$emit("upload-count");
                })
            }
        }
    })

    Vue.component('image-modal', {
        props: ['imgId'],
        template:
        `<div class="modal">
            <div class="shader" @click="hide">
            </div>
            <div class="inner">
                <div class="banner">
                    <img class="leftArrow arrow" src="leftArrow.png" @click="left"><img class="hero" v-bind:src="modal.image"><img class="rightArrow arrow" src="rightArrow.png" @click="right">
                </div>
                <div class="comments">
                    <h1>{{modal.title}}</h1>
                    <h3>{{modal.description}}</h3>
                    <p>Uploaded by {{modal.username}} on {{modal.timestamp}}</p>
                    <br>

                    <h4>Snatch somethin phrasical ya wuss, n place it here, be ye not fearful!</h4>
                    <textarea class="commentbox" v-model="commentmessage" placeholder="spittle receptacle <BR> <BR> ERROR CRASHING AND DELETING HARD DRIVE"></textarea>
                    <br>
                    <button v-on:click="submitComment">Secrete Smomment</button>
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
                axios.post('/addComment', {
                    message: this.commentmessage,
                    imageId: window.location.hash.slice(1),
                })
                .then(function (response) {
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
                this.expand(null, window.location.hash.slice(1));
            }
        }
    })

    Vue.component('commentslot', {
        props: ['message', "commentname", "stamp"],
        template: `<div class='comment'><h4 v-html="message"></h4><br><h5 class='sig'>{{commentname}} on {{stamp}}</h5></div>`
    })

    var app = new Vue({
        el: '#main',
        data: {
            hashtagFeed: false,
            loggedIn: false,
            currentUser: '',
            page: 1,
            imgId: '',
            pics: [],
            show: false,
            loadMessage: "LAODING MOAR",
            heading: "These be latest photos Chauncey",
            headingClassName: 'heading',
            csrfToken: '',
            registerNow: false,
            uploadCount: 0
        },
        methods: {
            hide: function(e) {
                    window.location.hash = "";
                    this.show = false;
            },
            getMore: function() {
                var self = this;
                axios.post('/pictures/page/' + this.page++, {
                    uls: this.uploadCount
                })
                .then(function (response) {
                    if (response.status === 204) {
                        self.loadMessage = "END OF STREAM/PC LOADLETTER";
                    } else {
                        for (var i = 0; i < response.data.length; i++) {
                            app.pics.push(response.data[i]);
                            app.pics[i].url = "/#" + app.pics[i].id;
                        }
                        self.uploadCount = 0;
                        setTimeout(makeMasonry, 100);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

            },
            logUserIn: function(userSession) {
                this.loggedIn = true;
                this.currentUser = userSession.username;
            },
            logout: function() {
                this.loggedIn = false;
                this.currentUser = '';
            },
            uploadIncrement: function() {
                this.uploadCount += 1;
            }
        },
        mounted: function() {
            var self = this;
            if (window.location.hash.length > 1) {
                this.show = true;
            }
            axios.get('/pictures')
            .then(function (response) {
                for (var i = 0; i < response.data.results.length; i++) {
                    app.pics.push(response.data.results[i]);
                    app.pics[i].url = "/#" + app.pics[i].id;
                }
                setTimeout(makeMasonry, 100);
                if (response.data.userSession !== undefined) {
                    self.loggedIn = true;
                    self.currentUser = response.data.userSession.username;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        created: function() {
        }
    });

    window.addEventListener('hashchange', function() {
        if (window.location.hash.length > 1 && !(window.location.hash.indexOf("hashtags") > -1)) {
            app.show = true;
            app.imgId = window.location.hash.slice(1);
        } else if (window.location.hash.indexOf("#hashtags/") === 0) {
            app.hashtagFeed = true;
            app.show = false;
            app.imgId = '';
        }
    })
    var bottom = false;

    var bottomReacher = window.setInterval(reachedBottom, 1200);

    function reachedBottom (e) {
        var d = document.documentElement;
        var offset = d.scrollTop + window.innerHeight;
        var height = d.scrollHeight;

        if (offset + 5 > height) {
            var page = document.getElementById("main");
            if (!page.classList.contains("noscroll")) {
                //do nothing
                bottom=true;
                setTimeout(function() {
                    if (bottom===true) {
                        window.clearInterval(bottomReacher);
                        app.getMore();
                        setTimeout(reAddScroll, 1000)
                    }
                }, 500);
            }
        } else {
            setTimeout(reAddScroll, 1000)
            bottom = false;
        }
    }


    window.addEventListener('keydown', shuffle)

    function shuffle (e) {
        var page = document.getElementById("maindiv");
        if (page.classList.contains("noscroll")) {
            if (e.keyCode===37) {
                window.removeEventListener('keydown', shuffle);
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

    function reAdd() {
        window.addEventListener('keydown', shuffle)
    }

    function reAddScroll() {
        window.clearInterval(bottomReacher);
        bottomReacher = window.setInterval(reachedBottom, 1200);
    }



})();
