import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#84b4d7',
        secondary: '#8a86b1',
        accent: '#cb7298',
        error: '#9266cc',
        warning: '#1c7a82',
        info: '#396893',
        success: '#4CAF50'
      }
    }
  }
})
