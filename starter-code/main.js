Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>
  
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>
  
  <p>
    <label for="review">Review:</label>      
    <textarea id="review" v-model="review"></textarea>
  </p>
  
  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>Would you recomend this product ?</p>
  <label>
    Yes 
    <input type="radio" value="Yes" v-model="recommend"/>
  </label>
  <label>
    No 
    <input type="radio" value="No" v-model="recommend"/>
  </label>
  
  <p>
    <input type="submit" value="Submit">  
  </p>    
</form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if(this.name && this.review && this.rating){
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        this.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if(!this.name) this.errors.push("Name required.");
        if(!this.review) this.errors.push("Review required.");
        if(!this.rating) this.errors.push("Rating required.");
        if(!this.recommend) this.errors.push("Recommendation required.");
      }      
    }
  }
});

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },

  template: `
    <ul> Details:
       <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
});

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },

  template: `
    <div class="product">
      <div class="product-image">
        <img v-bind:src="image" v-bind:alt="altText">
      </div>
    
      <div class="product-info">
        <h1>{{ title }}</h1>
        <a :href="link">More products like this</a>
        <p>{{ description }}</p>
        <p v-if="inStock">In Stock</p>
        <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
        <p>{{ sale }}</p>
        <p>Shipping: {{ shipping }}</p>


        <ul> Sizes: 
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <div  class="color-box"
              v-for="(variant, index) in variants" 
              :key="variant.variantId"
              :style="{ backgroundColor: variant.variantColor }"
              @mouseover="updateProduct(index)"              
            >
        </div>

        <button v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
                >Add to cart
        </button>
        <button @click="removeFromCart">Remove from cart</button>
        
        <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
          <li v-for="(review, index) in reviews" :key="index">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
       </div>

       <product-review @review-submitted="addReview"></product-review>

      </div>
    </div>
  `,
  
  data() {
    return{
      brand: 'Vue Mastery',
      product: 'Socks',
      description: 'A pair of warm, fuzzy socks',
      selectedVariant: 0,
      altText: 'A pair of socks.',
      link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId       : 2234,
          variantColor    : "green",
          variantImage    : './assets/vmSocks-green-onWhite.jpg',
          variantQuantity : 10
        },
        {
          variantId       : 2235,
          variantColor    : "blue",
          variantImage    : './assets/vmSocks-blue-onWhite.jpg',
          variantQuantity : 0
        }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      reviews: []
    };
  },

  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },

    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
    },

    updateProduct(index) {
      this.selectedVariant = index;
    },

    addReview(productReview) {
      this.reviews.push(productReview);
    }
  },
    
  computed: {
    title() {
      return this.brand + ' ' + this.product; 
    },

    image() {
      return this.variants[this.selectedVariant].variantImage;
    },

    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },

    sale() {
      if(this.onSale){
        return this.brand + ' ' + this.product + ' are on sale !';
      }
        return this.brand + ' ' + this.product + ' are not on sale';
    },

    shipping() {
      if (this.premium) {
        return "Free";
      }
        return 2.99;
    }
  }
});

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },

  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    
    removeItem(id) {
      for(var i = (this.cart.length - 1); i >= 0; i --){
        if(this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
