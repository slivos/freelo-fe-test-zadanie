<template>
  <MainLayout>
    <TodoLists />

    <RevertBox />
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "../Layouts/MainLayout.vue";
import TodoLists from "../Components/Todo/TodoLists.vue";
import RevertBox from "../Components/RevertBox.vue";
</script>
