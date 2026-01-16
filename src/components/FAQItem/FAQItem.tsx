'use client';
import React, { useState } from "react";
import styles from './index.module.css';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = (props: FAQItemProps) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            onClick={() => {
                setOpen(!open);
            }}
            className={`${styles.question} ${open ? styles.open : ''}`}>
            <div className={styles.top}>
                <div>{props.question}</div>
                <img
                    src="/assets/svg/arrow-down.svg" className={`${styles.arrowDown} ${open ? styles.rotate : ''}`} alt="arrow-down" />
            </div>

            {
                open && (
                    <div className={styles.answerContainer}>
                        <p>{props.answer}</p>
                    </div>
                )
            }
        </div>
    )
}

export default FAQItem;