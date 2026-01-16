import React from 'react';
import styles from './index.module.css';
import Link from 'next/link';


const Footer = ({}) => {
    return (
        <footer className={styles.footer}> 
                <div className={styles.desc}>
                    <img src="/assets/brand/cardic-logo-3.png" height={40} />
                    <p className={styles.descText}>
                        Connecting companies in need of discounted
                        gift cards as a payment option and people in
                        need of cash on hand. Cardic is accessible to
                        iPhone, Android, and Web users.
                    </p>
                    <p><img src='/assets/svg/message.svg'
                        style={{
                            height: 10
                        }}
                    /> <Link href="mailto:help@cardicapp.com">help@cardicapp.com</Link>
                    </p>
                </div>
                <div className={styles.linksSection}>
                    <div className={styles.linksContainer}>
                        <h6 className={styles.footerLinkHeader}>Resources</h6>
                        <Link href={"/contact"}>Contact</Link>
                        <Link href={"/terms"}>Terms of use</Link>
                        <Link href={"/privacypolicy"}>Privacy policy</Link>
                    </div>
                    {/* <div className={styles.linksContainer}>
                        <h6 className={styles.footerLinkHeader}>Gift card</h6>
                    </div> */}
                </div>
            </footer>
    )
}

export default Footer;