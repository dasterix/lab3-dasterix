Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: '#app',
    data: {
      number: '',
      max : '',
      current: { /* initialize objects */
        title: '',
        img: '',
        alt: ''
      },
        loading: true,
        addedName: '',
        addedComment: '',
        comments: {},
        ratings: {},
        average: 0,
    },

    computed: {
        month() {
          var month = new Array;
          if (this.current.month === undefined)
            return '';
          month[0] = "January";
          month[1] = "February";
          month[2] = "March";
          month[3] = "April";
          month[4] = "May";
          month[5] = "June";
          month[6] = "July";
          month[7] = "August";
          month[8] = "September";
          month[9] = "October";
          month[10] = "November";
          month[11] = "December";
          return month[this.current.month - 1];
        },

        avgRating() {
            if (this.ratings[this.number] === undefined)
                return 0;
            else { 
                this.average = this.ratings[this.number].sum / this.ratings[this.number].total;
            }
            return (Math.round(this.average * 100)  / 100);
            },
      },

    created() { /* runs code at startup */
      this.xkcd();
    },

    watch: {
        number(value, oldvalue) {
          if (oldvalue === '') {
            this.max = value;
          } else {
            this.xkcd();
          }
        },
      },

    methods: {
      xkcd() {
        axios.get('https://xkcd.now.sh/' + this.number) /* axios.get is like calling fetch in javascript */
          .then(response => {
            this.loading = true; /* same as function(response) {} both syntaxes indicate this is an anonymous function, it has no name */
            this.current = response.data; /* current holds all the JSON from the API */
            this.loading = false; 
            this.number = response.data.num;
            return true;
          })
          .catch(error => {
              this.loading = false;
              this.number = this.max;
            console.log(error)
          });
      },

      previousComic() {
        this.loading = true;
        this.number = this.current.num - 1;
        if (this.number < 1)
          this.number = 1;
      },
      nextComic() {
        this.loading = true;
        this.number = this.current.num + 1;
        if (this.number > this.max){
          this.number = this.max
          this.loading = false;
        }
      },

      getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
      },

      randomComic() {
        this.number = this.getRandom(1, this.max);
        this.loading = true;
      },

      addComment() {
        if (!(this.number in this.comments))
          Vue.set(app.comments, this.number, new Array); /* view will not update the screen with an object update unless you call Vue.set */
        this.comments[this.number].push({
          author: this.addedName,
          text: this.addedComment
        });
        this.addedName = '';
        this.addedComment = '';
      },

      setRating(rating){
        // Handle the rating
        if (!(this.number in this.ratings))
        Vue.set(this.ratings, this.number, {
          sum: 0,
          total: 0
        });
        this.ratings[this.number].sum += rating;
        this.ratings[this.number].total += 1;
      },
     
    }

    /* Another way to write the same xkcd() code
     async xkcd() {
      try {
        this.loading = true;
        let response = await axios.get('https://xkcd.now.sh/' + this.number); /* await made this an asyncronous call.
        without it, the program would keep executing and this.current would be undefined

        this.current = response.data;
        this.loading = false;
        this.number = response.data.num;
      } catch (error) {
        console.log(error);
      }
    },

    */

  });
  