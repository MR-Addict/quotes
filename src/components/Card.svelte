<script lang="ts">
  interface QuoteType {
    month: string;
    day: string;
    zh: string;
    en: string;
    pic: string;
  }

  let isLoading = true;
  let quote: QuoteType | null;
  fetch("https://api.vvhan.com/api/en")
    .then((res) => res.json())
    .then((result) => {
      if (result.success) quote = result.data;
      else quote = null;
    })
    .catch((error) => console.error(error));
</script>

<main class="card">
  {#if isLoading}
    <section class="loading" />
  {/if}
  {#if quote}
    <section aria-label="image">
      <img on:load={() => (isLoading = false)} src={quote.pic} alt="beautiful image" />
      {#if !isLoading}
        <section aria-label="text">
          <div>
            {`${quote.month} ${quote.day}`}
          </div>
          <div>
            <sapn>{quote.zh}</sapn>
            <sapn>{quote.en}</sapn>
          </div>
        </section>
      {/if}
    </section>
  {/if}
</main>

<style lang="css">
  /* main */
  main {
    @apply flex flex-col items-center justify-center cursor-pointer relative;
  }

  /* loading */
  .loading {
    translate: -50%;
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
    @apply rounded-md max-h-[70vh] aspect-9/12 object-cover object-center;
  }

  /* text */
  section[aria-label="text"] {
    background-color: rgb(0, 0, 0, 0.5);
    @apply -translate-y-[100%] md:-translate-y-20 duration-500;
    @apply flex flex-col gap-5 absolute w-full p-4 md:p-5 text-white rounded-b-md;
  }

  section[aria-label="text"] > div:first-of-type {
    @apply text-3xl font-bold flex flex-col gap-1 text-white;
  }

  section[aria-label="text"] > div:first-of-type::after {
    content: "";
    @apply h-1 w-32 md:w-5 origin-left duration-300 delay-200 bg-green-600;
  }

  section[aria-label="text"] > div:last-of-type {
    @apply md:text-lg;
  }

  /* hover effect */
  section[aria-label="image"]:hover section[aria-label="text"] {
    @apply md:-translate-y-[100%];
  }

  section[aria-label="image"]:hover section[aria-label="text"] > div:first-of-type::after {
    @apply md:scale-x-[6];
  }
</style>
