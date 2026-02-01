<template>
  <div class="layout">
    <header class="header">
      <h1 class="title">Zeroday</h1>
      <nav class="nav">
        <RouterLink class="nav-link" to="/today">Today</RouterLink>
        <RouterLink class="nav-link" to="/achievements">Achievements</RouterLink>
      </nav>
    </header>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Inter", system-ui, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
}

.title {
  margin: 0;
  font-size: 20px;
}

.nav {
  display: flex;
  gap: 16px;
}

.nav-link {
  color: #2a5bd7;
  text-decoration: none;
  font-weight: 600;
}

.nav-link:hover {
  text-decoration: underline;
}

.content {
  flex: 1;
  padding: 24px;
}
</style>
