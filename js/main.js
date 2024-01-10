
// console.log('Hello AJAX!');
// console.log(axios);

const flickrSearch = {

    config: {
        FLICKR_BASE_URL: 'https://api.flickr.com/services/rest',
        FLICKR_API_KEY: '2f5ac274ecfac5a455f38745704ad084'
    },

    dom: {},

    // initUi: function(){}
    initUi(){

        this.dom = {
        
            searchForm: document.querySelector('#searchForm'),
            searchText: document.querySelector('#searchText'),
            searchResults: document.querySelector('#results'),
            photoDetails: document.querySelector('#details')
        };

        console.log(this.dom.searchForm);

        this.dom.searchForm.addEventListener('submit', ev => {
            console.log('form submitted');
            ev.preventDefault();

            console.log('value of this', this);

            console.log(this.dom.searchText.value);

            this.loadSearchResults(this.dom.searchText.value); //AJAX event occurs in this method

        }); //submit event
        
        this.dom.searchText.focus();

        //Event delegation for clicking on search results:
        //we listen for clicks on the div#results parent element
        this.dom.searchResults.addEventListener('click', ev => {
            console.log('img clicked', ev.target, ev.target.dataset.id);
            this.loadPhotoDetails(ev.target.dataset.id);
            //added data-id added to img object in console log
        }); //eventListener: img result click handler

    }, // initUi()
    

    loadSearchResults(searchText){

        console.log(`in loadSearchResults:`, searchText);

        this.dom.searchResults.replaceChildren(); //alt way to clear

        const loadingNode = document.createElement('p');
        loadingNode.innerHTML = "Loading search results...";
        this.dom.searchResults.appendChild(loadingNode);
        

        axios.get(this.config.FLICKR_BASE_URL, {
            params: {
                method: 'flickr.photos.search',
                text: searchText,
                format: 'json',
                nojsoncallback: 1,
                api_key: this.config.FLICKR_API_KEY

            }
        })

        // axios.get(`${this.config.FLICKR_BASE_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&text=${searchText}&format=json&nojsoncallback=1`)

        .then( res => {
           console.log('data:', res.data); 
           window.results = res.data; // debugging trick. results is random var

            this.renderSearchResults(res.data.photos.photo);

        })
        .catch( err => {
            console.warn('Error loading search results', err);
        });

    }, //loadSearchResults


    renderSearchResults(photos){

        console.log('in renderSearchResults', photos);

        //this.dom.searchResults.innerHTML = ''; // clear for 2nd search
        this.dom.searchResults.replaceChildren(); //alt way to clear loading message


        for(const photo of photos){             // photo = result
            console.log(photo.title);
            console.log(this.generateImageUrl(photo));

            const imgNode = document.createElement('img');
            imgNode.src = this.generateImageUrl(photo);
            imgNode.alt = photo.title;

            // ?? What about ID for clicking for detailed view
            //<img data-id="${photo.id}"
            imgNode.dataset.id = photo.id;

            this.dom.searchResults.appendChild(imgNode); //query

        } // each photo


    }, // renderSearchResults


    generateImageUrl(photo, size='q'){  //photo param here is random
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`
    },


    loadPhotoDetails(id){
        console.log('PhotoDetails', id);

        axios.get(this.config.FLICKR_BASE_URL, {
            param: {
                method: 'flickr.photos.getInfo',
                photo_id: id,
                api_key: this.config.FLICKR_API_KEY,
                format: 'json',
                nojsonallback: 1
            }
        })
            .then( res => {
                console.log('details: ', res.data);
            

            })
            .catch( err => {
                console.warn('Error', id, err);
            });

    },// loadPhotoDetail

}; // flickrSearch main app object


flickrSearch.initUi();