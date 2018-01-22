(function() {

    var app = new Vue({
        el: '#main',
        data: {
            submissionHeading: "Upload a new one you Wumper, ye be well invited",
            heading: "These be latest photos Chancey",
            headingClassName: 'heading',
            pics: [],
            fileStatus: "No file selected.",
            title: '',
            description: '',
            username: ''
        },
        mounted: function() {
            axios.get('/pictures')
            .then(function (response) {
                console.log(response.data[0]);
                for (var i = 0; i < response.data.length; i++) {
                    app.pics.push(response.data[i]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }

    });



})();
