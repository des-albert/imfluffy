<template>
  <v-container mt-5 pt-5>
    <!--   Add Post Title -->

    <v-row justify="center">
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--primary">Create Post</h1>
      </v-flex>
    </v-row>

    <!--    Add Post Form -->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form @submit.prevent="handleAddPost" v-model="isFormValid" lazy-validation ref="form">
          <!-- Title Input -->
          <v-row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required />
            </v-flex>
          </v-row>

          <v-row v-if="file === null">
            <v-flex xs12>
              <vue-dropzone ref="imgDropZone" id="customdropzone" :options="dropzoneOptions" :useCustomSlot="true" @vdropzone-complete="afterComplete">
                <div class="dropzone-custom-content">
                  <h3 class="dropzone-custom-title">Drag and drop to upload content!</h3>
                  <div class="subtitle">...or click to select a file from your computer</div>
                </div>
              </vue-dropzone>
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
              <v-select :rules="categoriesRules" v-model="categories" :items="['Cats', 'Dinos', 'Twitter', 'Random']" multiple label="Categories"> </v-select>
            </v-flex>
          </v-row>

          <!--  Description Text Area -->

          <v-row>
            <v-flex xs12>
              <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required />
            </v-flex>
          </v-row>

          <v-row class="text-center">
            <v-flex xs12>
              <v-btn :loading="loading" :disabed="!isFormValid || loading" color="info" type="submit">
                <span slot="loader" class="custom-loader">
                  <v-icon light>mdi-reload</v-icon>
                </span>
                Submit
              </v-btn>
            </v-flex>
          </v-row>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: 'AddPost',
  components: {
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      file: null,
      filesSelected: 1,
      cloudName: 'dsyohxfyg',
      preset: 'esh3pivg',
      fileContents: null,
      formData: null,
      isFormValid: true,
      tags: 'browser-upload',
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [title => !!title || 'Title is required', title => title.length < 20 || 'Title must have less than 20 characters'],
      imageRules: [image => !!image || 'Image is required'],
      categoriesRules: [categories => categories.length >= 1 || 'At least one category is required'],
      descRules: [desc => !!desc || 'Description is required', desc => desc.length < 200 || 'Description must have less than 200 characters'],
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 50,
        thumbnailHeight: 50,
        addRemoveLinks: false,
        acceptedFiles: '.jpg, .jpeg, .png'
      }
    }
  },
  computed: {
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    async afterComplete(upload) {
      this.file = upload
      let reader = new FileReader()
      reader.addEventListener(
        'load',
        function() {
          this.fileContents = reader.result
          this.formData = new FormData()
          this.formData.append('upload_preset', this.preset)
          this.formData.append('tags', this.tags)
          this.formData.append('file', this.fileContents)
          let cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`
          let requestObj = {
            url: cloudinaryUploadURL,
            method: 'POST',
            data: this.formData,
            onUploadProgress: function(progressEvent) {
              this.progress = Math.round((progressEvent.loaded * 100.0) / progressEvent.total)
            }.bind(this)
          }
          //show progress bar at beginning of post
          this.showProgress = true
          axios(requestObj)
            .then(response => {
              this.results = response.data
              this.imageUrl = this.results.url
            })
            .catch(error => {
              this.errors.push(error)
              console.log(this.error)
            })
            .finally(() => {
              setTimeout(
                function() {
                  this.showProgress = false
                }.bind(this),
                1000
              )
            })
        }.bind(this),
        false
      )

      if (this.file && this.file.name) {
        reader.readAsDataURL(this.file)
      }
      this.$refs.imgDropZone.removeFile(upload)
    },
    handleAddPost() {
      // add post action

      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id,
          createdDate: null
        })
        this.$router.push('/')
      }
    }
  }
}
</script>
<style>
#customdropzone {
  background-color: rgba(84, 125, 128, 0.404);
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  transition: background-color 0.2s linear;
  height: 100px;
  padding: 40px;
}

.dropzone-custom-title {
  margin-top: 0;
  color: #00b782;
}

.subtitle {
  color: #314b5f;
}
</style>
