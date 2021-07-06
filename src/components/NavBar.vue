<template>
  <!-- eslint-disable max-len -->
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/process-modeler">Process Modeler</router-link></li>
      <li><router-link to="/decision-modeler">Decision Modeler</router-link></li>
      <li><router-link to="/form-editor">Form Editor</router-link></li>
      <li><router-link to="/process">Process Definition List</router-link></li>
      <li><router-link to="/task">Task List</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  height: 1.25em;
}
li {
  /* 使导航栏内li元素横向排列 */
  display: inline-block;
  width: 240px;
}
/* 用于设置router-link内置的a标签样式 */
a {
  display: flex;
  /* 将flex元素横轴设置为中心对齐 */
  justify-content: center;
  /* 将flex元素纵轴设置为中心对齐 */
  align-items: center;
  text-decoration: none;
  border: solid 1px;
}
</style>
