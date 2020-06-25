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
        :id="comment.id"
      >
        <CommentItem
          :ref="comment.id"
          :comment="comment"
          :isEventOwner="isEventOwner(event.owner)"
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
      comments: [
        {
          id: 'abcde1',
          name: 'User 1',
          comment: 'One Like comment.',
          updatedAt: '2020-06-23 15:20:00',
          likes: 1,
        },
        {
          id: 'abcde2',
          name: 'User 1',
          comment: 'Some comment.',
          updatedAt: '2020-06-23 15:20:00',
          likes: 10,
        },
        {
          id: 'fghij1',
          name: 'User 2',
          comment: 'Another comment.',
          updatedAt: '2020-06-23 15:30:00',
          likes: 20,
        },
        {
          id: 'fghij2',
          name: 'User 2',
          comment: 'One more comment.',
          updatedAt: '2020-06-23 15:15:00',
          likes: 10,
        },
      ],
    }
  },
  created: function() {
    this.linkUrl = location.href
  },
  updated: function() {
    for (const id of this.updatedIds) {
      this.$refs[id][0].changedComment()
    }
    this.updatedIds = []
  },
  methods: {
    addComment: function(inputComment) {
      if (!inputComment || inputComment.length <= 0) {
        return
      }

      const id =
        'comment-' +
        Math.floor(Math.random() * 1000) +
        '-' +
        Math.floor(Math.random() * 1000)
      const comment = {
        id: id,
        name: this.loginUserName,
        comment: inputComment,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        likes: 0,
      }

      this.comments.push(comment)

      this.scrollToId(id)
      this.pushUpdatedIds(id)
    },
    addLike: function(elementId) {
      const comment = this.getComment(elementId)
      if (comment === null) {
        return
      }

      const beforeIndex = this.getCommentIndex(elementId)
      comment.likes += 1
      const afterIndex = this.getCommentIndex(elementId)

      if (beforeIndex > afterIndex) {
        this.scrollToId(comment.id)
        this.pushUpdatedIds(comment.id)
      }
    },
    deleteComment: function(elementId) {
      const index = this.comments.findIndex(item => item.id === elementId)
      if (index < 0) {
        return
      }

      this.comments.splice(index, 1)
    },
    scrollToId: function(elementId) {
      setTimeout(() => {
        this.$vuetify.goTo(`#${elementId}`)
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
