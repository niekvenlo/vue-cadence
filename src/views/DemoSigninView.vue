<script setup lang="ts"></script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:600,800');
.demo-signin-view {
  display: flex;
  justify-content: center;
  .tPFg0q_center {
    padding-top: 3em;
    width: 400px;
    display: flex;
    flex-direction: column;
    height: 50dvh;
    justify-content: space-around;
    align-items: center;
  }
  .tPFg0q_title {
    text-align: center;
    width: 100%;
    justify-content: center;
    padding-bottom: 30px;
    font-family: Montserrat;
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .qpejaG_wrapper {
    width: 100%;
    input {
      color: inherit;
      color: #aab0cc;
      border: 2px solid #aab0cc;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      outline: unset;
      text-align: left;
      width: 100%;
      height: 3em;
    }
  }

  .qpejaG_buttons {
    width: 100%;
    display: flex;
    flex-direction: column;

    button {
      width: 100%;
      height: 3em;
    }
  }

  .VUH3zq_button {
    svg {
      max-height: 3em;
    }
  }
  .VUH3zq_buttons {
    justify-content: center;
    display: flex;
  }
}
</style>

<template>
  <div class="demo-signin-view">
    <div class="tPFg0q_center">
      <span class="tPFg0q_title">Login</span>
      <form method="post" class="qpejaG_wrapper">
        <div class="jlNO-G_wrapper">
          <div class="KKpREq_inputWrapper jlNO-G_border">
            <input class="Bma1Cq_textInput KKpREq_input" name="username" value="" /><span
              class="KKpREq_placeholder"
              >Email</span
            >
          </div>
        </div>
        <div class="jlNO-G_wrapper qpejaG_paddingTop">
          <div class="KKpREq_inputWrapper qpejaG_paddingTop jlNO-G_border">
            <input
              class="KKpREq_input IZPOka_input"
              name="password"
              type="password"
              autocomplete="current-password"
              value=""
            /><span class="IZPOka_hideIcon IZPOka_showIcon"></span
            ><span class="KKpREq_placeholder"> Password</span>
          </div>
        </div>
        <a
          class="qpejaG_resetPassword"
          href="/reset-password/?from=%2Fsepanta%2F&amp;user_action=follow&amp;creator=sepanta"
          >Forgot password?</a
        >
      </form>
      <div class="qpejaG_buttons">
        <button class="_7lrYkG_button _7lrYkG_primary _7lrYkG_isFullWidth">
          <div class="_7lrYkG_text"><span class="_7lrYkG_text">Login</span></div>
          <div class="_7lrYkG_spinnerWrapper">
            <div
              class="f2f-spinner"
              style="
                display: block;
                border-left-color: var(--color-purple-400);
                border-right-color: var(--color-purple-400);
                border-top-color: var(--color-white-1000);
                border-bottom-color: var(--color-purple-400);
                border-width: 0.3em;
              "
            ></div>
          </div></button
        ><a
          class="qpejaG_linkButton"
          href="/register/?from=%2Fsepanta%2F&amp;user_action=follow&amp;creator=sepanta"
          ><button class="_7lrYkG_button _7lrYkG_tertiary _7lrYkG_isFullWidth">
            <div class="_7lrYkG_text"><span class="_7lrYkG_text">Create account</span></div>
            <div class="_7lrYkG_spinnerWrapper">
              <div
                class="f2f-spinner"
                style="
                  display: block;
                  border-left-color: var(--color-grey-400);
                  border-right-color: var(--color-grey-400);
                  border-top-color: var(--color-grey-1000);
                  border-bottom-color: var(--color-grey-400);
                  border-width: 0.3em;
                "
              ></div>
            </div></button
        ></a>
        <div class="VUH3zq_wrapper">
          Or log in with
          <div class="VUH3zq_buttons">
            <a
              class="VUH3zq_button"
              href="/accounts/oauth/google/?source_b64=eyJjcmVhdG9yIjoic2VwYW50YSIsImFjdGlvbiI6ImZvbGxvdyIsImZyb20iOiIvc2VwYW50YS8ifQ=="
              ><div class="bqHW7W_wrapper">
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
                </svg></div></a
            ><a
              class="VUH3zq_button"
              href="/accounts/oauth/x/?source_b64=eyJjcmVhdG9yIjoic2VwYW50YSIsImFjdGlvbiI6ImZvbGxvdyIsImZyb20iOiIvc2VwYW50YS8ifQ=="
              ><div class="bqHW7W_wrapper">
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
                </svg></div
            ></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
