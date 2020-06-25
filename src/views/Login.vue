<template>
  <v-container>
    <v-row>
      <v-col cols="12"><PageTitle title="Login"></PageTitle></v-col>
    </v-row>
    <v-row>
      <v-col cols="12">email</v-col>
      <v-col cols="12">password</v-col>
    </v-row>
  </v-container>
</template>

<script>
import PageTitle from '@/components/PageTitle'

export default {
  components: {
    PageTitle,
  },
}
</script>

<style></style>
