<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text @click="copyLink" v-bind="attrs" v-on="on"
          ><v-icon color="grey">mdi-link</v-icon></v-btn
        >
      </template>
      <span>Copy: {{ linkUrl }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    linkUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    copyLink: function() {
      const listener = event => {
        event.clipboardData.setData('text/plain', this.linkUrl)
        // 本来のイベントをキャンセル
        event.preventDefault()
        // 終わったら一応削除
        document.removeEventListener('copy', listener)
      }

      document.addEventListener('copy', listener)
      document.execCommand('copy')
    },
  },
}
</script>
