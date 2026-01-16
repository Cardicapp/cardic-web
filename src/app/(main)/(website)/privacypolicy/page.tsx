'use client';
import styles from './privacypolicy.module.css';
import Footer from '@/components/Footer';
import LandingPageHeader from '@/components/LandingPageHeader';

export default function PrivacyPolicy() {
    return (
        <div className={styles.mainContainer}>
            <title>Privacy Policy - Cardic</title>
            <LandingPageHeader />
            <div className={styles.content}>
                <h5>Privacy Policy</h5>
                <p>This Privacy Policy applies to all of the products, services and websites offered by
                    CARDIC GLOBAL RESOURCES or its subsidiaries or affiliated companies. In
                    addition, where more detailed information is needed to explain our privacy practices,
                    we post supplementary privacy notices to describe how particular services process
                    personal information. Information we collect and how we use them We understand
                    that in the course of delivering our numerous products/ services to you via the net,
                    we will come across certain information pertaining to your good self which, to our
                    mind, are purely personal and may even be classified information but for the existing
                    relationship which dictates that you shall either fill them in and/or divulge same in
                    order to be linked to our site. CARDIC GLOBAL RESOURCES will handle the
                    information in this manner:</p>
                <h5>INFORMATION YOU PROVIDE</h5>
                <p>
                    When you sign up for any CARDIC GLOBAL RESOURCES Service or promotion
                    that requires registration, we ask you for personal information (such as your name,
                    email address and an account password). For certain services, such as our payment
                    services, we require your debit or credit card information. We typically do not store
                    this information and when we do, we maintain the data in encrypted form on secure
                    servers. We may combine the information you submit under your account with
                    information from other third parties in order to provide you with a better experience
                    and to improve the quality of our services. For certain services, we may give you the
                    opportunity to opt out of combining such information.
                </p>
                <h5>
                    User communications
                </h5>
                <p>
                    When you send email or other communications to CARDIC GLOBAL RESOURCES,
                    we may retain those communications in order to process your inquiries, respond to
                    your requests and improve our services.
                </p>
                <h5>
                    Affiliated sites
                </h5>
                <p>
                    We offer some of our services in connection with other web sites e.g. Websites of
                    our subsidiaries. Personal information that you provide to those sites may be sent to
                    CARDIC GLOBAL RESOURCES in order to deliver the service. We process such
                    information in accordance with this Privacy Policy. The affiliated sites may have
                    different privacy practices and we encourage you to read their privacy policies.
                </p>
                <h5>
                    Other sites
                </h5>
                <p>
                    This Privacy Policy applies to CARDIC GLOBAL RESOURCES only. We do not
                    exercise control over the sites displayed or linked from within our various services.
                    These other sites may place their own cookies or other files on your computer,
                    collect data or solicit personal information from you. CARDIC GLOBAL
                    RESOURCES processes personal information for the purposes described in this
                    Privacy Policy and/or the supplementary privacy notices for specific services. In
                    addition to the above, such purposes include: Providing our services to users,
                    including the display of customized content; Auditing, research and analysis in order
                    to maintain, protect and improve our services; Ensuring the technical functioning of
                    our network; and developing new services.
                </p>
                <h5>
                    Data Policy
                </h5>
                <h5>
                    CARDIC GLOBAL RESOURCES
                </h5>
                <p>
                    Data Protection Policy refers to our commitment to
                    treat information of employees, customers, stakeholders and other interested parties
                    with the utmost care and confidentiality. With this policy, we ensure that we gather,
                    store and handle data fairly, transparently and with respect towards individual rights.
                </p>
                <h5>
                    SCOPE
                </h5>
                <p>
                    This policy refers to all parties (employees, customers, suppliers, Merchants etc.)
                    who provide any amount of information to us. Who is covered under the Data
                    Protection Policy? Employees of our company and its subsidiaries must follow this
                    policy. Contractors, consultants, partners and any other external entity are also
                    covered. Generally, our policy refers to anyone we collaborate with or acts on our
                    behalf and may need occasional access to data.
                </p>
                <h5>
                    POLICY ELEMENTS
                </h5>
                <p>
                    As part of our operations, we need to obtain and process information. This
                    information includes any offline or online data that makes a person identifiable such
                    as names, addresses, usernames and passwords, digital footprints, photographs,
                    social security numbers, financial data etc. Our company collects this information in
                    a transparent way and only with the full cooperation and knowledge of interested
                    parties. Once this information is available to us, the following rules apply.
                </p>
                <p>
                    Our data will be:
                </p>
                <ul>
                    <li>Accurate and kept up-to-date</li>
                    <li>Collected fairly and for lawful purposes only</li>
                    <li>Processed by the company within its legal and moral boundaries</li>
                    <li>Protected against any unauthorized or illegal access by internal or external parties</li>
                </ul>
                <p>
                    Our data will not be:
                </p>
                <ul>
                    <li>Communicated informally</li>
                    <li>Stored for more than a specified amount of time</li>
                    <li>Transferred to organizations, states or countries that do not have adequate data protection policies</li>
                    <li>Distributed to any party other than the ones agreed upon by the data’s owner (exempting legitimate requests from law enforcement authorities)</li>
                    <li>In addition to ways of handling the data the company has direct obligations towards people to whom the data belongs.</li>
                </ul>
                <p>
                Specifically, we must:
                </p>
                <ul>
                    <li>Let people know which of their data is collected</li>
                    <li>Inform people about how we’ll process their data</li>
                    <li>Inform people about who has access to their information</li>
                    <li>Have provisions in cases of lost, corrupted or compromised data</li>
                    <li>Allow people to request that we modify, erase, reduce or correct data contained in our databases</li>
                </ul>
                <p>Action:</p>
                <p>To exercise data protection, we’re committed to:</p>
                <ul>
                    <li>Restrict and monitor access to sensitive data</li>
                    <li>Develop transparent data collection procedures</li>
                    <li>Train employees in online privacy and security measures</li>
                    <li>Build secure networks to protect online data from cyberattacks</li>
                    <li>Establish clear procedures for reporting privacy breaches or data misuse</li>
                    <li>Include contract clauses or communicate statements on how we handle data</li>
                    <li>Establish data protection practices (document shredding, secure locks, data encryption, frequent backups, access authorization etc.)</li>
                </ul>
            </div>
            <Footer />
        </div>
    );
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
