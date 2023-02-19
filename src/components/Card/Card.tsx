import type { SayingType } from "@/types";
import { useEffect, useState } from "react";

import style from "./Card.module.css";

export default function Card() {
  const [saying, setSaying] = useState<SayingType>();

  useEffect(() => {
    async function fetchSaying() {
      const res = await fetch("https://api.vvhan.com/api/en");
      const result = await res.json();
      setSaying(result.data);
    }
    fetchSaying();
  }, []);

  return (
    <main className={style.card}>
      {saying && (
        <section aria-label='image' className='group'>
          <img src={saying.pic} alt='beautiful caption' />
          <section aria-label='text' className='md:translate-y-20 md:group-hover:translate-y-0 duration-500'>
            <span>
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
