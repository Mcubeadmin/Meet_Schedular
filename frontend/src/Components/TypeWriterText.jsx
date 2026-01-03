import { useEffect, useState } from "react";

export default function TypewriterText({ texts, speed = 90, pause = 1500 }) {
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
    const current = texts[textIndex];
    let timeout;

    // 1️⃣ Finished typing → pause, then delete
    if (!isDeleting && charIndex === current.length) {
        timeout = setTimeout(() => {
        setIsDeleting(true);
        }, pause);

        return () => clearTimeout(timeout);
    }

    // 2️⃣ Finished deleting → move to next text
    if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
        return;
    }

    // 3️⃣ Typing
    if (!isDeleting) {
        timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        }, speed);
    }

    // 4️⃣ Deleting
    else {
        timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        }, speed / 2);
    }

    return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, textIndex, texts, speed, pause]);


    return <span>{displayText}</span>;
}
