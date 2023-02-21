<script lang="ts">
  interface QuoteType {
    date: string;
    zh: string;
    en: string;
    img: string;
  }

  let isLoading = true;
  let isButtonDisabled = true;
  let currentDate = new Date();
  let promise = fetchQuote();

  $: {
    const newDate = new Date();
    newDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
    isButtonDisabled = newDate > new Date();
  }

  async function fetchQuote() {
    isLoading = true;
    currentDate.setHours(currentDate.getHours() - 1);
    const date = currentDate.toLocaleDateString("zh-cn", { timeZone: "Asia/Shanghai" }).replaceAll("/", "-");

    const url = "https://chromeawslambdaapi.mraddict.one/quote" + `?${new URLSearchParams({ date })}`;
    const res = await fetch(url);

    if (res.status !== 200) {
      isLoading = false;
      throw new Error("Cannot fetch quote!");
    }
    const result = await res.json();

    if (!result.status) {
      isLoading = false;
      throw new Error(result.message);
    }
    return result.data as QuoteType;
  }

  function handleClick(next: boolean) {
    const newDate = new Date();

    if (next) newDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
    else newDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000);

    if (newDate > new Date()) return;
    currentDate = newDate;
    promise = fetchQuote();
  }
</script>

<main class="card">
  {#if isLoading}
    <section class="loading" />
  {/if}
  {#await promise then quote}
    {#if quote}
      <section aria-label="image">
        <button on:click={() => handleClick(false)} class="left">{"<"}</button>
        <button disabled={isButtonDisabled} on:click={() => handleClick(true)} class="right">{">"}</button>
        <img on:load={() => (isLoading = false)} src={quote.img} alt="beautiful quote" />
        {#if !isLoading}
          <section aria-label="text">
            <div>
              {`${new Date(quote.date).toDateString().split(" ").slice(1, 3).join(" ")}`}
            </div>
            <div>
              <sapn>{quote.zh}</sapn>
              <sapn>{quote.en}</sapn>
            </div>
          </section>
        {/if}
      </section>
    {/if}
  {:catch error}
    <h1>Error occurred!</h1>
  {/await}
</main>

<style lang="css">
  /* main */
  main {
    @apply flex flex-col items-center justify-center relative;
  }

  /* arrow */
  .left {
    @apply left-0;
  }

  .right {
    @apply right-0;
  }

  button {
    @apply sm:opacity-0 duration-300 text-3xl w-fit p-2 absolute top-1/2 -translate-y-1/2 text-white bg-black/[0.5];
  }

  button:disabled {
    @apply cursor-not-allowed;
  }

  section[aria-label="image"]:hover button {
    @apply sm:opacity-100;
  }

  /* error */
  main > h1 {
    @apply text-2xl font-semibold text-white bg-black/[0.5] p-5 rounded-md;
  }

  /* loading */
  .loading {
    translate: -50% -50%;
    @apply animate-custom-spin border-4 border-white w-20 h-20 absolute top-1/2 left-1/2;
  }

  .loading::before {
    content: "";
    @apply absolute animate-custom-stretch top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-white w-16 h-16;
  }

  /* image */
  section[aria-label="image"] {
    box-shadow: 0 0 25px #00bccaa9;
    @apply rounded-md relative overflow-y-hidden;
  }

  section[aria-label="image"] > img {
    @apply rounded-md max-h-[75vh] aspect-9/12 object-cover object-center;
  }

  /* text */
  section[aria-label="text"] {
    background-color: rgb(0, 0, 0, 0.5);
    @apply -translate-y-[100%];
    @apply flex flex-col gap-2 sm:gap-5 absolute w-full p-4 sm:p-5 text-white rounded-b-md;
  }

  section[aria-label="text"] > div:first-of-type {
    @apply text-3xl font-bold flex flex-col gap-1 text-white;
  }

  section[aria-label="text"] > div:first-of-type::after {
    content: "";
    @apply h-1 w-32 origin-left duration-300 delay-200 bg-green-600;
  }

  section[aria-label="text"] > div:last-of-type {
    @apply flex flex-col sm:gap-1;
  }
</style>
