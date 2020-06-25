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
      userName: 'me',
      events: [
        {
          id: '12345',
          name: 'サンプルイベント',
          active: true,
          createdAt: '2020-06-23 15:20:00',
          owner: 'me',
        },
        {
          id: '67890',
          name: '終了イベント',
          active: false,
          createdAt: '2020-06-21 15:00:00',
          owner: 'me',
        },
        {
          id: 'abcde',
          name: 'Not owner',
          active: true,
          createdAt: '2020-06-22 14:00:00',
          owner: 'someone',
        },
      ],
    }
  },
  methods: {
    addEvent: function() {
      const id =
        'event-' +
        Math.floor(Math.random() * 1000) +
        '-' +
        Math.floor(Math.random() * 1000)

      this.events.push({
        id: id,
        name: this.newEventName,
        active: true,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      })

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
    activeSwitch: function(event) {
      const index = this.events.findIndex(item => item.id === event.id)
      if (index < 0) {
        return
      }
      this.events[index].active = event.active
    },
  },
}
</script>
