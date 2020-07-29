<template>
  <v-container>
    <v-row>
      <v-col cols="12"
        ><PageTitle v-if="event.name" :title="event.name"></PageTitle>
        <CopyableLinkIcon :linkUrl="linkUrl"></CopyableLinkIcon>
      </v-col>
    </v-row>
    <v-scroll-y-transition group>
      <v-row
        v-for="comment in sortedComments"
        :key="comment.id"
        :id="'_' + comment.id"
      >
        <CommentItem
          :ref="comment.id"
          :comment="comment"
          :isEventOwner="isEventOwner(event.owner)"
          :isActiveEvent="event.active"
          @addLike="addLike"
          @deleteComment="deleteComment"
        ></CommentItem>
      </v-row>
    </v-scroll-y-transition>
    <v-col class="my-10"></v-col>
    <CommentFooter
      v-if="event.active !== void 0"
      :isActiveEvent="event.active"
      @addComment="addComment"
    ></CommentFooter>
  </v-container>
</template>

<script>
import { API, graphqlOperation } from 'aws-amplify'
import { getEvent } from '@/graphql/queries'
import {
  createComment,
  updateComment,
  deleteComment,
} from '@/graphql/mutations'
import {
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
} from '@/graphql/subscriptions'

import moment from 'moment'

import PageTitle from '@/components/PageTitle'
import CopyableLinkIcon from '@/components/CopyableLinkIcon'
import CommentItem from '@/components/CommentItem'
import CommentFooter from '@/components/CommentFooter'

export default {
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  components: {
    PageTitle,
    CopyableLinkIcon,
    CommentItem,
    CommentFooter,
  },
  computed: {
    sortedComments: function() {
      return this.comments
        .map(i => i)
        .sort((a, b) => {
          return a.likes < b.likes
            ? 1
            : a.likes === b.likes && moment(a.updatedAt) < moment(b.updatedAt)
            ? 1
            : -1
        })
    },
  },
  data: function() {
    return {
      event: {},
      userName: '',
      inputComment: '',
      linkUrl: '',
      updatedIds: [],
      comments: [],
      onCreateCommentSubscription: null,
      onUpdateCommentSubscription: null,
      onDeleteCommentSubscription: null,
    }
  },
  created: async function() {
    this.linkUrl = location.href
    this.userName = this.$store.state.user.username

    const item = await API.graphql(
      graphqlOperation(getEvent, { id: this.eventId }),
    ).catch(err => console.error('getEvent', err))
    this.event = item.data.getEvent
    this.comments = this.event.comments.items

    this.onCreateCommentSubscription = API.graphql(
      graphqlOperation(onCreateComment),
    ).subscribe({
      next: data => {
        const savedComment = data.value.data.onCreateComment
        if (!this.isTargetEvent(savedComment.eventId)) {
          return
        }

        const comment = this.getComment(savedComment.id)
        if (comment === null) {
          this.comments.push(savedComment)
        }
      },
    })

    this.onUpdateCommentSubscription = API.graphql(
      graphqlOperation(onUpdateComment),
    ).subscribe({
      next: data => {
        const updatedComment = data.value.data.onUpdateComment
        if (!this.isTargetEvent(updatedComment.eventId)) {
          return
        }

        const comment = this.getComment(updatedComment.id)
        if (comment === null) {
          return
        }
        comment.likes = updatedComment.likes
        comment.updatedAt = updatedComment.updatedAt
      },
    })

    this.onDeleteCommentSubscription = API.graphql(
      graphqlOperation(onDeleteComment),
    ).subscribe({
      next: data => {
        const deletedComment = data.value.data.onDeleteComment
        if (!this.isTargetEvent(deletedComment.eventId)) {
          return
        }

        const deletedCommentIndex = this.getCommentIndex(deletedComment.id)
        if (deletedCommentIndex >= 0) {
          this.comments.splice(deletedCommentIndex, 1)
        }
      },
    })
  },
  updated: function() {
    for (const id of this.updatedIds) {
      this.$refs[id][0].changedComment()
    }
    this.updatedIds = []
  },
  beforeDestroy: function() {
    if (this.onCreateCommentSubscription) {
      this.onCreateCommentSubscription.unsubscribe()
      this.onCreateCommentSubscription = null
    }

    if (this.onUpdateCommentSubscription) {
      this.onUpdateCommentSubscription.unsubscribe()
      this.onUpdateCommentSubscription = null
    }

    if (this.onDeleteCommentSubscription) {
      this.onDeleteCommentSubscription.unsubscribe()
      this.onDeleteCommentSubscription = null
    }
  },
  methods: {
    addComment: async function(inputComment) {
      if (!inputComment || inputComment.length <= 0) {
        return
      }

      const comment = {
        eventId: this.event.id,
        name: this.userName,
        comment: inputComment,
        likes: 0,
      }

      const item = await API.graphql(
        graphqlOperation(createComment, { input: comment }),
      ).catch(err => console.error('createComment', err))
      const savedComment = item.data.createComment

      this.comments.push(savedComment)

      this.scrollToId(savedComment.id)
      this.pushUpdatedIds(savedComment.id)
    },
    addLike: async function(elementId) {
      const comment = this.getComment(elementId)
      if (comment === null) {
        return
      }

      const beforeIndex = this.getSortedCommentIndex(elementId)

      const input = {
        id: comment.id,
        likes: comment.likes + 1,
      }

      const item = await API.graphql(
        graphqlOperation(updateComment, { input: input }),
      ).catch(err => console.error('updateComment', err))
      const savedComment = item.data.updateComment

      comment.likes = savedComment.likes
      comment.updatedAt = savedComment.updatedAt
      const afterIndex = this.getSortedCommentIndex(elementId)

      if (beforeIndex > afterIndex) {
        this.scrollToId(comment.id)
        this.pushUpdatedIds(comment.id)
      }
    },
    deleteComment: async function(elementId) {
      const index = this.getCommentIndex(elementId)
      if (index < 0) {
        return
      }

      const comment = this.getComment(elementId)
      const input = {
        id: comment.id,
      }

      await API.graphql(
        graphqlOperation(deleteComment, { input: input }),
      ).catch(err => console.error('deleteComment', err))

      this.comments.splice(index, 1)
    },
    scrollToId: function(elementId) {
      setTimeout(() => {
        // ID attribute must not start with a number.
        this.$vuetify.goTo(`#_${elementId}`)
      }, 100)
    },
    getComment: function(elementId) {
      const comment = this.comments.find(item => item.id === elementId)
      if (comment === void 0) {
        return null
      }
      return comment
    },
    getCommentIndex: function(elementId) {
      return this.comments.findIndex(item => item.id === elementId)
    },
    getSortedCommentIndex: function(elementId) {
      return this.sortedComments.findIndex(item => item.id === elementId)
    },
    pushUpdatedIds: function(elementId) {
      if (!this.updatedIds.includes(elementId)) {
        this.updatedIds.push(elementId)
      }
    },
    isEventOwner: function(eventOwner) {
      return eventOwner === this.userName
    },
    isTargetEvent: function(eventId) {
      return this.event.id === eventId
    },
  },
}
</script>
