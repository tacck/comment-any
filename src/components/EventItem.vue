<template>
  <v-col cols="12">
    <v-card
      :to="{ name: 'EventDetail', params: { eventId: event.id } }"
      :outlined="!event.active"
    >
      <v-card-title>{{ event.name }}</v-card-title>
      <v-card-subtitle>{{ event.createdAt }}</v-card-subtitle>
      <v-btn
        absolute
        top
        right
        fab
        x-small
        elevation="0"
        :outlined="!event.active"
        :disabled="!isEventOwner"
        color="info"
        class="mt-6"
        @click.prevent="activeSwitch"
        ><v-icon v-if="event.active">mdi-lock-open-variant-outline</v-icon
        ><v-icon v-else>mdi-lock-outline</v-icon></v-btn
      ></v-card
    >
  </v-col>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
    isEventOwner: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    activeSwitch: function() {
      this.$emit('activeSwitch', {
        id: this.event.id,
        active: !this.event.active,
      })
    },
  },
}
</script>
