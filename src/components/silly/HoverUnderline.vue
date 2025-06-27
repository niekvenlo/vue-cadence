<style scoped>
div.demo-pme4x {
  margin-block: 3em;
  display: flex;
  h3 {
    padding-inline: 2ch;
    font-size: 3em;
    color: white;
    text-transform: uppercase;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    &:hover {
      font-style: italic;
    }
  }
}

h3.hover-underline {
  background: linear-gradient(#1095c1 0 0) no-repeat var(--p, 0) 100% / var(--p, 0) 0.1em;
  transition:
    0.4s,
    background-position 0s;

  &:hover {
    --p: 100%;
  }
}

h3.hover-background {
  background: linear-gradient(#1095c1 0 0) no-repeat var(--p, 0) 100% / var(--p, 0) 100%;
  transition:
    0.4s,
    background-position 0s;

  &:hover {
    --p: 100%;
  }
}

h3.hover-gradient {
  background: linear-gradient(#f095c1 0 0) no-repeat 100% var(--p, 0%) / 100% var(--p, 0%);
  transition:
    0.4s,
    background-position 0s;

  &:hover {
    --p: 100%;
  }
}

h3.hover-gradient2 {
  background: linear-gradient(#f095c1 0 0) no-repeat var(--p, 0%) 100% / 100% var(--p, 0%);
  transition:
    0.4s,
    background-position 0s;

  &:hover {
    --p: 100%;
  }
}

h3.hover-gradient-bisexual {
  background: linear-gradient(#f095c1 30%, rgb(0, 200, 255) 100%) no-repeat var(--p, 0%) 100% / 100%
    var(--p, 0%);
  transition:
    0.4s,
    background-position 0s;

  &:hover {
    --p: 100%;
  }
}

h3.hover-gradient-rainbow {
  background: linear-gradient(in hsl longer hue, #f095c1, #f095c1) no-repeat var(--p, 0%) 100% /
    100% var(--p, 0%);
  transition:
    0.4s,
    background-position 0s;

  &:hover {
    --p: 100%;
  }
}
</style>

<template>
  <div class="demo-pme4x">
    <h3 class="hover-underline">Sign in</h3>
    <h3 class="hover-underline">Register</h3>
  </div>
  <div class="demo-pme4x">
    <h3 class="hover-background">Sign in</h3>
    <h3 class="hover-background">Register</h3>
  </div>
  <div class="demo-pme4x">
    <h3 class="hover-gradient">Sign in</h3>
    <h3 class="hover-gradient">Register</h3>
  </div>
  <div class="demo-pme4x">
    <h3 class="hover-gradient2">Sign in</h3>
    <h3 class="hover-gradient2">Register</h3>
  </div>
  <div class="demo-pme4x">
    <h3 class="hover-gradient-bisexual">Sign in</h3>
    <h3 class="hover-gradient-bisexual">Register</h3>
  </div>
  <div class="demo-pme4x">
    <h3 class="hover-gradient-rainbow">Sign in</h3>
    <h3 class="hover-gradient-rainbow">Register</h3>
  </div>
</template>
