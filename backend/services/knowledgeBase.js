// ============================================================
// services/knowledgeBase.js
// Complete Softlink Options product & service catalogue
// Edit this file to keep info up to date
// ============================================================

const KB = {
  company: {
    name: "Softlink Options Limited",
    tagline: "A Domain Name For Every Business",
    founded: "2007",
    experience: "17+ years",
    projectsDone: "999+",
    happyClients: "1800+",
    address: "Ngong Road, Enwealth Business Centre 5th Floor, Annex (Next to Double Tree by Hilton)",
    phones: ["+254 723 498 783", "+254 712 399 544"],
    email: "info@softlinkoptions.com",
    website: "https://softlinkoptions.co.ke",
    clientPortal: "https://softlinkoptions.co.ke/billing/index.php?rp=/login",
    socials: {
      facebook: "https://www.facebook.com/softlinkoptionslimited/",
      twitter: "https://x.com/softlinkoptions",
      instagram: "https://www.instagram.com/softlinkoptionsltd/",
      linkedin: "https://www.linkedin.com/company/softlink-options/",
    },
  },

  domains: {
    description: "Register your domain name quickly and affordably.",
    registerUrl: "https://softlinkoptions.co.ke/billing/cart.php?a=add&domain=register",
    pricing: [
      { tld: ".co.ke", price: "KES 1,300/year", note: "Best for Kenyan businesses" },
      { tld: ".or.ke", price: "KES 1,300/year", note: "NGOs and organisations" },
      { tld: ".ac.ke", price: "KES 1,300/year", note: "Academic institutions" },
      { tld: ".me.ke", price: "KES 1,300/year", note: "Personal websites" },
      { tld: ".com", price: "KES 2,500/year", note: "Global businesses" },
      { tld: ".org", price: "KES 2,500/year", note: "Global organisations" },
    ],
    faq: "A domain is your website address (e.g. yourname.co.ke). You need it to be findable online.",
  },

  hosting: {
    shared: {
      url: "https://softlinkoptions.co.ke/shared-hosting/",
      description: "Affordable, reliable hosting for small to medium websites. All plans include cPanel, free .co.ke domain, unlimited email, 99.9% uptime, and 24/7 support.",
      plans: [
        { name: "Basic", price: "KES 300/month", space: "15GB", features: ["Free .co.ke domain", "15GB storage", "Unlimited email", "Unlimited bandwidth", "Unlimited subdomains", "Enhanced security", "24/7 support", "99.9% uptime"], buyUrl: "https://softlinkoptions.co.ke/billing/index.php?rp=/store/hosting-packages/basic" },
        { name: "Bronze", price: "KES 450/month", space: "25GB", features: ["Free .co.ke domain", "25GB storage", "Unlimited email", "Unlimited bandwidth", "Unlimited subdomains", "Enhanced security", "24/7 support", "99.9% uptime"], buyUrl: "https://softlinkoptions.co.ke/billing/index.php?rp=/store/hosting-packages/bronze-hosting" },
        { name: "Silver", price: "KES 900/month", space: "35GB", features: ["Free .co.ke domain", "35GB storage", "Unlimited email", "Unlimited bandwidth", "Unlimited subdomains", "Enhanced security", "24/7 support", "99.9% uptime"], buyUrl: "https://softlinkoptions.co.ke/billing/index.php?rp=/store/hosting-packages/silver-hosting" },
      ],
      special: { name: "Special Bronze", price: "KES 450 one-time offer", url: "https://softlinkoptions.co.ke/billing/index.php?rp=/store/special/special-bronze" },
    },
    vps: { url: "https://softlinkoptions.co.ke/vps/", description: "Virtual Private Server with dedicated resources, full root access, and better performance for growing sites." },
    kenyaVps: { url: "https://softlinkoptions.co.ke/kenya-vps-2/", description: "VPS servers hosted locally in Kenya for low latency and fast speeds for Kenyan users." },
    dedicated: { url: "https://softlinkoptions.co.ke/dedicated-hosting/", description: "Entire physical server exclusively for your use. Best for large-scale, high-traffic, resource-intensive applications." },
    managed: { url: "https://softlinkoptions.co.ke/managed-hosting-plans/", description: "We manage your server so you can focus on your business. Includes updates, security, backups, and monitoring." },
    reseller: { url: "https://softlinkoptions.co.ke/reseller-hosting/", description: "Start your own hosting business. Resell our hosting under your own brand." },
    objectStorage: { url: "https://softlinkoptions.co.ke/object-storage/", description: "Scalable cloud storage for files, media, and backups." },
    ngos: { url: "https://softlinkoptions.co.ke/hosting-for-ngos/", description: "Special hosting packages tailored for NGOs and non-profit organisations." },
    schools: { url: "https://softlinkoptions.co.ke/hosting-for-schools/", description: "Hosting designed for schools and educational institutions." },
    nodejs: { url: "https://softlinkoptions.co.ke/hosting-for-node-js/", description: "Hosting optimised for Node.js applications." },
  },

  services: {
    ssl: { url: "https://softlinkoptions.co.ke/ssl-certificate/", description: "Secure your website with an SSL certificate. Protects data, builds trust, and improves SEO rankings." },
    websiteDesign: { url: "https://softlinkoptions.co.ke/website-design/", description: "Professional website design and development. Custom websites for businesses, NGOs, schools, and personal brands." },
    googleAds: { url: "https://softlinkoptions.co.ke/google-advertising/", description: "Google Ads management. Drive targeted traffic to your website and increase sales through paid search." },
    aiAutomation: { url: "https://softlinkoptions.co.ke/ai-automation/", description: "AI-powered automation solutions for business processes, chatbots, and workflow optimization." },
    digitalMarketing: { url: "https://softlinkoptions.co.ke/digital-marketing/", description: "Full digital marketing — SEO, social media marketing, content creation, and online brand building." },
    bulkSms: { url: "https://softlinkoptions.co.ke/bulk-sms-services/", description: "Bulk SMS services for marketing campaigns, notifications, and customer communication across Kenya." },
    erp: { description: "Enterprise Resource Planning (ERP) software setup and management. We work with Odoo ERP for business operations." },
    emailHosting: { description: "Business email hosting on dedicated servers. Reliable email for high-volume business communications." },
    payroll: { description: "Payroll software solutions for businesses of all sizes." },
    dataBackup: { description: "Cloud data backup and recovery solutions to keep your data safe." },
  },

  support: {
    hours: "24/7 Technical Support",
    channels: ["Phone: +254 723 498 783", "Phone: +254 712 399 544", "Email: info@softlinkoptions.com", "Client Portal: softlinkoptions.co.ke/billing"],
    faqUrl: "https://softlinkoptions.co.ke/faq/",
    supportUrl: "https://softlinkoptions.co.ke/support/",
  },
};

module.exports = KB;
