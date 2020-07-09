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
}
</script>
