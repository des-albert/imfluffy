<template>
  <v-container mt-5 pt-5>
    <!--     Signup Title -->

    <v-row justify="center">
      <v-flex xs12 sm6 offset-sm3>
        <h1>Create Account</h1>
      </v-flex>
    </v-row>

    <!--     Error Alert -->

    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message" />
      </v-flex>
    </v-layout>

    <!--    Signup Form -->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="accent" dark>
          <v-container>
            <v-form @submit.prevent="handleSignupUser" v-model="isFormValid" lazy-validation ref="form">
              <v-row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required />
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs12>
                  <v-text-field :rules="emailRules" v-model="email" prepend-icon="email" label="Email" type="email" required />
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required> </v-text-field>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="gavel" label="Confirm Password" type="password" required> </v-text-field>
                </v-flex>
              </v-row>
              <v-row class="text-center">
                <v-flex xs12>
                  <v-btn :loading="loading" :disabled="!isFormValid || loading" color="info" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Signup
                  </v-btn>
                  <h3>
                    Already have an account ?
                    <router-link to="/signin">Sign-in</router-link>
                  </h3>
                </v-flex>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Signup',
  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      usernameRules: [(username) => !!username || 'Username is required', (username) => username.length < 10 || 'Username must be less than 10 characters'],
      emailRules: [(email) => !!email || 'Email is required', (email) => /.@+./.test(email) || 'Email must be valid'],
      passwordRules: [
        (password) => !!password || 'Password is required',
        (password) => password.length >= 4 || 'Username must be at least 4 characters',
        (confirmation) => confirmation === this.password || 'Passwords must match'
      ]
    }
  },

  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  watch: {
    user(value) {
      // if user changes redirect to home page

      if (value) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          password: this.password
        })
      }
    }
  }
}
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
