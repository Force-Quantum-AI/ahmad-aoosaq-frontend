import {
  Phone, Calendar, Zap, Droplet, Globe, BarChart3, Clock,
  PhoneCall, Mic2, SquareMousePointer, AudioLines, MessagesSquare
} from "lucide-react";
import chyLogo from "@/assets/images/chyrImage/logo-chy.png";
import avrianceLogo from "../../../public/AVRIANCElogo.png";
import nohmLogo from "../../../public/NohmImages/NOHMlogo.png";
import chyrIntegrationLogo from "../../../public/ChyrIntegrationLogo.png";
import avrianceIntegrationLogo from "../../../public/AvrianceIntegrationLogo.png";
import nohmIntegrationLogo from "../../../public/NohmImages/NohmIntegrationImg.png";
import chyrHeroBgVideo from "../../../public/purpal mix.mp4";
// import chyrHeroBgVideo from "../../../public/Purple.mp4";
import avrianceHeroBgVideo from "../../../public/Dark blue.mp4";
// import avrianceHeroBgVideo from "../../../public/Blue.mp4";
import nohmHeroBgVideo from "../../../public/orangii.mp4";
// import nohmHeroBgVideo from "../../../public/Copper.mp4";


export type BaseBrandVariables = {
  brandName: string;
  colors: {
    primaryHost: string;          // e.g. text-[#FFCD72] or text-[#E64D4C]
    primaryStyle: string;         // e.g. text-[#FFCD72] or text-[#EA664F]
    primaryHex: string;           // #FFCD72 or #EA664F
    secondaryHex: string;         // #DCAD60 or #EA664F
    buttonGradientBorder: string; // The button style background
    buttonShadow: string;
    revenueCTAGradient: string;
    securityGradientTarget: string; // e.g. to-[#FFCD72] or to-[#EA664F]
    brandColor?: string; // currently used for landing page hero section bg stars color for phone
    brandColorHex?: string;
  };
  assets: {
    phoneUILogo: string;
    integrationImg: string;
    heroBgVideo?: string;
  };
  texts: {
    hero: {
      rotatingWords: string[];
      description: string;
      finalWord: string; // appointment. vs booking.
    };
    businessMiss: {
      sentence: string;
      title: string;
      features: { title: string; content: string; Icon: any }[];
    };
    tryLiveDemo: {
      button1Icon: any;
      button1Text: string;
      button2Icon: any;
      button2Text: string;
      description: string;
    };
    reliableEmployee: {
      titlePrefix: string;
      features: { title: string; content: string; Icon: any }[];
    };
    faq: {
      subtitle: string;
      list: { value: string; trigger: string; content: string }[];
    };
    forwardCalls: {
      numberTitle: string;
      businessLabel: string;
      activity1: string;
      activity1Sub: string;
      activity2: string;
      alertText: string;
      title: string;
      desc: string;
      steps: { title: string; content: string }[];
    };
    hylnSteps: {
      titlePart1: string;
      titlePart2: string;
      importLabel: string;
      importPlaceholder: string;
      tellMeAbout: string;
      tellMeSub: string;
      step1Title: string;
      step1Desc: string;
      step1List: { title: string; content: string }[];
    };
    customizeHyln: {
      title: string;
      desc: string;
      steps: { title: string; content: string }[];
      greeting: string;
      servicesLabel: string;
      services: string[];
      intakeQuestions: string[];
      transferText: string;
      integration1Name: string;
    };
    integrations: {
      titleSuffix: string;
    };
    heroCallWidget: {
      title: string;
      cardColor?: string;
      askAnything: string;
      features: { Icon: any; title: string; sub: string }[];
      activities: { name: string; status: string }[];
    };
  };
};

export const CHYR_CONFIG: BaseBrandVariables = {
  brandName: "Chyr",
  colors: {
    primaryHost: "text-[#FFCD72]",
    primaryStyle: "text-[#FFCD72]",
    primaryHex: "#FFCD72",
    secondaryHex: "#DCAD60",
    buttonGradientBorder: "radial-gradient(circle at 70% 30%,  #E39C4C 0%, #543597 100%)",
    buttonShadow: "0 4px 18px 0 rgba(99, 5, 113, 0.50)",
    revenueCTAGradient: "radial-gradient(circle at 70% 30%,  #F1A34C 0%, #9F1DF5 60%)",
    securityGradientTarget: "to-[#FFCD72]",
    brandColor: "bg-[#DCAD60]",
    brandColorHex: "#DCAD60",
  },
  assets: {
    phoneUILogo: chyLogo,
    integrationImg: chyrIntegrationLogo,
    heroBgVideo: chyrHeroBgVideo,
  },
  texts: {
    hero: {
      rotatingWords: ["appointment.", "reservation.", "order.","booking."],
      description: "Chyr answers your phones, books your appointments, and helps you stay on top of every customer.",
      finalWord: "appointment."
    },
    businessMiss: {
      sentence: "Businesses miss an average of 34% of calls per day. Chyr makes that 0%.",
      title: "Salons & Spas that trust Chyr Everyday",
      features: [
        { title: "Missed Calls", content: "Up to 34% of salon calls go unanswered during peak hours. That's lost revenue.", Icon: Phone },
        { title: "Table Bookings", content: "Customers want to book instantly. If nobody answers, they call the competition.", Icon: Calendar },
        { title: "Takeout Orders", content: "Phone orders get messy during dinner rush. Mistakes cost money and bad reviews.", Icon: Zap },
        { title: "Menu Questions", content: "Staff spend hours answering \"Are you open?\" and \"Do you have vegan options?\"", Icon: Droplet },
      ]
    },
    tryLiveDemo: {
      button1Icon: PhoneCall,
      button1Text: "Try Chyr AI",
      button2Icon: Mic2,
      button2Text: "Live Demo",
      description: "Experience how naturally our Al takes appointments and respond to client calls instantly — exactly like a trained staff member would. "
    },
    reliableEmployee: {
      titlePrefix: "Your restaurant's ",
      features: [
        { title: "24/7 Call Answering", content: "Never miss a booking request again even during peak hours or days off.", Icon: Clock },
        { title: "Appointment Management", content: " Books, reschedules, and cancels appointments with full calendar sync automatically.", Icon: Calendar },
        { title: "Smart Upselling", content: " AI suggests add-on services, packages, and memberships to increase AOV automatically.", Icon: Zap },
        { title: "Service Menu Navigation", content: "Explains treatments, pricing, and duration for customers browsing options.", Icon: Droplet },
        { title: "Multilingual Support", content: "English, Arabic, and other languages help international clients feel understood instantly.", Icon: Globe },
        { title: "Analytics Dashboard", content: "Track calls answered, leads captured, peak inquiry times, and conversion rates.", Icon: BarChart3 },
      ]
    },
    faq: {
      subtitle: "Everything you need to know about Chyr.",
      list: [
        { value: "item-1", trigger: "How will appointments be added to our booking system?", content: "Chyr integrates with all major salon and restaurant booking systems, including Square, OpenTable, Resy, and more. When a customer books through Chyr, the appointment is automatically added to your existing calendar in real-time." },
        { value: "item-2", trigger: "Can the AI handle cancellations and rescheduling?", content: "Yes! Chyr can handle cancellations and rescheduling requests 24/7. Customers can cancel or change their appointments through Chyr, and the changes will be reflected in your booking system instantly." },
        { value: "item-3", trigger: "How will the AI handle customers who struggle to speak English?", content: "Chyr is fluent in English, Arabic, French, Spanish, and over 100+ other languages. It can communicate naturally with customers in their preferred language, ensuring they feel understood and valued." },
        { value: "item-4", trigger: "How would you provide us with support, and do we need to pay for it?", content: "Every Chyr account includes 24/7 technical support via email, phone, and live chat. We also offer optional onboarding and training services to ensure you get the most out of Chyr." },
        { value: "item-5", trigger: "Will I be able to see a report of how the AI is performing?", content: "Yes! You'll get a detailed analytics dashboard showing calls answered, appointments booked, peak hours, conversion rates, and more. All data is updated in real-time." },
        { value: "item-6", trigger: "Can the AI upsell services or packages?", content: "Yes! Chyr can be trained to upsell services and packages based on your business goals. It can recommend add-ons, premium options, or special packages to customers during the conversation." },
        { value: "item-7", trigger: "What if a client asks for a specific stylist or therapist?", content: "Yes! Chyr can be customized to handle specific requests like stylist or therapist preferences. You can train it to know your team's availability and recommend the right person for each appointment." }
      ]
    },
    forwardCalls: {
      numberTitle: "Your Chyr Number",
      businessLabel: "Business number",
      activity1: "Sarah M.",
      activity1Sub: "Chyr answering..",
      activity2: "Ali A.",
      alertText: "Transfer urgent to you",
      title: "Forward your calls and go live",
      desc: "Get your Chyr number — forward calls when busy or after hours. Chyr will answer and handle calls instantly.",
      steps: [
        { title: "Get your Chyr number — ", content: "Forward calls when busy or after hours" },
        { title: "See every call — ", content: "Summaries in your dashboard" },
        { title: "Get notified — ", content: "Text alerts for reservations and urgent calls" }
      ]
    },
    hylnSteps: {
      titlePart1: "restaurant calls",
      titlePart2: "in",
      importLabel: "Import from your website",
      importPlaceholder: "https://yourrestaurant.com",
      tellMeAbout: "Tell me about your restaurant",
      tellMeSub: "Have a conversation with Chyr to set up your account",
      step1Title: "Set up Chyr in minutes",
      step1Desc: "Import your restaurant website or have a quick conversation with Chyr — she'll learn your menu, hours, and specials automatically.",
      step1List: [
        { title: "Import your restaurant website — ", content: "Chyr learns your menu, hours, and specials" },
        { title: "Or talk to Chyr — ", content: "Have a conversation and she sets everything up" },
        { title: "Connect your POS — ", content: "Foodics, Square, Toast, and more" }
      ]
    },
    customizeHyln: {
      title: "Customize how Chyr answers",
      desc: "Choose your voice, set your greeting, and tell Chyr what to ask callers — so every call sounds exactly like your front desk.",
      steps: [
        { title: "Pick your voice — ", content: "Friendly, professional, or somewhere in between" },
        { title: "Add intake questions — ", content: "Party size, dietary restrictions, special occasions" },
        { title: "Connect integrations — ", content: "Foodics, Square, Google Calendar" }
      ],
      greeting: "“Thank you for calling Oasis Grill. This is Mohammed. How may I assist you today?”",
      servicesLabel: "Taking Orders",
      services: ["Reservations", "Takeout Orders", "Menu Questions"],
      intakeQuestions: [
        "1. How many people are in your party?",
        "2. Are there any dietary restrictions?"
      ],
      transferText: "Transfer catering calls to Manager",
      integration1Name: "Foodics"
    },
    integrations: {
      titleSuffix: "restaurant tools"
    },
    heroCallWidget: {
      title: "Talk to Chyr Live",
      cardColor: "bg-[#6E5BBD]",
      askAnything: "Ask Chyr anything and try it out for yourself",
      features: [
        { Icon: Calendar, title: "Book Appointments", sub: "Syncs to Square" },
        { Icon: MessagesSquare, title: "Send Confirmations", sub: "Auto text reminders" },
        { Icon: Clock, title: "Works 24/7", sub: "Never misses a call" }
      ],
      activities: [
        { name: "Sarah M", status: "Reserved table for 4" },
        { name: "Mike T.", status: "Takeout order" },
        { name: "Jessica R", status: "Reserved table" },
        { name: "David K.", status: "Answered" }
      ]
    }
  }
};

export const AVRIANCE_CONFIG: BaseBrandVariables = {
  brandName: "Avriance",
  colors: {
    primaryHost: "text-[#E64D4C]",
    primaryStyle: "text-[#EA664F]",
    primaryHex: "#EA664F",
    secondaryHex: "#EA664F",
    buttonGradientBorder: "linear-gradient(105deg, #EA664F 0%, rgba(42, 116, 192, 0.85) 100%)",
    buttonShadow: "0 4px 18px 0 rgba(42,116,192,0.3)",
    revenueCTAGradient: "radial-gradient(circle at 70% 30%,  #366291 0%, #EA664F 100%)",
    securityGradientTarget: "to-[#EA664F]",
    brandColor: "bg-[#E64C4C]",
  },
  assets: {
    phoneUILogo: avrianceLogo,
    integrationImg: avrianceIntegrationLogo,
    heroBgVideo: avrianceHeroBgVideo,
  },
  texts: {
    hero: {
      rotatingWords: ["appointment.", "reservation.", "booking.", "trip."],
      description: "Avriance captures leads, answers inquiries, and books consultations while you focus on creating dream vacations.",
      finalWord: "booking."
    },
    businessMiss: {
      sentence: "Agencies miss an average of 34% of calls per day. Avriance makes that 0%.",
      title: "Agencies that trust Avriance AI Everyday",
      features: [
        { title: "Missed Calls", content: "Up to 34% of travel agency calls go unanswered during peak seasons. That's lost revenue.", Icon: Phone },
        { title: "Consultations", content: "Clients want expert advice instantly. If nobody answers, they book elsewhere.", Icon: Calendar },
        { title: "Trip Support", content: "Existing clients need urgent help during their trips but struggle to reach an agent.", Icon: Zap },
        { title: "Basic Inquiries", content: "Staff spend hours answering pricing, package details, and visa requirements.", Icon: Droplet },
      ]
    },
    tryLiveDemo: {
      button1Icon: SquareMousePointer,
      button1Text: "Try Avriance AI",
      button2Icon: AudioLines,
      button2Text: "Live Demo",
      description: "Experience how naturally our Al handle inquiries and booking requests 24/7 — exactly like a trained staff member would."
    },
    reliableEmployee: {
      titlePrefix: "Your travel agency's ",
      features: [
        { title: "24/7 Call Answering", content: "Never miss a booking inquiry again even during busy seasons or holidays.", Icon: Clock },
        { title: "Lead Capture & Qualification", content: "AI collects travel preferences, budget, and dates to qualify leads instantly.", Icon: Calendar },
        { title: "Smart Package Recommendations", content: "Suggests packages based on customer preferences and increases conversion automatically.", Icon: Zap },
        { title: "Appointment Scheduling", content: "Books consultation calls with travel agents and sends confirmation messages.", Icon: Droplet },
        { title: "Multilingual Support", content: "English, Arabic, and other languages help international clients feel understood instantly.", Icon: Globe },
        { title: "Analytics Dashboard", content: "Track calls answered, leads captured, peak inquiry times, and conversion rates.", Icon: BarChart3 },
      ]
    },
    faq: {
      subtitle: "Everything you need to know about Avriance.",
      list: [
        { value: "item-1", trigger: "How will the AI capture lead information?", content: "Avriance captures leads by asking questions like name, email, phone number, and travel preferences. It can also collect additional details such as budget, group size, and desired travel dates." },
        { value: "item-2", trigger: "Can the AI provide package quotes over the phone?", content: "Yes! Avriance can provide package quotes over the phone by accessing your pricing information and package details. It can also suggest alternative packages based on the customer's preferences and budget." },
        { value: "item-3", trigger: "How will the AI handle customers who struggle to speak English?", content: "Avriance can communicate fluently in English, Arabic, French, Spanish, and over 100 other languages. It adapts to the caller's language automatically, ensuring every customer feels understood." },
        { value: "item-4", trigger: "How would you provide us with support, and do we need to pay for it?", content: "Our support team is available 24/7 via phone, email, and live chat. We also offer comprehensive onboarding and training to ensure you get the most out of Avriance." },
        { value: "item-5", trigger: "Will I be able to see a report of how the AI is performing?", content: "Yes! You’ll get a detailed dashboard tracking every call, lead, conversion rate, and peak inquiry time. You can also export call recordings and transcripts anytime." },
        { value: "item-6", trigger: "Can the AI handle booking changes and cancellations?", content: "Yes! Avriance can handle booking changes and cancellations by accessing your booking system. It can also reschedule or cancel bookings based on the customer's preferences." },
        { value: "item-7", trigger: "What if a customer asks about a destination we don't offer?", content: "If a customer asks about a destination you don't offer, Avriance will politely inform them that you don't offer that destination and suggest alternative destinations that you do offer." },
      ]
    },
    forwardCalls: {
      numberTitle: "Your Avriance Number",
      businessLabel: "Agency number",
      activity1: "Sarah M.",
      activity1Sub: "Chyr answering..",
      activity2: "Ali A.",
      alertText: "Transfer urgent to you",
      title: "Forward your calls and go live",
      desc: "Get your Avriance number — forward calls when busy or after hours. Avriance will start capturing leads, answering inquiries, and booking consultations instantly.",
      steps: [
        { title: "Get your Avriance number — ", content: "Forward calls when you're busy or after hours" },
        { title: "See every lead — ", content: "Summaries in your dashboard" },
        { title: "Get notified — ", content: "Text or email alerts for urgent calls and new bookings" }
      ]
    },
    hylnSteps: {
      titlePart1: "agency calls",
      titlePart2: "in",
      importLabel: "Import from your website",
      importPlaceholder: "https://youragency.com",
      tellMeAbout: "Tell me about your travel agency",
      tellMeSub: "Have a conversation with Avriance to set up your account",
      step1Title: "Set up Avriance in minutes",
      step1Desc: "Import your website or have a quick conversation with Avriance — she'll learn your services, hours, and FAQs automatically.",
      step1List: [
        { title: "Import your agency website — ", content: "Avriance pulls your services, pricing, and business info instantly" },
        { title: "Or talk to Avriance — ", content: "Have a conversation and she'll set everything up for you" },
        { title: "Connect your booking system  — ", content: "Square, Vagaro, MindBody, and more" }
      ]
    },
    customizeHyln: {
      title: "Customize how Avriance answers",
      desc: "Choose your voice, set your greeting, and tell Avriance what to ask prospects — so every call sounds exactly like your best agent.",
      steps: [
        { title: "Pick your voice — ", content: "Friendly, professional, or somewhere in between" },
        { title: "Add intake questions — ", content: "Ask about allergies, preferences, or anything you need" },
        { title: "Connect integrations — ", content: "MindBody, Square, Vagaro, and more" }
      ],
      greeting: "“Thank you for calling TeleFly. This is Mohammed. Where would you like to travel today?”",
      servicesLabel: "Services",
      services: ["Flight Booking", "Hotel Reservation", "Holiday Packages", "Visa Assistance"],
      intakeQuestions: [
        "1. Where are you traveling to?",
        "2. Travel dates?"
      ],
      transferText: "Transfer hot leads to Agent",
      integration1Name: "HubSpot"
    },
    integrations: {
      titleSuffix: "agency tools"
    },
    heroCallWidget: {
      title: "Talk to Avriance Live",
      cardColor: "bg-[#366291]",
      askAnything: "Ask Avriance anything and try it out for yourself",
      features: [
        { Icon: Calendar, title: "Book Consultations", sub: "Syncs to HubSpot" },
        { Icon: MessagesSquare, title: "Capture Leads", sub: "Instantly follows up" },
        { Icon: Clock, title: "Works 24/7", sub: "Never misses a prospect" }
      ],
      activities: [
        { name: "Sarah M", status: "Consultation Booked" },
        { name: "Mike T.", status: "Honeymoon Lead" },
        { name: "Jessica R", status: "Pricing Inquiry" },
        { name: "David K.", status: "Answered" }
      ]
    }
  }
};

export const NOHM_CONFIG: BaseBrandVariables = {
  brandName: "Nohm",
  colors: {
    primaryHost: "text-[#F00A4F]",
    primaryStyle: "text-[#F00A4F]",
    primaryHex: "#F00A4F",
    secondaryHex: "#F00A4F",
    buttonGradientBorder: "linear-gradient(105deg, #E3631A 0%, #8B2E5B 100%)",
    buttonShadow: "0 4px 18px 0 rgba(227, 99, 26, 0.3)",
    revenueCTAGradient: "radial-gradient(circle at 70% 30%,  #821F4A 0%, #F00A4F 100%)",
    securityGradientTarget: "to-[#F00A4F]",
    brandColor: "bg-[#F00B4F]",
  },
  assets: {
    phoneUILogo: nohmLogo,
    integrationImg: nohmIntegrationLogo,
    heroBgVideo: nohmHeroBgVideo,
  },
  texts: {
    hero: {
      rotatingWords: ["reservation.", "order.", "delivery.", "inquiry."],
      description: "Nohm takes reservations, manages takeout orders, and answers questions while you focus on serving great food.",
      finalWord: "booking."
    },
    businessMiss: {
      sentence: "Businesses miss an average of 34% of calls per day. NOHM makes that 0%.",
      title: "Restaurants that trust NOHM AI Everyday",
      features: [
        { title: "Missed Calls", content: "Up to 34% of restaurant calls go unanswered during peak seasons. That's lost revenue.", Icon: Phone },
        { title: "Reservations", content: "Clients want to book instantly. If nobody answers, they book elsewhere.", Icon: Calendar },
        { title: "Takeout Orders", content: "Existing clients need urgent help during their trips but struggle to reach an agent.", Icon: Zap },
        { title: "Basic Inquiries", content: "Staff spend hours answering pricing, package details, and visa requirements.", Icon: Droplet },
      ]
    },
    tryLiveDemo: {
      button1Icon: SquareMousePointer,
      button1Text: "Try Nohm AI",
      button2Icon: AudioLines,
      button2Text: "Live Demo",
      description: "Experience how naturally our Al handle inquiries and booking requests 24/7 — exactly like a trained staff member would."
    },
    reliableEmployee: {
      titlePrefix: "Your salon's ",
      features: [
        { title: "24/7 Call Answering", content: "Never miss a booking inquiry again even during busy seasons or holidays.", Icon: Clock },
        { title: "Lead Capture & Qualification", content: "AI collects travel preferences, budget, and dates to qualify leads instantly.", Icon: Calendar },
        { title: "Smart Package Recommendations", content: "Suggests packages based on customer preferences and increases conversion automatically.", Icon: Zap },
        { title: "Appointment Scheduling", content: "Books consultation calls with travel agents and sends confirmation messages.", Icon: Droplet },
        { title: "Multilingual Support", content: "English, Arabic, and other languages help international clients feel understood instantly.", Icon: Globe },
        { title: "Analytics Dashboard", content: "Track calls answered, leads captured, peak inquiry times, and conversion rates.", Icon: BarChart3 },
      ]
    },
    faq: {
      subtitle: "Everything you need to know about Nohm.",
      list: [
        { value: "item-1", trigger: "How will my kitchen receive orders that the AI takes?", content: "Yes! We integrate with all major travel CRMs including HubSpot, Salesforce, and TravelJoy." },
        { value: "item-2", trigger: "Can the AI process payments over the phone?", content: "Yes! Nohm can securely process payments for takeout orders, reservations, and bookings directly over the phone." },
        { value: "item-3", trigger: "How will the AI handle customers who struggle to speak English?", content: "Not at all. Our conversational AI has natural pauses, filler words, and understands interruptions just like a human." },
        { value: "item-4", trigger: "How would you provide us with support, and do we need to pay for it?", content: "Our support team is available 24/7 via phone, email, and live chat. Most clients find that they rarely need support, as Nohm is designed to be self-sufficient. However, if you do need assistance, we're always here to help!" },
        { value: "item-5", trigger: "Will I be able to see a report of how the AI is performing?", content: "Yes! You’ll get a dashboard with call logs, lead details, conversion rates, and peak inquiry times." },
        { value: "item-6", trigger: "What happens during busy hours when we get lots of calls?", content: "Nohm handles unlimited calls simultaneously. No busy signals, no missed leads — just smooth service." },
        { value: "item-7", trigger: "Can the AI handle special dietary requests and modifications?", content: "Yes! Nohm can capture detailed requests and pass them to your team or directly to the kitchen." }
      ]
    },
    forwardCalls: {
      numberTitle: "Your Nohm Number",
      businessLabel: "Agency number",
      activity1: "Sarah M.",
      activity1Sub: "Chyr answering..",
      activity2: "Ali A.",
      alertText: "Transfer urgent to you",
      title: "Forward your calls and go live",
      desc: "Get your Nohm number — forward calls when busy or after hours. Nohm will start capturing leads, answering inquiries, and booking consultations instantly.",
      steps: [
        { title: "Get your Nohm number — ", content: "Forward calls when agency is closed" },
        { title: "See every lead — ", content: "Summaries in your dashboard" },
        { title: "Get notified — ", content: "Text alerts for high-value bookings" }
      ]
    },
    hylnSteps: {
      titlePart1: "agency calls",
      titlePart2: "in",
      importLabel: "Import from your website",
      importPlaceholder: "https://youragency.com",
      tellMeAbout: "Tell me about your travel agency",
      tellMeSub: "Have a conversation with Nohm to set up your account",
      step1Title: "Set up Nohm in minutes",
      step1Desc: "Import your website or have a quick conversation with Nohm — she'll learn your services, hours, and FAQs automatically.",
      step1List: [
        { title: "Import your website — ", content: "Nohm pulls your services, pricing, and business info instantly" },
        { title: "Or talk to Nohm — ", content: "Have a conversation and she will sets everything up for you." },
        { title: "Connect your booking system  — ", content: "Square, Vagaro, MindBody, and more" }
      ]
    },
    customizeHyln: {
      title: "Customize how Nohm answers",
      desc: "Choose your voice, set your greeting, and tell Nohm what to ask callers — so every call sounds exactly like your front desk.",
      steps: [
        { title: "Pick your voice — ", content: "Friendly, professional, or somewhere in between" },
        { title: "Add intake questions — ", content: "Ask about allergies, preferences, or anything you need" },
        { title: "Connect integrations — ", content: "MindBody, Square, Vagaro, and more" }
      ],
      greeting: "“Thank you for calling Nohm. This is Mohammed. How may I assist you today?”",
      servicesLabel: "Services",
      services: ["Make a Reservation", "Modify / Cancel Reservation", "Order Takeout", "Menu Information"],
      intakeQuestions: [
        "1. What date and time is your reservation?",
        "2. How many guests?"
      ],
      transferText: "Transfer hot leads to Agent",
      integration1Name: "HubSpot"
    },
    integrations: {
      titleSuffix: "agency tools"
    },
    heroCallWidget: {
      title: "Talk to Nohm Live",
      cardColor: "bg-[#821F4A]",
      askAnything: "Ask Nohm anything and try it out for yourself",
      features: [
        { Icon: Calendar, title: "Book Appointments", sub: "Syncs to Square" },
        { Icon: MessagesSquare, title: "Send Confirmations", sub: "Auto text reminders" },
        { Icon: Clock, title: "Works 24/7", sub: "Never misses a call" }
      ],
      activities: [
        { name: "Noura H.", status: "Booked" },
        { name: "Omar H.", status: "Booked" },
        { name: "Mohammad K.", status: "Answered" },
        { name: "Huda R.", status: "Answered" }
      ]
    }
  }
};

let currentConfig = CHYR_CONFIG;

export const setBrand = (brand: "CHYR" | "AVRIANCE" | "NOHM") => {
  currentConfig = brand === "CHYR" ? CHYR_CONFIG : brand === "AVRIANCE" ? AVRIANCE_CONFIG : NOHM_CONFIG;
};

export const getBrandConfig = () => currentConfig;

