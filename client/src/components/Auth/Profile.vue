<template>
  <v-container>
    <!--    User Details  -->
    <v-row justify="center">
      <v-flex xs12 sm6>
        <v-card class="white--text" color="secondary">
          <v-layout justify-center>
            <v-flex xs-5>
              <v-img height="125px" contain :src="user.avatar"> </v-img>
            </v-flex>

            <v-flex xs-7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ user.username }}</div>
                  <div>Joined {{ formatJoinDate(user.joinDate) }}</div>
                  <div class="hidden-xs-only font-weight-thin">{{ user.favorites.length }} Favorites</div>
                  <div class="hidden-xs-only font-weight-thin">{{ userPosts.length }} Posts Added</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-row>

    <!-- Posts Favorited by user -->

    <v-container v-if="!userFavorites.length">
      <v-row justify="center">
        <v-flex xs12>
          <h2>You do not have any favorites. Go add some</h2>
        </v-flex>
      </v-row>
    </v-container>

    <v-container v-else>
      <v-row justify="center">
        <v-col>
          <h2 class="font weight-light">
            Favorited
            <span class="font-weight-regular">({{ userFavorites.length }})</span>
          </h2>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img @click="goToPost(favorite._id)" height="30vh" contain :src="favorite.imageUrl"> </v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-row>
    </v-container>

    <!-- Posts Created by Users -->

    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have not posts. Go add some</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container mt-3 v-else>
      <v-flex xs12>
        <span class="font-weight-regular">Your Posts({{ userPosts.length }})</span>
      </v-flex>

      <v-row justify-center>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2">
            <v-btn @click="loadPost(post)" color="info" fab small>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="handleDeleteUserPost(post)" color="error" fab small>
              <v-icon>delete</v-icon>
            </v-btn>
            <v-img @click="goToPost(favorite._id)" height="30vh" contain :src="post.imageUrl"></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-row>
    </v-container>

    <!-- Edit Post dialog -->

    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey light-2">Update Post</v-card-title>
        <v-container>
          <v-form @submit.prevent="handleUpdateUserPost" v-model="isFormValid" lazy-validation ref="form">
            <!-- Title Input -->

            <v-row>
              <v-flex xs12>
                <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required />
              </v-flex>
            </v-row>

            <v-row>
              <v-flex xs12>
                <v-text-field :rules="imageRules" v-model="imageUrl" label="Image URL" type="text" required />
              </v-flex>
            </v-row>

            <!--  Image Preview -->

            <v-row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px" />
              </v-flex>
            </v-row>

            <!--  Categories Select -->

            <v-row>
              <v-flex xs12>
                <v-select :rules="categoriesRules" v-model="categories" :items="['Art', 'Education', 'Travel', 'Food', 'Furniture', 'Photography', 'Technology']" multiple label="Categories">
                </v-select>
              </v-flex>
            </v-row>

            <!--  Description Text Area -->

            <v-container>
              <v-row>
                <v-flex xs12>
                  <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required />
                </v-flex>
              </v-row>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer> </v-spacer>
                <v-btn :diabled="!isFormValid" type="submit" class="success--text">Update</v-btn>
                <v-btn class="error--text" text @click="editPostDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-container>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'Profile',
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [(title) => !!title || 'Title is required', (title) => title.length < 20 || 'Title must have less than 20 characters'],
      imageRules: [(image) => !!image || 'Image is required'],
      categoriesRules: [(categories) => categories.length >= 1 || 'At least one category is required'],
      descRules: [(desc) => !!desc || 'Description is required', (desc) => desc.length < 200 || 'Description must have less than 200 characters']
    };
  },
  computed: {
    ...mapGetters(['user', 'userFavorites', 'userPosts'])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    goToPost(id) {
      this.$router.push(`/posts/${id}`);
    },
    formatJoinDate(date) {
      return moment(new Date(date)).format('ll');
    },
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm('Are you sure ?');
      if (deletePost) {
        this.$store.dispatch('deleteUserPost', {
          postId: this.postId
        });
      }
    },
    loadPost({ _id, title, imageUrl, categories, description }, editPostDialog = true) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  }
};
</script>
