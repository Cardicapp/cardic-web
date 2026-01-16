'use client';
import { useState } from 'react';
import styles from './contact.module.css';
import FAQItem from '@/components/FAQItem/FAQItem';
import Footer from '@/components/Footer';
import LandingPageHeader from '@/components/LandingPageHeader';
import Colors from '@/theme/Colors';

type Props = {
}

export default function ContactUs(props: Props) {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div className={styles.mainContainer}>
            <title>Contact Us - Cardic</title>
            <LandingPageHeader />
            <div className={styles.content}>
                <div className={styles.leftContainer}>
                    <h1 className={`${styles.currentRatesHeader}`}><span style={{ color: Colors.Green }}>Contact Us</span></h1>
                    <p className={`${styles.currentRatesDesc}`}
                        style={{
                            fontSize: '1.3em'
                        }}>You can reach out to us by sending us a message at <a href='mailto:help@cardicapp.com'>help@cardicapp.com</a> or by submitting the following form</p>

                </div>
                <div className={styles.rightContainer}>
                    <div
                        style={{
                            height: 66,
                            backgroundColor: Colors.Green,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <div style={{
                            color: Colors.White,
                            fontSize: '1em',
                            // fontWeight: '100',
                            fontFamily: 'ClashDisplay-Medium'
                        }}>Send us a message</div>
                    </div>

                    <div
                        style={{
                            backgroundColor: Colors.White,
                            flex: 1,
                            padding: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <div
                            style={{
                                alignSelf: 'start',
                                paddingLeft: 30
                            }}>Subject</div>

                        <div className={styles.textContainer}
                            style={{
                                backgroundColor: Colors.InputBg,
                                borderColor: Colors.InputBorderGrey,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderRadius: 10,
                                marginTop: 10,
                            }}
                        >
                            <input
                                value={subject}
                                placeholder='Subject'
                                onChange={(e) => setSubject(e.target.value)}
                                style={{
                                    borderStyle: 'none',
                                    backgroundColor: Colors.InputBg,
                                    width: '100%',

                                }} />

                        </div>
                        <div
                            style={{
                                alignSelf: 'start',
                                paddingLeft: 30,
                                marginTop: 10,
                            }}>Message</div>

                        <div className={styles.textContainer}
                            style={{
                                backgroundColor: Colors.InputBg,
                                borderColor: Colors.InputBorderGrey,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderRadius: 10,
                                marginTop: 10,
                            }}
                        >
                            <textarea
                                value={message}
                                placeholder='Message'
                                onChange={(e) => setMessage(e.target.value)}
                                cols={40}
                                rows={7}
                                style={{
                                    borderStyle: 'none',
                                    backgroundColor: Colors.InputBg,
                                    width: '100%',
                                }} />

                        </div>



                        <a
                           href={`mailto:help@cardicapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
                            className={styles.startTradeBtn}
                            style={{
                                height: 50,
                                backgroundColor: Colors.Green,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 'auto',
                                width: '90%',
                                borderRadius: 10,
                            }}>
                            <div style={{
                                color: Colors.White,
                                fontSize: '1em',
                                fontWeight: '100',
                                fontFamily: 'ClashDisplay-Medium'
                            }}>Submit</div>
                        </a>
                    </div>

                </div>
            </div>
            <div className={styles.questionsContainer}>
                <div className={styles.questionsTextbox}>
                    <h2>
                        Frequently asked Questions
                    </h2>
                </div>

                <FAQItem
                    question="What currencies does Cardic support?"
                    answer="Naira"
                />
                <FAQItem
                    question="Are there any fees associated with using Cardic?"
                    answer="There are no fees associated with using the Cardic app"
                />
                <FAQItem
                    question="How do i start a trade on my Cardic account?"
                    answer={`Simply login to your Cardic account and click on "Start Trade" then select your preferred gift card option`}
                />

                <FAQItem
                    question="How do i withdraw funds from my Cardic account?"
                    answer={`Simply login to your Cardic account then go to the wallet section and click on "Withdraw" then select your bank account details    `}
                />

                <FAQItem 
                    question='How long does an average transaction take?'
                    answer='The average transaction time on Cardic takes about 15 minutes.'
                />
                 <FAQItem 
                    question='How do I contact support?'
                    answer="You can contact our support using the contact us option to send us a mail. We're available 24/7 and replies are very quick."
                />
                 <FAQItem 
                    question='When can I trade on Cardic?'
                    answer='We operate 24hour work time so you can use our app anytime you want for both trades and withdrawals.'
                />
                <FAQItem 
                    question='How long should i wait before receiving a credit alert after withdrawal?'
                    answer='Withdrawal takes about 30 minutes after request'
                />
                <div className={styles.moreQuestions}>
                    <h3>Still have more questions?</h3>
                    <p>Can’t find the answer you’re looking for? Please send a message to our friendly team <span><a href="mailto:help@cardicapp.com">help@cardicapp.com</a></span></p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

