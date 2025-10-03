<template>
  <div class="tracking-page">
    <h1>Tracking</h1>
    <SiteList />
  </div>
</template>

<script>
import SiteList from "../components/SiteList.vue";

export default {
  name: "TrackingPage",
  components: { SiteList }
};
</script>

<style scoped>
.tracking-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}
</style>
