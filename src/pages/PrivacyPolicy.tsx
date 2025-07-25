import { Container, Title, Text, Stack, Paper, Anchor, List } from '@mantine/core';

const PrivacyPolicy = () => {

  return (
    <Container size="md" py="xl">
      <Paper shadow="sm" p="xl" radius="md">
        <Stack gap="md">
          <Title order={1}>Privacy Policy</Title>
          
          <Text>
            The American College of Physicians (ACP) is committed to protecting the privacy of its members and customers. This document describes the information we collect from our websites and digital products such as our mobile applications, how we use them and your rights in connection with such use.
          </Text>

          <Title order={2}>What personal information do we collect?</Title>

          <Title order={3}>Information you provide to us:</Title>

          <Text>
            When you sign up for our services, we ask you for information such as:
          </Text>

          <List>
            <List.Item>Your name and contact information (phone, mailing address, email)</List.Item>
            <List.Item>Date of birth</List.Item>
            <List.Item>Education and professional information such as medical school, residency training information, specialty, type, and size of the practice</List.Item>
            <List.Item>Information you post to online forums or in our customer support web chat console</List.Item>
            <List.Item>Purchasing and payment information (though credit card information is not stored)</List.Item>
            <List.Item>Authentication data (your username and password)</List.Item>
            <List.Item>Author and peer review information</List.Item>
          </List>

          <Text>
            When you use our websites/online services without signing in, you will not be able to access certain restricted content and features. A small amount of information is still collected automatically, though, in order for us to personalize your experience and to learn about the usage of our websites and online services so we can make improvements. This information includes:
          </Text>

          <List>
            <List.Item>Information about the device(s) you use to access our websites, such as operating system, web browser, and mobile device manufacturers</List.Item>
            <List.Item>Location information</List.Item>
            <List.Item>Information about service usage, such as the amount of time you spend on each page</List.Item>
          </List>

          <Text>
            This information is necessary for us to provide you with the Services. If you do not provide this information we would not be able to provide the Services to you.
          </Text>

          <Title order={3}>Information we collect about you:</Title>

          <Text>
            When you use our Services, we use cookies and similar technologies to collect information about your location, your activities on our websites and services, and information about your device. This is described in more detail in the Section "Cookies and Other Technologies" below. The information includes:
          </Text>

          <List>
            <List.Item>Location Information: Information about your estimated location may be deduced by various technologies including IP address.</List.Item>
            <List.Item>Activity data: This includes information, such as the time and date of your request; the internet address of your computer; the browser and operating system you are using; the page which you are viewing; and the previous page that you visited (the referrer)</List.Item>
            <List.Item>Device Information: Information about the device you are using such as hardware model, operating system, application version number and browser, mobile network information, IP addresses, user names, real names, email addresses, and other custom properties.</List.Item>
          </List>

          <Text>
            If you have logged into password-protected areas of our websites, we also record your username.
          </Text>

          <Title order={2}>Cookies and Other Technologies</Title>

          <Text>
            ACP websites send all visitors a cookie (small computer file) that contains a unique serial number. Each time our web server receives a request for a page, it checks to see if the cookie is present, which enables us to determine the traffic patterns of visitors as well as to identify repeat visitor traffic.
          </Text>

          <Title order={3}>Advertising</Title>

          <Text>
            We and our third-party providers use the information collected by cookies and other technologies as described above, to understand how to make our website and services more available and user-friendly to our customers and members as well as to provide you with advertising that may be of interest to you. We use Google AdWords to display an advertisement on the Google search results page, another site in the Google Display Network, or other third-party sites. Other Third-party vendors use cookies to serve ads based on user's past visits to ACP Online, Annals.org, and other ACP sites. Learn how you can opt out of such advertising (<Anchor href="https://www.acponline.org/about-this-site/acp-privacy-policy#optout">https://www.acponline.org/about-this-site/acp-privacy-policy#optout</Anchor>). We do not serve interest-based advertising to users we identify as using our websites from EU internet protocol (IP) addresses. If you are from an EU IP address you will be served with generic advertisements.
          </Text>

          <Title order={3}>Functional Cookies</Title>

          <Text>
            ACP web servers send cookies to facilitate interaction between your web browser and the ACP's web servers. For example, the Internal Medicine Meeting Day Planner uses cookies to keep track of which courses you have added to your schedule. The Shopping Cart uses cookies to keep track of items to be included in your order. Our single sign-on (SSO) system uses cookies to enable the convenience of allowing you to log into one ACP site and then automatically be logged into another ACP site. We or our third-party providers also use cookies and other technologies to display messages and links to previous visitors who haven't completed a task on our site, for example using the contact form to make an inquiry. Learn how to opt out of cookies (<Anchor href="https://www.acponline.org/about-this-site/acp-privacy-policy#optout">https://www.acponline.org/about-this-site/acp-privacy-policy#optout</Anchor>).
          </Text>

          <Title order={3}>Google Analytics</Title>

          <Text>
            Google Analytics may set cookies on your browser or mobile device, or read cookies that are already there. Google Analytics may also receive information about you from apps you have downloaded, that partner with Google. We do not combine the information collected through the use of Google Analytics with personally identifiable information. Google's ability to use and share information collected by Google Analytics about your visits to the Services to another application that partners with Google, is restricted by the Google Analytics Terms of Use and the Google Privacy Policy. Please review those and see <Anchor href="www.google.com/policies/privacy/partners/">www.google.com/policies/privacy/partners/</Anchor> for information about how Google uses the information provided by Google Analytics and how you can control the information provided to Google. To prevent your data from being used by Google Analytics, you can download the Google Analytics opt-out browser add-on for Google Analytics which can be found at <Anchor href="https://tools.google.com/dlpage/gaoptout/">https://tools.google.com/dlpage/gaoptout/</Anchor>.
          </Text>

          <Title order={3}>Inspectlet</Title>

          <Text>
            We have engaged Inspectlet to analyze the activities of visitors to this website, and Inspectlet's authorized use of cookies and other tracking technologies enables it to have access to the Personal Information of visitors to this website. Such access to and use of Personal Information by Inspectlet is governed by Inspectlet's Privacy Policy (see <Anchor href="www.inspectlet.com/legal">www.inspectlet.com/legal</Anchor>).
          </Text>

          <Title order={2}>How We Use Your Information</Title>

          <Text>
            We process your information for the following purposes as necessary to provide the services to you and perform our contract with you:
          </Text>

          <Text>
            <strong>To process transactions.</strong> ACP uses personal information such as name, physical address, telephone number, email address, and company/institution to engage in interactions with you, including contacting you about your order, subscription, meeting participation, or membership. We use financial/credit card and payment information to process your order and may need to share some of this information with delivery services, credit card clearing houses, and other third parties to complete the transaction.
          </Text>

          <Text>
            <strong>To provide support or other services.</strong> ACP may use your personal information to provide you with support or other services that you have ordered or requested. ACP may also use your personal information to respond directly to your requests for information, including registrations for newsletters, meetings or courses, or other specific requests, or pass your contact information to the appropriate ACP distributor or reseller for further follow-up related to your interests.
          </Text>

          <Text>
            <strong>To provide information based on your needs and respond to your requests.</strong> ACP may use your personal information to provide you with notices of new product releases and service developments.
          </Text>

          <Text>
            <strong>To enable you to interact with others on online forums.</strong> Some services available on the websites permit you to participate in interactive discussions, post comments, or other content to our online Member Forums (<Anchor href="www.acponline.org/forums">www.acponline.org/forums</Anchor>) or otherwise engage in networking activities. Some of these services are moderated; all communications may be accessed for technical reasons (for example, for improvements or fixes). ACP does not control the content that users post to these forums. You should carefully consider whether you wish to submit personal information to these forums and tailor any content you submit appropriately and in accordance with the relevant terms of use (<Anchor href="https://www.acponline.org/about-this-site/terms-and-conditions">https://www.acponline.org/about-this-site/terms-and-conditions</Anchor>).
          </Text>

          <Text>
            <strong>To administer products.</strong> ACP may contact you if you purchase products to confirm certain information about your order (for example, notifying you of a shipment). We may also use this information to confirm compliance with licensing and other terms of use and may share it with your company/institution if this is necessary for proper functioning of the product or service.
          </Text>

          <Text>
            We process your information for the following purposes as part of our legitimate interest in the improvement and marketing of our services as well in the security of our services. We apply appropriate safeguard to protect your information as described below in the "Security and e-commerce" (<Anchor href="https://www.acponline.org/about-this-site/acp-privacy-policy#security">https://www.acponline.org/about-this-site/acp-privacy-policy#security</Anchor>) section.
          </Text>

          <Text>
            <strong>To assess usage of ACP products and services.</strong> ACP may track your usage of ACP products and services to determine your level of usage, and those usage statistics may be made available to ACP's content licensors and your company/institution if we are contractually obligated to do so.
          </Text>

          <Text>
            <strong>To communicate with you about a meeting, conference, or event.</strong> We may communicate with you about a meeting, conference, or event hosted by ACP or one of our local chapters. This may include information about the event's content, event logistics, payment, updates, and additional information related to the event. ACP may contact you after the event about the event, subsequent iterations of the event and related events. Please note that ACP conference, meeting or event organizers, exhibitors, and other third parties may directly request your personal information at their conference booths or presentations. Providing your information to them is optional, and you should review their privacy policies to address your particular needs and concerns about how they will treat your personal information. Learn how to opt out of these communications (<Anchor href="https://www.acponline.org/about-this-site/acp-privacy-policy#optout">https://www.acponline.org/about-this-site/acp-privacy-policy#optout</Anchor>).
          </Text>

          <Text>
            <strong>To consider you for a higher member class or an ACP award.</strong> ACP may use personal information such as your name, education, work history, and volunteer activities to consider you for a higher member class or for an ACP award. ACP may need to share this information with your nominators, references, judges, and others parties involved in evaluating your eligibility. You may opt out of such sharing by contacting us at <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor>. Please note that this will prevent you from being evaluated, being classified in a higher class or receiving an award.
          </Text>

          <Text>
            <strong>To assist in your participation in ACP activities.</strong> ACP will communicate with you, if you are participating in certain ACP activities such as ACP conferences, or authoring or reviewing ACP content. ACP may send you information such as newsletters related to those activities. Learn how to opt out of these communications (<Anchor href="https://www.acponline.org/about-this-site/acp-privacy-policy#optout">https://www.acponline.org/about-this-site/acp-privacy-policy#optout</Anchor>).
          </Text>

          <Text>
            <strong>To update you on relevant ACP benefits, programs, and opportunities.</strong> ACP may communicate with you regarding relevant ACP benefits, programs, and opportunities available to you, through your membership(s) with ACP. Learn how to opt out of these communications.
          </Text>

          <Text>
            <strong>To include you in the ACP Member Directory</strong> (<Anchor href="https://www.acponline.org/membership/the-acp-member-directory-member-connection">https://www.acponline.org/membership/the-acp-member-directory-member-connection</Anchor>). If you are an active member of ACP, we will include your information in the ACP Member Directory. The information in this database is drawn from membership applications, dues payment forms, product orders and other transactions between ACP and its members. If you choose not to have your information shared in the Member Directory, we will remove your data from the directory. To request exclusion from the Member Directory, please submit your request via <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor>.
          </Text>

          <Title order={2}>How We Share Your Information</Title>

          <Text>
            We share your information with our service providers, in connection with a business transaction, to comply with the law and to protect our legal rights. The legal basis for this is our legitimate interest in providing our services, complying with the law and protecting our rights and those of others. We apply appropriate safeguards for this sharing of your information as described below.
          </Text>

          <Text>
            <strong>To engage with service providers.</strong> We share your personal data with third parties in connection with services that these individuals or entities perform for or with ACP. These third parties are restricted from using this data in any way other than to provide services for ACP or for the collaboration in which they and ACP are contractually engaged (for example, hosting an ACP database or engaging in data processing on ACP's behalf, or mailing you information that you requested, as well as operations and maintenance contractors). These third parties are carefully selected by ACP, their access to your personal information is limited to the information reasonably necessary in order for them to perform their services for ACP and they are obligated to keep your data secure and not use or disclose your personal information for any purpose other than providing us with products and services.
          </Text>

          <Text>
            <strong>To protect ACP content and services.</strong> We use your information to prevent potentially illegal activities and to enforce our terms and conditions. We also use a variety of technical systems to detect and address anomalous activity and to screen content to prevent abuse, such as spam. These efforts may, on occasion, result in a temporary or permanent suspension or termination of some functions for some users.
          </Text>

          <Text>
            <strong>To comply with legal requirements and to protect your rights.</strong> ACP may release personal information to third parties: (1) to comply with valid legal requirements such as a law, regulation, search warrant, subpoena or court order, including to meet national security or law enforcement requirements; or (2) in special cases, such as a physical threat to you or others. In the event that we are legally compelled to disclose your personal information to a third party, we will notify you unless doing so would violate the law or court order.
          </Text>

          <Text>
            <strong>In the context of business reorganization.</strong> ACP will share your information if we are involved in a merger, acquisition, consolidation, change of control or sale of all or a portion of our assets or if we undergo bankruptcy or liquidation.
          </Text>

          <Title order={2}>How You Can Control Your Information</Title>

          <Text>
            <strong>Online interest-based Advertising:</strong> You can manage or turn off ad personalization by Google by accessing your ad settings while logged into your Google account (<Anchor href="https://adssettings.google.com">https://adssettings.google.com</Anchor>). To opt out of interest-based advertising or to learn more about the use of this information by our Service Providers you can visit the Network Advertising Initiative (<Anchor href="www.networkadvertising.org/managing/opt_out.asp">www.networkadvertising.org/managing/opt_out.asp</Anchor>) or the Digital Advertising Alliance (<Anchor href="www.aboutads.info/choices/">www.aboutads.info/choices/</Anchor>). If you choose to opt-out, we will place an "opt-out cookie" on your computer. The "opt-out cookie" is browser-specific and device-specific and only lasts until cookies are cleared from your browser or device. The opt-out cookie will not work for some cookies that are important to how our websites and mobile apps work ("essential cookies"). If the cookie is removed or deleted, if you upgrade your browser or if you visit us from a different computer, you will need to return and update your preferences.
          </Text>

          <Text>
            <strong>Cookies:</strong> You may use the ACP's websites without accepting cookies. The "Help" function in your web browser explains how to manage cookies while using the Internet. Please note, however, that some services, such as the Internal Medicine Meeting Day Planner, the Shopping Cart, MyACP, and the SSO system will not work if your browser will not accept cookies.
          </Text>

          <Text>
            <strong>Email promotional communications:</strong> To delete your name from our email contact lists you can change the preferences directly via MyACP (<Anchor href="www.acponline.org/myacp">www.acponline.org/myacp</Anchor>), by contacting Member and Product Support directly at: <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor> or by clicking the "unsubscribe" link found in every email sent to you.
          </Text>

          <Text>
            <strong>Removal from Member Directory:</strong> To request exclusion from the ACP Member Directory, please submit your request via <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor>.
          </Text>

          <Title order={2}>Security and e-commerce</Title>

          <Text>
            All of our websites are delivered via standard secured HTTPS protocols, ensuring that your data is safely encrypted. Our secure server certificate is issued by VeriSign. All of our databases and systems storing any personal information are governed by a Data Protection Policy and we routinely engage security auditors to ensure that our systems remain secure in accordance with privacy and security standards.
          </Text>

          <Text>
            Our secure server enables you to transmit a credit card number to us with confidence. We do not store your credit card number after your transaction has been processed and we strictly adhere to current Payment Card Industry Data Security Standards (PCI DSS) and routinely engage auditors to verify this compliance.
          </Text>

          <Title order={2}>Your Rights Under EU and U.S. State(s) Data Protection Laws</Title>

          <Text>
            If EU data protection laws or U.S. state legislation in your state apply to our processing of your information, you may be entitled by law to access, correct, amend, or delete personal information about you that we hold. A list of the rights under the EU GDPR law is below and additional information is available in our message about GDPR (<Anchor href="https://www.acponline.org/acp-privacy-policy/gdpr">https://www.acponline.org/acp-privacy-policy/gdpr</Anchor>).
          </Text>

          <Text>
            Rights under U.S. state laws vary by state, so in order to facilitate proactive compliance, we invite your questions at <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor> or you may specifically make data removal requests via this form (<Anchor href="https://www.acponline.org/">https://www.acponline.org/</Anchor>).
          </Text>

          <Text>
            You can control the information we have about you and how we use it in several ways. If you are a registered user, you can review, revise, and correct the personal data that you have provided to ACP directly via MyACP (<Anchor href="www.acponline.org/myacp">www.acponline.org/myacp</Anchor>), or by contacting us directly at: <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor>. You can request that data be deleted or make another request in connection with the rights below by contacting us via this same link.
          </Text>

          <Text>
            In the event that we refuse a request under rights of access, we will provide the individual with a reason as to why. Individuals in the EU have the right to complain as outlined in the "Complaints" section (<Anchor href="https://www.acponline.org/about-this-site/acp-privacy-policy#complaints">https://www.acponline.org/about-this-site/acp-privacy-policy#complaints</Anchor>).
          </Text>

          <Text>
            A list of your rights as defined by the GDPR is below:
          </Text>

          <List>
            <List.Item>Right of access – the right to request a copy of the information that we hold about you.</List.Item>
            <List.Item>Right of rectification – the right to correct data that we hold about you that is inaccurate or incomplete.</List.Item>
            <List.Item>Right to be forgotten – in certain circumstances, you can ask for the data we hold about you to be erased from our records.</List.Item>
            <List.Item>Right to restriction of processing – where certain conditions apply to have a right to restrict the processing.</List.Item>
            <List.Item>Right of portability – the right to have the data we hold about you transferred to another organization.</List.Item>
            <List.Item>Right to object – the right to object to certain types of processing such as direct marketing.</List.Item>
            <List.Item>Right to object to automated processing, including profiling – the right to not be subject to the legal effects of automated processing or profiling. We do not currently engage in any automated processing or profiling of individuals we know reside in the EU.</List.Item>
          </List>

          <Title order={2}>How Long We Keep Your Information</Title>

          <Text>
            You can delete your account or request that we delete your account by contacting us at <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor>. If you choose to delete your account, we will begin the process of deleting your account from our systems.
          </Text>

          <Text>
            We retain your information after you request such deletion for longer periods for specific purposes to the extent that we are obliged to do so in accordance with applicable laws and regulations and/or as necessary to protect our legal rights or for certain business requirements. For example, when we process your payments, we will retain this data for longer periods of time as required for tax or accounting purposes. Some of the specific reasons we would retain some data for longer periods of time include:
          </Text>

          <List>
            <List.Item>Security, fraud, and abuse prevention – i.e. to protect you, other people, and us from fraud, abuse, and unauthorized access.</List.Item>
            <List.Item>Financial record-keeping – when you make a payment to us we are often required to retain this information for a long period of time for purposes of accounting, dispute resolution, and compliance with tax, anti-money laundering, and other financial regulations</List.Item>
            <List.Item>Complying with legal or regulatory requirements – to meet any applicable law, regulation, legal process, or enforceable governmental request, as required to enforce our terms of service, including investigation of potential violations</List.Item>
            <List.Item>Direct communications with us – if you have directly communicated with us, through a customer support channel, feedback form, or a bug report, we may retain reasonable records of those communications.</List.Item>
          </List>

          <Text>
            Even if you delete your account, keep in mind that the deletion by our third-party providers may not be immediate and that the deleted information may persist in backup copies for a reasonable period of time. For any privacy or data-protection-related questions, please contact us (<Anchor href="https://www.acponline.org/contact">https://www.acponline.org/contact</Anchor>).
          </Text>

          <Title order={2}>Processing in the United States</Title>

          <Text>
            ACP transfers, processes, and stores information about you on servers located in the United States. Therefore, your information may be transferred to, stored, or processed in the United States or other countries outside of the EU, whose data protection, privacy, and other laws may not provide the same level of protection as those in your country of residence. For example, government entities in the United States and other countries may have certain rights to access your personal information. If we transfer your information outside of the EU in this way, we will take steps to ensure that appropriate security measures are taken with the aim of ensuring that your privacy rights continue to be protected as outlined in this policy. By using our Websites or our services, you agree that the collection, use, transfer and disclosure of your personal information and communications will be governed by the provisions of this Privacy Policy.
          </Text>

          <Title order={2}>External Links</Title>

          <Text>
            Please note that some of the links within ACP websites and digital products connect to other websites. Once you leave any ACP website or digital product and enter another website (whether through an advertisement, co-brand, service, or content link), be aware that any information you disclose on or through those sites is not subject to this privacy policy. ACP does not endorse and is not responsible for the privacy practices of any third-party websites to which we may link. You acknowledge that such other website locations are not under the control of ACP and agree that ACP shall not be responsible for any information or other links found at any linked site. ACP provides such links only as a convenience to you and has not tested any software or verified any information disclosed on or through such sites. You should always review the privacy policy for those sites to understand how they treat your personal information.
          </Text>

          <Title order={2}>Browser Do Not Track</Title>

          <Text>
            The Services do not support Do Not Track at this time. Do Not Track (DNT) is a privacy preference you can set in your web browser to indicate that you do not want certain information about your webpage visits collected across websites when you have not interacted with that service on the page. For all the details, including how to turn on Do Not Track, visit <Anchor href="donottrack.us">donottrack.us</Anchor>.
          </Text>

          <Title order={2}>Protecting Children's Privacy</Title>

          <Text>
            You must be 18 years or older to use our Services. We do not knowingly accept personal information from any child under the age of 16. If it is brought to our attention that we have inadvertently received personal information from a child under 16, we will immediately remove all personal and identifiable information from our records or seek parental consent as may be required.
          </Text>

          <Title order={2}>Questions and Complaints</Title>

          <Text>
            If you have any questions or complaints about our privacy practices, please contact us directly at: <Anchor href="www.acponline.org/contact">www.acponline.org/contact</Anchor> or in writing to:
          </Text>

          <Text>
            American College of Physicians, Inc.<br />
            Member and Product Support<br />
            190 N. Independence Mall West<br />
            Philadelphia, PA 19106<br />
            (p) 800-523-1546
          </Text>

          <Text>
            If you reside in the EU, in the event your concerns in connection with how we process your information are not addressed you can file a complaint with the data protection supervisory authority in the country of your residence.
          </Text>

          <Title order={2}>Changes</Title>

          <Text>
            We change this Privacy Policy from time to time. When we update this Privacy Policy, we will notify you by posting the revised Privacy Policy on our website and will always indicate the date the last changes were published. If changes are significant, we'll provide a more prominent notice, including directly notifying you by email of the change or asking for your consent, where required by applicable law. Your continued use of the Services after the changes have been made will constitute your acceptance of the changes. Please, therefore, make sure you read any such notice carefully. If you do not wish to continue using the Services under the new version of the Privacy Policy, please cease using the Services.
          </Text>

          <Title order={2}>Digital Millennium Copyright Act: Notice and Take Down Procedure for Making Claims of Copyright Infringement by ACP on ACPOnline.org</Title>

          <Text>
            Please note that these notifications and counter-notifications are legal notices provided outside of the American College of Physicians environment. American College of Physicians may provide copies of such notices to the participants in the dispute or third parties, at our discretion and as required by law – the privacy policy for American College of Physicians does not protect the information provided in these notices.
          </Text>

          <Text>
            If you ("Copyright Owner") believe copyrighted work is available on this website in a way that constitutes copyright infringement, you may notify the following designated agent of the American College of Physicians, Inc. ("Operator") in writing. While you are welcome to phone with queries, we cannot process take-down requests made telephonically.
          </Text>

          <Text>
            American College of Physicians, Inc.<br />
            Office of Legal Services<br />
            DMCA Agent: April Oeffler<br />
            190 N. Independence Mall West<br />
            Philadelphia, PA 19106<br />
            (p) 215-351-2791 (f) 215-351-2449 (e) aoeffler@acponline.org
          </Text>

          <Title order={3}>NOTIFICATION</Title>

          <Text>
            Your written notification (the "Notification") to the above-referenced designated agent must include substantially all of the following:
          </Text>

          <List>
            <List.Item>Identification of the copyrighted work that is the subject of the claimed infringement or, if multiple copyrighted works are involved, a representative list of such works;</List.Item>
            <List.Item>Identification of the allegedly infringing material, together with information reasonably sufficient to permit Operator to locate such material (for example, the URL of web page on which the material appears with optional screenshot);</List.Item>
            <List.Item>Information reasonably sufficient to permit Operator to contact you, such as your full name, address, telephone number and email address;</List.Item>
            <List.Item>A statement by you that you have a good faith belief that the copyrighted work identified in the Notification is being used in a manner that is not authorized by the copyright owner, its agent or the law;</List.Item>
            <List.Item>A statement by you, signed under penalty of perjury, that the information contained in the Notification is accurate and that you are authorized to act on behalf of the owner of the copyrighted work that is allegedly being infringed; and</List.Item>
            <List.Item>A physical or electronic signature of the owner of the copyrighted work or a person authorized to act on its behalf.</List.Item>
          </List>

          <Text>
            Upon receipt of a Notification containing substantially all of the foregoing, Operator may take the following steps:
          </Text>

          <List>
            <List.Item>Remove or disable access to the allegedly infringing material;</List.Item>
            <List.Item>Forward the Notification to the alleged infringer (the "Impacted Party"); and</List.Item>
            <List.Item>Take reasonable steps to promptly notify the Impacted Party that Operator has removed or disabled access to the allegedly infringing material.</List.Item>
          </List>

          <Title order={3}>COUNTER NOTIFICATION</Title>

          <Text>
            The Impacted Party may submit a counter notification in writing to the above-referenced designated agent of Operator. The written counter notification (the "Counter Notification") must include substantially all of the following:
          </Text>

          <List>
            <List.Item>Identification of the allegedly infringing material that was removed or disabled by Operator and the location where the material appeared before it was removed or access to it was disabled;</List.Item>
            <List.Item>A statement under penalty of perjury that the Impacted Party has a good faith belief that the allegedly infringing material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled;</List.Item>
            <List.Item>The Impacted Party's name, address and telephone number and a statement that the Impacted Party consents to the jurisdiction of the United States federal district court for the judicial district in which the address provided by the Impacted Party is located and will accept service of process from you. If the Impacted Party is located outside the United States, the Impacted Party must include a statement that it consents to the jurisdiction of any United States federal district court in which Operator may be found; and</List.Item>
            <List.Item>A physical or electronic signature of the Impacted Party.</List.Item>
          </List>

          <Text>
            Upon receipt of a Counter Notification containing substantially all of the foregoing, Operator will take the following steps:
          </Text>

          <List>
            <List.Item>Send you a copy of the Counter Notification;</List.Item>
            <List.Item>Inform you that it will replace the allegedly infringing material or cease disabling access to it within ten (10) business days; and</List.Item>
            <List.Item>Replace the removed allegedly infringing material or cease disabling access to it not less than ten (10) nor more than fourteen (14) business days following receipt of the Counter Notification; provided you have not supplied the designated agent with evidence that you have filed an action seeking a court order to restrain the Impacted Party from engaging in the infringing activity that was the subject of the Notification.</List.Item>
          </List>

          <Text>
            Operator's policy is to terminate the online privileges of individuals who repeatedly violate the copyrights of others.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy; 