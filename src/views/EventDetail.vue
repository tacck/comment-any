<template>
  <v-container>
    <v-row>
      <v-col cols="12"
        ><PageTitle :title="event.name"></PageTitle>
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
      event: {
        id: '12345',
        name: 'サンプルイベント',
        active: true,
        createdAt: '2020-06-23 15:20:00',
        owner: 'me',
      },
      userName: 'me',
      inputComment: '',
      linkUrl: '',
      updatedIds: [],
      comments: [],
    }
  },
  created: async function() {
    this.linkUrl = location.href

    const item = await API.graphql(
      graphqlOperation(getEvent, { id: this.eventId }),
    ).catch(err => console.error('getEvent', err))
    this.event = item.data.getEvent
    this.comments = this.event.comments.items
  },
  updated: function() {
    for (const id of this.updatedIds) {
      this.$refs[id][0].changedComment()
    }
    this.updatedIds = []
  },
  methods: {
    addComment: async function(inputComment) {
      if (!inputComment || inputComment.length <= 0) {
        return
      }

      const comment = {
        eventId: this.event.id,
        name: this.loginUserName,
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

      const beforeIndex = this.getCommentIndex(elementId)

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
      const afterIndex = this.getCommentIndex(elementId)

      if (beforeIndex > afterIndex) {
        this.scrollToId(comment.id)
        this.pushUpdatedIds(comment.id)
      }
    },
    deleteComment: async function(elementId) {
      const index = this.comments.findIndex(item => item.id === elementId)
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
  },
}
</script>
