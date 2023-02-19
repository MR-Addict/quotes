import type { SayingType } from "@/types";
import { useEffect, useState } from "react";

import style from "./Card.module.css";

export default function Card() {
  const [isLoading, setIsLoading] = useState(true);
  const [saying, setSaying] = useState<SayingType>();

  useEffect(() => {
    async function fetchSaying() {
      await fetch("https://api.vvhan.com/api/en")
        .then((res) => res.json())
        .then((result) => result.success === true && setSaying(result.data))
        .catch((error) => console.error(error));
    }
    fetchSaying();
  }, []);

  return (
    <main className={style.card}>
      {isLoading && <div className={style.loading}></div>}
      {saying && (
        <section aria-label='image' className='group'>
          <img onLoad={() => setIsLoading(false)} src={saying.pic} alt='beautiful image' />
          <section aria-label='text' className='md:translate-y-20 md:group-hover:translate-y-0 duration-500'>
            <span className='after:w-32 md:after:w-5 after:origin-left md:group-hover:after:scale-x-[6] after:duration-300 after:delay-200'>
              <p>
                {saying.month} {saying.day}
              </p>
            </span>
            <span>
              <p>{saying.zh}</p>
              <p>{saying.en}</p>
            </span>
          </section>
        </section>
      )}
    </main>
  );
}
