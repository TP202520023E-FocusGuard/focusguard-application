<template>
  <div id="app" class="app-container">
    <aside class="sidebar">
      <h2>FocusGuard</h2>
      <nav>
        <ul>
          <li><router-link to="/tracking">Tracking</router-link></li>
          <li><router-link to="/users">Users</router-link></li>
          <li><router-link to="/settings">Settings</router-link></li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background: #2c3e50;
  color: white;
  padding: 1rem;
}

.sidebar h2 {
  margin-bottom: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 0.5rem 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>
