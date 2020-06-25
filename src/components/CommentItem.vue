<template>
  <v-col cols="12" :key="comment.id">
    <v-card>
      <div :class="commentClass()">
        <v-card-title>{{ comment.comment }}</v-card-title>
        <v-card-subtitle>{{ comment.updatedAt }}</v-card-subtitle>
        <v-btn text @click="addLike(comment.id)"
          ><v-icon>mdi-thumb-up-outline</v-icon></v-btn
        >:
        <span>{{ comment.likes }}</span>
        <v-btn
          v-if="isEventOwner"
          absolute
          top
          right
          fab
          x-small
          dark
          color="error lighten-1"
          class="mt-6"
          @click="deleteComment(comment.id)"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
      </div>
    </v-card></v-col
  >
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
    isEventOwner: {
      type: Boolean,
      required: true,
    },
  },
  data: function() {
    return {
      changed: false,
    }
  },
  methods: {
    addLike: function(commentId) {
      this.$emit('addLike', commentId)
    },
    deleteComment: function(commentId) {
      this.$emit('deleteComment', commentId)
    },
    changedComment: function() {
      this.changed = true

      setTimeout(() => {
        this.changed = false
      }, 1000)
    },
    commentClass: function() {
      return this.changed ? 'comment' : ''
    },
  },
}
</script>

<style scoped>
.comment {
  background-color: rgba(0, 0, 0, 0);
  animation-name: new-comment;
  animation-duration: 900ms;
}

@keyframes new-comment {
  0% {
    background-color: rgba(30, 140, 230, 0.5);
  }
  100% {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
