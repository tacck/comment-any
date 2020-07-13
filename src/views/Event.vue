<template>
  <v-container>
    <v-row>
      <v-col cols="8"><PageTitle title="Event List"></PageTitle></v-col>
      <v-col cols="4" class="text-right"
        ><v-btn fab color="primary" @click="newEventNameDialog = true"
          ><v-icon>mdi-plus</v-icon></v-btn
        ></v-col
      >
    </v-row>
    <v-row v-for="(event, index) in sortedEvents" :key="index">
      <EventItem
        :event="event"
        :isEventOwner="isEventOwner(event.owner)"
        @activeSwitch="activeSwitch"
      ></EventItem>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="newEventNameDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Event</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Event Name"
                  v-model="newEventName"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="cancelAddEvent">Close</v-btn>
            <v-btn color="primary" text @click="addEvent">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { API, graphqlOperation } from 'aws-amplify'
import { listEvents } from '@/graphql/queries'
import { createEvent, updateEvent } from '@/graphql/mutations'

import moment from 'moment'

import PageTitle from '@/components/PageTitle'
import EventItem from '@/components/EventItem'

export default {
  components: {
    PageTitle,
    EventItem,
  },
  computed: {
    sortedEvents: function() {
      return this.events
        .map(i => i)
        .sort((a, b) => {
          return moment(a.createdAt) < moment(b.createdAt) ? 1 : -1
        })
    },
  },
  data: function() {
    return {
      newEventName: '',
      newEventNameDialog: false,
      userName: '',
      events: [],
    }
  },
  created: async function() {
    this.userName = this.$store.state.user.username

    const items = await API.graphql(graphqlOperation(listEvents)).catch(err =>
      console.error('listEvents', err),
    )
    this.events = items.data.listEvents.items
  },
  methods: {
    addEvent: async function() {
      if (!this.newEventName || this.newEventName.length <= 0) {
        return
      }

      const input = {
        name: this.newEventName,
        active: true,
      }

      const item = await API.graphql(
        graphqlOperation(createEvent, { input: input }),
      ).catch(err => console.error('createEvent', err))
      const savedEvent = item.data.createEvent

      this.events.push(savedEvent)

      this.newEventNameDialog = false
      this.newEventName = ''
    },
    cancelAddEvent: function() {
      this.newEventNameDialog = false
      this.newEventName = ''
    },
    isEventOwner: function(eventOwner) {
      return eventOwner === this.userName
    },
    activeSwitch: async function(event) {
      const index = this.events.findIndex(item => item.id === event.id)
      if (index < 0) {
        return
      }

      const item = await API.graphql(
        graphqlOperation(updateEvent, { input: event }),
      ).catch(err => console.error('updateEvent', err))
      const savedEvent = item.data.updateEvent

      this.events.splice(index, 1, savedEvent)
    },
  },
}
</script>
