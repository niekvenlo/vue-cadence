<style scoped>
.responsive-flexbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  & > * {
    flex-grow: 0.5;
  }
}

.sidebar {
  background-image: url('/Sepanta_noUI.png');
  background-size: cover;
  background-color: rgba(255, 255, 255, 0.8);
  mix-blend-mode: multiply;
  font-size: 3em;
  margin-inline: 3em;
  text-align: center;
  color: rgb(237, 121, 20);
  mix-blend-mode: multiply;
  background-color: rgb(2, 20, 59);
  max-width: 400px;
  margin: 1em;
}

.demo-signin-view {
  display: flex;
  justify-content: center;
  font-family: sans-serif;

  .wrapper {
    --timing-fhw: 0.4s ease-out;
    transition:
      padding-top var(--timing-fhw),
      gap var(--timing-fhw);
    padding: 1em;
    padding-top: 5em;
    width: min(100vw, 400px);
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    height: 50dvh;
    justify-content: space-around;
    align-items: center;
  }
  h1 {
    transition: margin-bottom var(--timing-fhw);
    margin-bottom: 0.5em;
    text-align: center;
    width: 100%;
    justify-content: center;
    font-family: Montserrat;
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  input {
    color: inherit;
    color: #aab0cc;
    border: 2px solid #c4cae7;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    outline: unset;
    text-align: left;
    width: 100%;
    min-height: 2.5em;
    margin: 0.2em;
    padding-inline: 0.5em;
  }

  .btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 2px solid rgb(58, 58, 185);
    border-radius: 4px;
    background: white;
    color: black;
    text-decoration: none;
    width: 100%;
    min-height: 2.5em;
    margin: 0.2em;
    &.primary {
      background: rgb(58, 58, 185);
      color: white;
    }
  }

  .forgot {
    margin-left: auto;
    color: grey;
    font-size: 0.8em;
    text-decoration: none;
  }

  .alternative-login {
    div {
      background: white;
      display: flex;
      gap: 0.5em;
      svg {
        max-height: 2.5em;
      }
    }
  }
}
</style>

<template>
  <div class="responsive-flexbox">
    <div class="demo-signin-view">
      <div class="wrapper">
        <h1>Login</h1>
        <input name="username" value="" placeholder="Email" />
        <input name="password" type="password" value="" placeholder="Password" />
        <a
          class="forgot"
          href="/reset-password/?from=%2Fsepanta%2F&amp;user_action=follow&amp;creator=sepanta"
          >Forgot password?</a
        >
        <button class="btn primary">Login</button>
        <a
          class="btn"
          href="/register/?from=%2Fsepanta%2F&amp;user_action=follow&amp;creator=sepanta"
        >
          Create account
        </a>
        <div class="alternative-login">
          Or log in with
          <div>
            <a
              href="/accounts/oauth/google/?source_b64=eyJjcmVhdG9yIjoic2VwYW50YSIsImFjdGlvbiI6ImZvbGxvdyIsImZyb20iOiIvc2VwYW50YS8ifQ=="
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.75 12.875H26.75H15.5V17.875H22.5C21.5 20.75 18.75 22.875 15.5 22.875C11.375 22.875 8 19.5 8 15.375C8 11.25 11.375 7.875 15.5 7.875C17.375 7.875 19.125 8.625 20.5 9.75L24 6.25C21.75 4.125 18.875 2.75 15.5 2.75C8.625 2.75 3 8.375 3 15.25C3 22.125 8.625 27.75 15.5 27.75C22.375 27.75 28 22.125 28 15.25C28 14.375 27.875 13.625 27.75 12.875Z"
                  fill="#FFC107"
                ></path>
                <path
                  d="M27.75 12.875H26.75H15.5V17.875H22.5C22 19.25 21.125 20.5 20 21.375L23.875 24.625C23.625 24.875 28 21.625 28 15.375C28 14.375 27.875 13.625 27.75 12.875Z"
                  fill="#1976D2"
                ></path>
                <path
                  d="M4.5 9.5L8.625 12.5C9.75 9.75 12.375 7.875 15.5 7.875C17.375 7.875 19.125 8.625 20.5 9.75L24 6.25C21.75 4.125 18.875 2.75 15.5 2.75C10.75 2.75 6.625 5.5 4.5 9.5Z"
                  fill="#FF3D00"
                ></path>
                <path
                  d="M15.5 27.75C18.75 27.75 21.625 26.5 23.875 24.5L20 21.25C18.75 22.25 17.25 22.75 15.5 22.75C12.25 22.75 9.5 20.625 8.5 17.75L4.5 20.875C6.5 24.875 10.75 27.75 15.5 27.75Z"
                  fill="#4CAF50"
                ></path>
              </svg>
            </a>
            <a
              href="/accounts/oauth/x/?source_b64=eyJjcmVhdG9yIjoic2VwYW50YSIsImFjdGlvbiI6ImZvbGxvdyIsImZyb20iOiIvc2VwYW50YS8ifQ=="
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.875 13.625L27.125 3H24.875L16.75 12.25L10.5 3H3L12.75 16.875L3 28H5.25L13.75 18.25L20.5 28H28M6 4.625H9.375L25 26.5H21.625"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
          </div>
        </div>
        <div class="fake-keyboard"></div>
      </div>
    </div>

    <div class="sidebar">Join <strong>Sepanta</strong> and many other creators inside.</div>
    <!-- <img src="/Sepanta_noUI.png" height="600px" />
    <img src="/Sepanta_noUI.png" height="600px" />
    <img src="/Sepanta_noUI.png" height="600px" /> -->
  </div>
</template>
