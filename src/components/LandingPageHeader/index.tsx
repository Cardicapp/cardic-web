'use client';
import React from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import Dropdown from 'react-bootstrap/Dropdown';
// import {
//   Dropdown,
//   DropdownContent,
//   DropdownTrigger,
// } from "@/components/ui/dropdown";
export default function LandingPageHeader() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <header className={styles.header}>

            <div className={styles.header1}>
                <a href="/"><img className={styles.cardicImage} src="/assets/brand/cardic-logo-2.png" /></a>
                <div className={styles.header1header}>
                    {/* <Link className={styles.headerLink} href={"/"}>Home</Link> */}
                    <Link className={styles.headerLink} href={"/calculator"}>Rates</Link>
                    <Dropdown style={{
                        display: 'inline'
                    }}>
                        <Dropdown.Toggle className={`${styles.headerLink} ${styles.tradeHeaderDropdown}`} variant="" id="dropdown-basic">
                            Trade
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Dropdown.Item href="/trade/buy">Buy</Dropdown.Item>
                            <Dropdown.Item href="/trade/sell">Sell</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* <Link className={styles.headerLink} href={"/calculator"}>Gift Cards</Link> */}
                    {/* <Dropdown style={{
                        display: 'inline'
                    }}>
                        <Dropdown.Toggle className={styles.headerLink} variant="" id="dropdown-basic">
                            Gift Cards
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}
                    
                    <Link className={styles.headerLink} href={"/contact"}>Contact us</Link>

                </div>
            </div>
            <div className={styles.header2}>
                {/* <button className={`btn ${styles.btn1}`}>Log In</button> */}
                {/* <button className={`btn ${styles.btn2}`}>Sign Up</button> */}
                <button
                    onClick={() => {
                        const el = document.getElementById("storeDownloadContainer");
                        if (el) {
                            window.scrollTo({
                                top: el?.offsetTop,
                                behavior: 'smooth'
                            })
                        } else {
                            location.assign("/?scroll=download")
                        }

                    }}
                    className={`btn ${styles.btn2}`}>Get Started</button>
            </div>
        </header>
    );
}