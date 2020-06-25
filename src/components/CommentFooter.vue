<template>
  <v-footer fixed color="white" style="z-index: 100;">
    <v-row justify="center">
      <v-col cols="10"
        ><v-card outlined color="white" :disabled="!isActiveEvent">
          <v-text-field
            label="Comment"
            outlined
            clearable
            v-model="inputComment"
            append-outer-icon="mdi-send"
            @click:append-outer="addComment"
            class="mb-n6"
          ></v-text-field></v-card
      ></v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  props: {
    isActiveEvent: {
      type: Boolean,
      required: true,
    },
  },
  data: function() {
    return {
      inputComment: '',
    }
  },
  methods: {
    addComment: function() {
      if (!this.inputComment || this.inputComment.length <= 0) {
        return
      }
      this.$emit('addComment', this.inputComment)
      this.inputComment = ''
    },
  },
}
</script>
