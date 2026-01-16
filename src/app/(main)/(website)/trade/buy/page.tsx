'use client';
import styles from '../index.module.css';
import styles2 from './index.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faAndroid, faApple, faAppStore, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import FAQItem from '@/components/FAQItem/FAQItem';
import Footer from '@/components/Footer';
import LandingPageHeader from '@/components/LandingPageHeader';

export default function LandingPage() {
    return (
        <div className={`${styles.mainContainer}`}>
            <title>Cardic</title>
            <LandingPageHeader />
            <div className={styles.productDescContainer}>
                <div className={styles.productText}>
                    <h2>Buy Gift Cards with</h2>
                    <h2>Nigerian Naira</h2>
                    {/* <h2><span className={styles.tradingText}>Nigerian</span> Gift cards</h2> */}
                    <div className={styles.secondText}>Trade different Gift card types, you can buy with Naira.</div>
                    {/* <div>buy and sell your gift cards quick and easy</div> */}
                    <button 
                    onClick={() => {
                        const el = document.getElementById("storeDownloadContainer");
                        window.scrollTo({
                            top: el?.offsetTop,
                            behavior: 'smooth'
                        })
                    }}
                    className={`btn ${styles2.btn1}`}>Get Started</button>

                </div>
                <div className={styles.productImage}></div>
            </div>
            <div className={styles.productImageMobile}></div>
            <div className={styles.howtoContainer}>
                <h2>How to Buy Gift Cards</h2>
                <div className={styles.howToItemContainer}>

                    <HowToItem
                        number='1'
                        title='Download App'
                        desc='Download the cardic application from app store'
                    />
                    <HowToItem
                        number='2'
                        title='Create Account'
                        desc='Create cardic account in less than a minute'
                    />
                    <HowToItem
                        number='3'
                        title='Select Gift Card'
                        desc='Select the brand of Gift card you want to buy.'
                    />
                    {/* <HowToItem
                        number='4'
                        title='Choose Naira'
                        desc='Select Naira as your preferred payment method.'
                    /> */}
                    <HowToItem
                        number='4'
                        title='Get paid'
                        desc='Wait for confirmation and get paid'
                    />
                </div>

                <div className={styles.signUpBtn}>
                    Sign up now  <FontAwesomeIcon fixedWidth icon={faArrowRight} />
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

            <div className={styles.downloadAppContainer}>
                <div className={styles.appHomepageImageContainer}>
                    <img className={styles.appHomepageImage} src='/assets/img/app-homepage-screen.png' />
                </div>

                <div className={styles.storeDownloadContainer} id="storeDownloadContainer">
                    <h2>Download The App</h2>
                    <div className={styles.secondText}>Experience the best of Cardic on your devices Available for iOS and Android operating systems.</div>
                    <div className={styles.storeBtnContainer}>
                    <div
                            onClick={() => {
                                window.open("https://cardicapp.com/app/cardic.apk", "_blank")?.focus();
                            }}
                            className={styles.playStoreBtn}>
                            <FontAwesomeIcon fixedWidth icon={faAndroid} style={{ marginRight: 5 }} /> Android
                        </div>
                        <div
                            onClick={() => {
                                window.open('https://apps.apple.com/us/app/cardic/id6737470997', "_blank")?.focus();
                            }}
                            className={styles.appStoreBtn}>
                            <FontAwesomeIcon fixedWidth icon={faApple} /> App Store
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* <div className={styles.artCardContainer}>
                <ArtCard
                    text1='Buy and sell'
                    text2='Gift cards'
                    text3='Convert your gift cards to cash at amazing gift card rates.'
                    logo='/assets/brand/credit-card.png'
                />
                <ArtCard
                    text1='Get paid in'
                    text2='Naira'
                    text3='Trade your Gift cards easily and get paid in Naira'
                    surfaceColor='rgba(81, 78, 78, 1)'
                    bottomColor='rgba(81, 78, 78, 0.5)'
                    logo='/assets/brand/naira-bag.png'
                />

            </div> */}
            {/* <div className={styles.section2}>
                <IconInfo
                    logo={<img src='/assets/brand/time-cardic.svg' />}
                    text1='Instant Deals'
                    text2='Complete transactions quickly on Cardic'
                />
                <IconInfo
                    logo={<img src='/assets/brand/rate-cardic.svg' />}
                    text1='Best Rates'
                    text2='Exchange and buy Gift cards at the best rates'
                />
                <IconInfo
                    logo={<img src='/assets/brand/cross-platform-cardic.svg' />}
                    text1='Cross Platforms'
                    text2='Cardic is available on Android, IOS & Web'
                />
                <IconInfo
                    logo={<img src='/assets/brand/support-cardic.svg' />}
                    text1='24 Hours Support'
                    text2='We are available to help you at anytime'
                />
            </div> */}
            {/* <div className={styles.section3}>
                <div className={styles.promoImageContainer}>
                    <img src='/assets/img/download-image.png' className={styles.promoImage} />
                </div>
                <div className={styles.downloadBtnContainer}>
                    <img src='/assets/img/download-button.png' className={styles.downloadImage} />
                </div>
            </div> */}
            <Footer />
        </div>
    );
}

interface HowToItemProps {
    number: string;
    title: string;
    desc: string;
}

const HowToItem = (props: HowToItemProps) => {
    const { number, title, desc } = props;
    return (
        <div className={styles.howToItemContainer}>
            <div className={styles.howToItem}>
                <div className={styles.howToNumber}>
                    <div>{number}</div>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        </div>
    )
}

interface ArtCardProps {
    surfaceColor?: string;
    bottomColor?: string;
    text1?: string;
    text2: string;
    text3: string;
    logo?: string;
}
const ArtCard = ({ surfaceColor, bottomColor, text1, text2, text3, logo }: ArtCardProps) => {
    return (
        <div className={styles.artCard}
            style={{
                backgroundColor: bottomColor
            }}>
            <div className={styles.surface}
                style={{
                    backgroundColor: surfaceColor
                }}>

                <div className={styles.surface1}>
                    <div className={styles.text}>
                        <h3>{text1}</h3>
                        <h3>{text2}</h3>
                    </div>
                    <div className={styles.logoContainer}>
                        <div className={styles.logo}>
                            <img className={styles.logoImg} src={logo} />
                        </div>
                    </div>
                </div>
                <div className={styles.surface2}>
                    {text3}
                </div>

            </div>
        </div>
    );
}


interface IconInfoProps {
    text1?: string;
    text2: string;
    logo?: any;
}
const IconInfo = ({ text1, text2, logo }: IconInfoProps) => {
    return (
        <div className={styles.iconInfoContainer}
            style={{
                // backgroundColor: bottomColor
            }}>
            <div className={styles.img}>{logo}</div>
            <h3>{text1}</h3>
            <div className={styles.thinText}>{text2}</div>
        </div>
    );
}
