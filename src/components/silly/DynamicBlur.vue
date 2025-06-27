<style scoped>
div {
  margin-block: 3em;
}

@property --blur-offset {
  syntax: '<percentage>';
  initial-value: 50%;
  inherits: true;
}
@keyframes blur-travel {
  from {
    --blur-offset: 0%;
  }

  to {
    --blur-offset: 100%;
  }
}
.blur {
  filter: blur(2px);
}

.dynamic-blur {
  animation: blur-travel infinite alternate ease-in-out 3s;
  &:hover {
    --blur-offset: 55%;
  }
  border: 1px solid white;

  position: relative;
  &:after {
    content: '';
    position: absolute;
    height: 100%;
    inset: 0%;
    backdrop-filter: blur(4px);

    mask: linear-gradient(
      40deg,
      black 0%,
      black calc(var(--blur-offset) - 20%),
      transparent calc(var(--blur-offset) - 10%),
      transparent calc(10% + var(--blur-offset)),
      black calc(20% + var(--blur-offset)),
      black 100%
    );
  }
}
</style>

<template>
  <div>
    <div class="dynamic-blur">
      <span class="blur">
        <img src="/Sepanta_noUI.png" height="600px" />
      </span>
    </div>
  </div>
</template>
