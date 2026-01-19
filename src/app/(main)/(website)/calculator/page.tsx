'use client';
import React, { use, useEffect, useState } from 'react';
import styles from './calculator.module.css';
import { GetServerSideProps } from 'next';
import { Category } from '@/models/category';
import { SubCategory } from '@/models/sub-category';
import routes from '@/lib/network/routes';
import Footer from '@/components/Footer';
import LandingPageHeader from '@/components/LandingPageHeader';
import axiosExtended from '@/lib/network/axios-extended';
import { calculateRate, currencyFormat } from '@/lib/utils';
import Colors from '@/theme/Colors';
import { ListAPIResponse } from '@/types';
import { StatusEnum } from '@/types/enums';

type Props = {}

export default function Page(props: Props) {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<Category>();
    const [subCategory, setSubCategory] = useState<SubCategory>();
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [cats, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        const categoryListURL = `${process.env.NEXT_PUBLIC_API_URL}${routes.categories}` || ''
        let page = 1;
        let perPage = 2000000;

        let sort = 'id';
        let order = 'asc';
        try {
            setLoading(true);
            const { data: cats, headers } = await axiosExtended.get<ListAPIResponse<Category>>(categoryListURL, {
                params: {
                    page,
                    limit: perPage,
                    sort,
                    order,
                    status: StatusEnum.active, // Only fetch active categories
                },
            });
            setLoading(false);
            setCategories(cats.data)
        } catch (e) {
            setLoading(false);
            console.log(e);
        }

    }
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchSubCategories = async (categoryId: number) => {
        setLoading(true);
        setSubCategories([]);
        const subCategoryListURL = `${process.env.NEXT_PUBLIC_API_URL}${routes.allSubCategories}` || ''
        let page = 1;
        let perPage = 2000000;
        let sort = 'id';
        let order = 'asc';
        let id = categoryId;
        try {
            const { data: subCats, headers } = await axiosExtended.get<ListAPIResponse<SubCategory>>(`${subCategoryListURL}/${id}`, {
                params: {
                    page,
                    limit: perPage,
                    sort,
                    order,
                    status: StatusEnum.active, // Only fetch active categories
                },
            });
            setLoading(false);
            setSubCategories(subCats.data)
        } catch (e) {
            setLoading(false);
            console.log(e);
        }

    }
    const calculatedAmount = calculateRate(subCategory?.nairaRate ?? 0, parseInt(amount ?? 0))
    const isValidForm = amount && parseInt(amount) >= (subCategory?.minAmount ?? 0) && parseInt(amount) <= (subCategory?.maxAmount ?? 0)

    return (
        <div className={styles.mainContainer}>
            <title>Rate Calculator - Cardic</title>
            <LandingPageHeader />
            <div className={styles.content}>
                <div className={styles.leftContainer}>
                    <h2 className={`${styles.currentRatesHeader}`}>Current Rates of <span style={{ color: Colors.Green }}>Gift Cards</span> - In Naira</h2>
                    <p className={`${styles.currentRatesDesc}`}
                        style={{
                            fontSize: '1.3em'
                        }}>You can quickly find the rate of any gift card
                        with our automated gift card rate calculator.
                        Rates are updated often,
                        often several times a day, because to the
                        volatility of market value.</p>

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
                        }}>Trade</div>
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
                        <select
                            value={category ? category.id : undefined}
                            onChange={(e) => {
                                // @ts-ignore
                                const cat = cats.find(c => c.id == e.target.value);
                                setCategory(cat);
                                fetchSubCategories(cat?.id ?? 0);

                            }}
                            className={styles.selectElement}
                            style={{
                                backgroundColor: Colors.InputBg,
                                borderColor: Colors.InputBorderGrey,
                                borderRadius: 10,
                                marginTop: 10,
                            }}>
                            <option>Select Gift Card</option>
                            {
                                cats.map(c => (
                                    <option value={c.id}>{c.name}</option>
                                ))
                            }
                        </select>

                        <select
                            value={subCategory ? subCategory.id : undefined}
                            onChange={(e) => {
                                // @ts-ignore
                                const subCat = subCategories.find(c => c.id == e.target.value);
                                setSubCategory(subCat);
                            }}
                            className={styles.selectElement}
                            style={{
                                backgroundColor: Colors.InputBg,
                                borderColor: Colors.InputBorderGrey,
                                borderRadius: 10,
                                marginTop: 10,
                            }}>
                            <option>{loading ? "Loading..." : "Select Rate"}</option>
                            {
                                subCategories.map(c => (
                                    <option value={c.id}>{c.name} ${c.minAmount ?? 0} - ${c.maxAmount ?? 0}</option>
                                ))
                            }
                        </select>

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
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    borderStyle: 'none',
                                    backgroundColor: Colors.InputBg,
                                    width: '55%',

                                }} />
                            <div className={styles.amountText} style={{
                                color: Colors.PlaceHolder
                            }}>Amount ${subCategory?.minAmount ?? 0} - ${subCategory?.maxAmount ?? 0}</div>
                        </div>


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
                            <div>{isValidForm ? currencyFormat(calculatedAmount, 0) : 0}</div>
                            <div style={{
                                color: Colors.PlaceHolder
                            }}>Calculated amount</div>
                        </div>
                        {
                            parseInt(amount ?? "0") > 0 && !isValidForm ? (
                                <div style={{
                                    color: Colors.Red,
                                    padding: '10px 20px',
                                }}>Please ensure the card amount is within range of ${subCategory?.minAmount ?? 0} - ${subCategory?.maxAmount ?? 0}</div>
                            ) : undefined
                        }


                        <div
                            // onClick={(e) => {
                            //     alert("Download our mobile app from Apple App store or Google Play store")
                            // }}
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
                            }}>Start Trade</div>
                        </div>
                    </div>

                </div>
            </div>
            {/* <div className={styles.downloadAppContainer}>
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
                            <FontAwesomeIcon fixedWidth icon={faAndroid} style={{marginRight: 5}} /> Download
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
            </div> */}
            <Footer />
        </div>
    );
}


// export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
//     const categoryListURL = `${process.env.NEXT_PUBLIC_API_URL}${routes.categories}` || ''
//     let page = 1;
//     let perPage = 2000000;

//     let sort = 'id';
//     let order = 'asc';
//     const { data: categories, headers } = await axiosExtended.get<ListAPIResponse<Category>>(categoryListURL, {
//         params: {
//             page,
//             limit: perPage,
//             sort,
//             order,
//             status: StatusEnum.active, // Only fetch active categories
//         },
//     })

//     return {
//         props: {
//             categories: categories.data
//         }, // will be passed to the page component as props
//     }
// }