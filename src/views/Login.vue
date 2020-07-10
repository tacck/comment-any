<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <amplify-authenticator>
          <amplify-sign-up
            slot="sign-up"
            :form-fields.prop="formFields"
          ></amplify-sign-up>
          <div>
            <amplify-sign-out></amplify-sign-out>
          </div>
        </amplify-authenticator>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth, Hub } from 'aws-amplify'

export default {
  data: function() {
    return {
      formFields: [
        {
          type: 'username',
          label: 'Username',
          placeholder: 'Username',
          required: true,
        },
        {
          type: 'password',
          label: 'Password',
          placeholder: 'Password',
          required: true,
        },
        {
          type: 'email',
          label: 'Email Address',
          placeholder: 'Email',
          required: true,
        },
      ],
    }
  },
  created: function() {
    Hub.listen('auth', this.changeState)
  },
  beforeDestroy: function() {
    Hub.remove('auth', this.changeState)
  },
  methods: {
    changeState: async function(data) {
      const user = await Auth.currentUserInfo()
      switch (data.payload.event) {
        case 'signIn':
          this.$store.commit('setUser', user)
          this.$router.push('/')
          break
        case 'signOut':
          this.$store.commit('setUser', null)
          break
      }
    },
  },
}
</script>
