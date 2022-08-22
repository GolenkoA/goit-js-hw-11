import axios from "axios";
BASE_URL = 'https://pixabay.com/api/';
API_KEY = '29425160-9db241c351837afee1f7453f7';

const options = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
};

export default class PixabayAPI {

    constructor() {
        this.searchQuery = ''
        this.page = 1;
        this.per_page = 40;
    }

    async getImages() {
        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${this.page}&per_page=${this.per_page}`;
        try {
            const response = await axios.get(url);
            this.incrementPage();
            return response.data;
        } catch (error) {
            console.log(error.message);
        }
    }

    incrementPage() {
        this.page += 1;
    }

     removePage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}