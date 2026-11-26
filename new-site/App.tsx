import React, { useEffect, useMemo, useState } from "react";
import { AdminPortal, ShopSection } from "./ShopAdmin";
import ProfilePanel from "./ProfilePanel";
import { auth, db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { MoonStar, Sparkles, MessageCircle, MapPin, Clock, Heart, Coins, Activity, Flower2, Sun, ShieldCheck, Scale, Briefcase, Compass, Hash, Users, Smartphone, ChevronDown, Check, Star, HandHeart, Eye, BookOpen, ChevronLeft, ChevronRight, Quote, RefreshCw } from "lucide-react";
const tarotImage = "/images/Taro%20Cards.jpg";
const crystalHealingImage = "/images/Cristel%20Healing.jpg";
const mantraHealingImage = "/images/Maa%20tripursundari.jpg";
const akashicReadingImage = "/images/Akashic%20Reading.jpg";
const profileImage = "/images/Divine%20Healer%20Indu.jpeg";
const careerHealingImage = "/images/Career%20Healing.jpg";
const blackMagicRemovalImage = "/images/Black%20Magic%20Removal.jpg";
const auraHealingImage = "/images/Aura%20Healing.jpg";
const auraCleansingImage = "/images/Aura%20Cleansing.jpg";
const chakraHealingImage = "/images/7%20Chakra%20Healing.jpg";
const healthHealingImage = "/images/Health%20Healing.jpg";
const legalMattersHealingImage = "/images/Legal%20Matters%20Healing.jpg";
const loveMarriageHealingImage = "/images/Love%20%26%20Marriage%20Healing.jpg";
const moneyHealingImage = "/images/Money%20Healing.jpg";
const relationshipCordCuttingImage = "/images/Relationship%20Cord%20Cutting.jpg";
const karmicHealingImage = "/images/Karmic%20Healing.jpg";
const pastLifeCordCuttingImage = "/images/Past%20Life%20Cord%20Cutting.jpg";
const traumaHealingImage = "/images/Trauma%20Healing.jpg";
const thirdPartyRemovalImage = "/images/3rd%20Party%20Removal.jpg";
const toxicRelationshipCordCuttingImage = "/images/Toxic%20Relationship%20Cord%20Cutting.jpg";
const mobileCompatibilityImage = "/images/Mobile%20Compatibility.jpg";
const nameCompatibilityImage = "/images/Name%20Compatibility.jpg";
const healthGuidanceImage = "/images/Health%20Guidance.jpg";
const lifeProblemsGuidanceImage = "/images/Life%20Problems%20Guidance.jpg";
const moneyGuidanceImage = "/images/Money%20Guidance.jpg";
const compatibilityCheckImage = "/images/Compatibility%20Check.jpg";
const marriageChartsImage = "/images/Marriage%20Charts.jpg";
const marriageGuidanceImage = "/images/Marriage%20Guidance.jpg";
const careerGuidanceImage = "/images/Career%20Guidance.jpg";
const numerologyBirthChartImage = "/images/Numerology%20Birth%20Chart.jpg";
const dowserReadingImage = "/images/Dowser%20Reading.jpg";
const magicalKnotThreadsImage = "/images/magical%20knot%20threads.jpeg";

const WHATSAPP = "https://wa.me/918920702407";

type Service = { name: string; icon: React.ReactNode; desc: string; tag: string; image?: string; imageAlt?: string; price?: string };
const knotServices = ["Love Knot","Money Knot","Protection Knot","Vastu Knot","Health Knot","Job Knot","Study Knot","Business Knot","Pregnancy Knot","Home Protection Knot","Property Sell Knot"];
const services: Service[] = [
  { name: "Magical Knot Threads", icon: <Sparkles size={24} />, desc: "Tie a knot with a clear intention. Choose from love, money, protection, vastu, health, career, study, business, pregnancy, home protection, or property intentions.", tag: "Intention Ritual", image: magicalKnotThreadsImage, imageAlt: "Magical healing knot threads", price: "₹550 per knot" },
  { name: "Tarot Card Reading", icon: <Eye size={24} />, desc: "Clear, compassionate insight for the question on your heart.", tag: "Clarity", image: tarotImage, imageAlt: "Tarot cards for a spiritual reading", price: "3 questions — ₹550 • 30-minute session (unlimited questions) — ₹1,100" },
  { name: "Crystal Healing", icon: <Sparkles size={24} />, desc: "A crystal-focused healing experience to support calm, balance, and intention.", tag: "Energy Healing", image: crystalHealingImage, imageAlt: "Crystal healing" },
  { name: "Mantra Healing", icon: <Flower2 size={24} />, desc: "A devotional mantra healing practice inspired by Maa Tripurasundari.", tag: "Mantra", image: mantraHealingImage, imageAlt: "Maa Tripurasundari" },
  { name: "Akashic Reading", icon: <BookOpen size={24} />, desc: "Gentle guidance from your soul’s deeper story and lessons.", tag: "Soul Path", image: akashicReadingImage, imageAlt: "Akashic reading", price: "1 question — ₹1,100" },
  { name: "Money Healing", icon: <Coins size={24} />, desc: "Release blocks around abundance and welcome steady flow.", tag: "Abundance", image: moneyHealingImage, imageAlt: "Money healing" },
  { name: "Love & Marriage Healing", icon: <Heart size={24} />, desc: "Heal the bond, restore trust, and nurture lasting closeness.", tag: "Relationships", image: loveMarriageHealingImage, imageAlt: "Love and marriage healing" },
  { name: "Health Healing", icon: <Activity size={24} />, desc: "Supportive energy work for balance, rest, and vitality.", tag: "Wellbeing", image: healthHealingImage, imageAlt: "Health healing" },
  { name: "7 Chakra Healing", icon: <Flower2 size={24} />, desc: "Align all seven energy centres and feel centred again.", tag: "Alignment", image: chakraHealingImage, imageAlt: "Seven chakra healing", price: "7 days — ₹2,100 • 11 days — ₹3,500 • 21 days — ₹6,501" },
  { name: "Aura Cleansing", icon: <Sparkles size={24} />, desc: "Refresh your energy field and let heaviness gently lift.", tag: "Cleansing", image: auraCleansingImage, imageAlt: "Aura cleansing", price: "₹750" },
  { name: "Aura Healing", icon: <Sun size={24} />, desc: "Strengthen and brighten your aura with protective energy.", tag: "Protection", image: auraHealingImage, imageAlt: "Aura healing", price: "3 live sessions — ₹2,100" },
  { name: "Black Magic Removal", icon: <ShieldCheck size={24} />, desc: "Safe, calm clearing work to help you feel light and secure.", tag: "Clearing", image: blackMagicRemovalImage, imageAlt: "Black magic removal" },
  { name: "Legal Matters Healing", icon: <Scale size={24} />, desc: "Steady, focused energy for clarity during legal challenges.", tag: "Clarity", image: legalMattersHealingImage, imageAlt: "Legal matters healing" },
  { name: "Career Healing", icon: <Briefcase size={24} />, desc: "Clear career blocks and open the path to purposeful work.", tag: "Career", image: careerHealingImage, imageAlt: "Career healing" },
  { name: "Relationship Cord Cutting", icon: <Heart size={24} />, desc: "A supportive spiritual practice to help release unhealthy emotional attachments, strengthen boundaries, and make space for healthier connections.", tag: "Relationship Healing", image: relationshipCordCuttingImage, imageAlt: "Relationship cord cutting" },
  { name: "Karmic Healing", icon: <Sparkles size={24} />, desc: "Explore recurring life patterns through a reflective spiritual healing practice focused on insight, balance, and personal growth.", tag: "Spiritual Healing", image: karmicHealingImage, imageAlt: "Karmic healing" },
  { name: "Past Life Cord Cutting", icon: <Sparkles size={24} />, desc: "A spiritual cord-cutting journey to reflect on past-life connections and release attachments that may feel emotionally limiting.", tag: "Cord Cutting", image: pastLifeCordCuttingImage, imageAlt: "Past life cord cutting", price: "21 days • 3 live sessions & rituals — ₹6,501" },
  { name: "3rd Party Removal", icon: <ShieldCheck size={24} />, desc: "Spiritual support for navigating perceived third-party interference, gaining clarity, and focusing on trust and healthy relationship boundaries.", tag: "Relationship Healing", image: thirdPartyRemovalImage, imageAlt: "3rd Party Removal healing", price: "21 days • 3 live sessions — ₹6,501" },
  { name: "Trauma Healing", icon: <Heart size={24} />, desc: "A gentle, compassionate spiritual support journey centred on emotional grounding, self-kindness, and reconnecting with inner strength.", tag: "Emotional Healing", image: traumaHealingImage, imageAlt: "Trauma healing", price: "21 days • 3 live sessions — ₹6,501" },
  { name: "Toxic Relationship Cord Cutting", icon: <Heart size={24} />, desc: "A guided spiritual practice to help loosen unhealthy emotional ties, reclaim personal space, and move forward with greater clarity.", tag: "Cord Cutting", image: toxicRelationshipCordCuttingImage, imageAlt: "Toxic relationship cord cutting", price: "21 days • 3 live sessions — ₹6,501" },
  { name: "Dowser Reading", icon: <Compass size={24} />, desc: "Intuitive dowsing guidance for decisions and direction.", tag: "Direction", image: dowserReadingImage, imageAlt: "Dowser reading" },
  { name: "Career Guidance", icon: <Briefcase size={24} />, desc: "Practical, intuitive guidance for your next career step.", tag: "Career", image: careerGuidanceImage, imageAlt: "Career guidance" },
  { name: "Marriage Guidance", icon: <Users size={24} />, desc: "Kind counsel for marriage, partnership, and family harmony.", tag: "Relationships", image: marriageGuidanceImage, imageAlt: "Marriage guidance" },
  { name: "Marriage Charts", icon: <Heart size={24} />, desc: "Thoughtful chart insight for marriage timing and harmony.", tag: "Relationships", image: marriageChartsImage, imageAlt: "Marriage charts" },
  { name: "Compatibility Check", icon: <Users size={24} />, desc: "Understand how two energies meet, grow, and support each other.", tag: "Relationships", image: compatibilityCheckImage, imageAlt: "Compatibility check" },
  { name: "Money Guidance", icon: <Coins size={24} />, desc: "Practical spiritual guidance for money choices and growth.", tag: "Abundance", image: moneyGuidanceImage, imageAlt: "Money guidance" },
  { name: "Life Problems Guidance", icon: <Compass size={24} />, desc: "A calm space to untangle life’s challenges, one step at a time.", tag: "Guidance", image: lifeProblemsGuidanceImage, imageAlt: "Life problems guidance" },
  { name: "Health Guidance", icon: <Activity size={24} />, desc: "Gentle direction to support your healing and daily balance.", tag: "Wellbeing", image: healthGuidanceImage, imageAlt: "Health guidance" },
  { name: "Mulank - Root Number", icon: <Hash size={24} />, desc: "From your date of birth — understand your personality, nature, and strengths.", tag: "Numerology", image: numerologyBirthChartImage, imageAlt: "Numerology birth chart" },
  { name: "Bhagyank - Destiny Number", icon: <Star size={24} />, desc: "From your full date of birth — explore your life path, karma, and destiny.", tag: "Numerology" },
  { name: "Naamank - Name Numerology", icon: <Hash size={24} />, desc: "Lucky name correction for success, money, and fame.", tag: "Numerology", image: nameCompatibilityImage, imageAlt: "Name numerology" },
  { name: "Personal Year Number", icon: <Sun size={24} />, desc: "Discover what this year may bring for love, money, career, and health.", tag: "Numerology" },
  { name: "Personal Month & Day Number", icon: <Clock size={24} />, desc: "Find supportive dates for important work, meetings, launches, and travel.", tag: "Numerology" },
  { name: "Lucky Number & Lucky Colour", icon: <Sparkles size={24} />, desc: "Explore your lucky numbers, colours, days, and directions.", tag: "Numerology" },
  { name: "Lucky Mobile Number Numerology", icon: <Smartphone size={24} />, desc: "Check the numerology of your mobile number and whether it feels aligned with your goals.", tag: "Numerology", image: mobileCompatibilityImage, imageAlt: "Mobile number numerology" },
  { name: "Business Name Numerology", icon: <Briefcase size={24} />, desc: "Explore a lucky business, shop, or brand name for growth and profit.", tag: "Numerology" },
  { name: "Baby Name Numerology", icon: <Heart size={24} />, desc: "Choose a meaningful, powerful, and blessed name for your baby.", tag: "Numerology" },
  { name: "Marriage / Compatibility Numerology", icon: <Users size={24} />, desc: "Explore partner compatibility through numbers — love, understanding, and marriage.", tag: "Numerology" },
  { name: "House / Vehicle Number Numerology", icon: <MapPin size={24} />, desc: "Explore the numerology of your house, flat, or car number.", tag: "Numerology" },
  { name: "Kua Number - Feng Shui Numerology", icon: <Compass size={24} />, desc: "Discover your personal Kua number and supportive directions for sleeping and sitting.", tag: "Numerology" },
  { name: "Lo Shu Grid", icon: <Flower2 size={24} />, desc: "Explore your personal energy map and the meanings associated with missing numbers.", tag: "Numerology" },
  { name: "Chaldean Numerology", icon: <BookOpen size={24} />, desc: "Explore the ancient Chaldean method, often used for name and business numerology.", tag: "Numerology" },
  { name: "Vedic Numerology", icon: <Sun size={24} />, desc: "Explore the Indian Vedic approach to karma, dasha, and life lessons through numbers.", tag: "Numerology" },
  { name: "Angel Numbers", icon: <Sparkles size={24} />, desc: "Explore possible meanings of repeating numbers such as 111, 222, 333, 444, 777, and 888.", tag: "Numerology" },
];

const faqs = [
  { q: "What is Akashic Reading?", a: "It is a gentle, intuitive reading focused on the deeper patterns, lessons, and soul themes shaping your life. You bring a question; Indu helps you understand it with clarity and compassion." },
  { q: "How does Black Magic Removal work?", a: "The work is calm, protective, and non-frightening. It focuses on cleansing heavy or unsettled energy, strengthening your aura, and helping you feel safe, grounded, and at peace." },
  { q: "How do I book a service?", a: "Send your booking request to Indu through WhatsApp using the website form. Indu will personally confirm the service format, availability, and timing with you." },
  { q: "How long is a session?", a: "Session length depends on the service and your concern. When you share your concern while booking, you will receive guidance on the right session and preparation." },
  { q: "When will my service take place?", a: "Indu will discuss and confirm the suitable timing and how the service will be provided after receiving your WhatsApp request." },
];

const testimonials = [
  { title: "Love Healing", text: "I arrived feeling confused and heavy. I left feeling lighter, clearer, and much more hopeful about my relationship.", note: "Healing journey • Delhi" },
  { title: "Money Healing", text: "The session helped me see my fears around money in a new way. I felt calmer, more focused, and ready to take steady steps forward.", note: "Healing journey • Delhi" },
  { title: "Health Healing", text: "The room felt peaceful and safe. The healing helped me breathe easier, rest better, and return to myself.", note: "Healing journey • Delhi" },
  { title: "Clarity & Calm", text: "The reading named exactly what I had been carrying. I left with a clear next step and a much quieter mind.", note: "Healing journey • Delhi" },
];

const divineMessages = [
  { title: "Breathe & Begin Again", text: "You do not need to fix everything today. Take one gentle breath, release one heavy thought, and let light find its way back in.", focus: "Today’s focus: rest and clarity" },
  { title: "Your Heart Already Knows", text: "The answer you keep seeking is not far away. Quiet the noise, listen to your heart, and trust the first soft truth that rises.", focus: "Today’s focus: trust your intuition" },
  { title: "Abundance Is Opening", text: "Release the fear that you must struggle to deserve good things. Abundance begins with one brave, steady step forward.", focus: "Today’s focus: steady abundance" },
  { title: "You Are Protected", text: "Heavy energy does not get the final word. Your light is stronger than what tried to dim it. Walk forward with your aura bright.", focus: "Today’s focus: protection and peace" },
  { title: "Love Is Healing", text: "Where there has been distance, let kindness speak first. Healing does not rush — it returns when both hearts feel safe.", focus: "Today’s focus: gentle connection" },
  { title: "A New Door Is Near", text: "What felt blocked was only gathering you for a better direction. Keep your heart open. The next chapter is already turning.", focus: "Today’s focus: new direction" },
];

const marqueeItems = ["Tarot Reading", "Akashic Reading", "Reiki Healing", "Chakra Alignment", "Aura Cleansing", "Love Healing", "Money Healing", "Numerology", "Black Magic Removal", "Career Guidance"];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedService, setSelectedService] = useState("Tarot Card Reading");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedKnot, setSelectedKnot] = useState("Love Knot");
  const [readingFormat, setReadingFormat] = useState("3 questions");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState<{ name: string; service: string } | null>(null);
  const [serviceTab, setServiceTab] = useState<"Healing" | "Guidance" | "Numerology">("Healing");
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageRevealed, setMessageRevealed] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [serviceTab]);

  const healingServiceNames = ["Magical Knot Threads", "Crystal Healing", "Mantra Healing", "Money Healing", "Love & Marriage Healing", "Health Healing", "7 Chakra Healing", "Aura Cleansing", "Aura Healing", "Black Magic Removal", "Legal Matters Healing", "Career Healing", "Relationship Cord Cutting", "Karmic Healing", "Past Life Cord Cutting", "3rd Party Removal", "Trauma Healing", "Toxic Relationship Cord Cutting"];
  const numerologyServiceNames = ["Mulank - Root Number", "Bhagyank - Destiny Number", "Naamank - Name Numerology", "Personal Year Number", "Personal Month & Day Number", "Lucky Number & Lucky Colour", "Lucky Mobile Number Numerology", "Business Name Numerology", "Baby Name Numerology", "Marriage / Compatibility Numerology", "House / Vehicle Number Numerology", "Kua Number - Feng Shui Numerology", "Lo Shu Grid", "Chaldean Numerology", "Vedic Numerology", "Angel Numbers"];
  const visibleServices = services.filter(s => serviceTab === "Healing" ? healingServiceNames.includes(s.name) : serviceTab === "Numerology" ? numerologyServiceNames.includes(s.name) : !healingServiceNames.includes(s.name) && !numerologyServiceNames.includes(s.name));
  const isTarot = selectedService === "Tarot Card Reading";
  const isAkashic = selectedService === "Akashic Reading";
  const isKnot = selectedService === "Magical Knot Threads";
  // A flat ₹300 advance consultation/booking payment is collected for every appointment.
  const consultationFee = 300;
  const readingFee = 0;
  const knotPrice = 0;
  const totalFee = 300;

  const whatsappText = useMemo(() => {
    const lines = [`Hello Divine Healer Indu,`, ` `, `I would like to book a service.`, `Name: ${name || "[Your name]"}`, `Phone: ${phone || "[Your phone]"}`, `Service: ${selectedService}`, isTarot ? `Tarot option: ${readingFormat}` : "", isAkashic ? "Akashic Reading: 1 question" : "", isKnot ? `Knot: ${selectedKnot}` : "", message ? `Message: ${message}` : ""].filter(Boolean);
    return `https://wa.me/918920702407?text=${encodeURIComponent(lines.join("\\n"))}`;
  }, [name, phone, selectedService, selectedKnot, readingFormat, message, isTarot, isAkashic, isKnot, consultationFee, readingFee, knotPrice, totalFee]);

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!name.trim() || !phone.trim()) { setFormError("Please add your name and phone number so Indu can reach you."); return; }
    if (phone.replace(/\D/g, "").length < 10) { setFormError("Please enter a complete phone number with at least 10 digits."); return; }
    setIsSubmitting(true);
    try {
      const orderResponse = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), service: selectedService })
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok || !order.success) throw new Error(order.error || "Unable to start secure payment. Please try again.");

      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Secure payment could not be loaded. Please refresh and try again."));
          document.body.appendChild(script);
        });
      }
      const RazorpayCheckout = (window as any).Razorpay;
      if (!RazorpayCheckout) throw new Error("Secure payment is unavailable. Please try again.");

      const result = await new Promise<any>((resolve, reject) => {
        const checkout = new RazorpayCheckout({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Divine Healer Indu",
          description: "₹300 consultation and appointment booking fee",
          order_id: order.orderId,
          prefill: { name: name.trim(), contact: phone.trim() },
          notes: { service: selectedService },
          theme: { color: "#D4AF37" },
          modal: { ondismiss: () => reject(new Error("Payment window closed. Your appointment has not been confirmed.")) },
          handler: async (payment: any) => {
            try {
              const response = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: name.trim(),
                  phone: phone.trim(),
                  service: selectedService,
                  readingOption: isTarot ? readingFormat : isAkashic ? "Question reading" : "",
                  knot: isKnot ? selectedKnot : "",
                  message: message.trim(),
                  razorpay_order_id: payment.razorpay_order_id,
                  razorpay_payment_id: payment.razorpay_payment_id,
                  razorpay_signature: payment.razorpay_signature
                })
              });
              const savedBooking = await response.json();
              if (!response.ok || !savedBooking.success) {
                throw new Error(savedBooking.error || "Payment was received, but booking could not be saved. Please contact Indu with payment ID " + payment.razorpay_payment_id + ".");
              }
              resolve({ ...savedBooking, paymentId: payment.razorpay_payment_id });
            } catch (error) {
              reject(error);
            }
          }
        });
        checkout.on("payment.failed", (event: any) => {
          reject(new Error(event?.error?.description || "Payment failed. Your appointment has not been confirmed."));
        });
        checkout.open();
      });
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, "users", auth.currentUser.uid, "bookings"), {
            uid: auth.currentUser.uid,
            bookingId: result.bookingId || "",
            name: name.trim(),
            email: auth.currentUser.email || "",
            phone: phone.trim(),
            service: selectedService,
            knot: isKnot ? selectedKnot : "",
            readingOption: isTarot ? readingFormat : isAkashic ? "Question reading" : "",
            readingFee,
            consultationFee,
            knotPrice,
            totalFee,
            message: message.trim(),
            status: "Payment received — booking confirmed",
            paymentAmount: 300,
            paymentCurrency: "INR",
            paymentId: result.paymentId || "",
            createdAt: serverTimestamp()
          });
        } catch {
          setFormError("Your request was sent, but it could not be added to your profile history yet. Please check Firestore security rules.");
        }
      }
      setSaved({ name: name.trim(), service: selectedService });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Your request could not be saved. Please try WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function pickService(n: string) {
    setSelectedService(n);
    setSaved(null);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("name")?.focus({ preventScroll: true }), 450);
  }

  function nextMessage() {
    setMessageIndex((i) => (i + 1) % divineMessages.length);
    setMessageRevealed(true);
  }

  const currentMessage = divineMessages[messageIndex];
  const currentStory = testimonials[storyIndex];

  if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") return <AdminPortal />;

  return (
    <div data-safe-area-inset-root style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }} className="min-h-screen overflow-x-clip bg-[var(--royal-3)] text-[var(--ink)]">
      {/* NAV — over the tarot image */}
      <header data-safe-area-sticky-top style={{ top: "var(--safe-area-inset-top)" }} className="sticky z-40 border-b border-[rgba(212,175,55,.35)] bg-[rgba(20,4,42,.82)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><ProfilePanel /><a href="#top" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--gold)] bg-[var(--royal-2)] text-[var(--gold-soft)] shadow-[0_0_18px_rgba(255,184,77,.35)]"><MoonStar size={24} /></span>
            <span className="min-w-0 leading-tight"><span className="font-serif-display block truncate text-lg font-bold sm:text-xl">Divine Healer Indu</span><span className="block text-[10px] uppercase tracking-[.22em] text-[var(--lavender)]">Reiki • Humkara • Haleem</span></span>
          </a></div>
          <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Main navigation">
            <a className="hover:text-[var(--gold-soft)]" href="#about">About</a><a className="hover:text-[var(--gold-soft)]" href="#services">Services</a><a className="hover:text-[var(--gold-soft)]" href="#shop">Shop</a><a className="hover:text-[var(--gold-soft)]" href="#daily">Daily Message</a><a className="hover:text-[var(--gold-soft)]" href="#stories">Stories</a><a className="hover:text-[var(--gold-soft)]" href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#booking" className="rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-extrabold text-[#2A0A4A] shadow-[0_0_24px_rgba(255,184,77,.35)]">Book Session</a>
            <button onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} className="rounded-full border border-white/20 px-3 py-2 text-sm lg:hidden">{menuOpen ? "Close" : "Menu"}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-white/10 px-5 py-4 lg:hidden" aria-label="Mobile navigation"><div className="grid gap-3 font-semibold"><a onClick={() => setMenuOpen(false)} href="#about">About</a><a onClick={() => setMenuOpen(false)} href="#services">Services</a><a onClick={() => setMenuOpen(false)} href="#shop">Shop</a><a onClick={() => setMenuOpen(false)} href="#daily">Daily Message</a><a onClick={() => setMenuOpen(false)} href="#stories">Stories</a><a onClick={() => setMenuOpen(false)} href="#faq">FAQ</a><a onClick={() => setMenuOpen(false)} href="#booking">Book a Session</a></div></nav>}
      </header>

      <main id="top">
        {/* HERO — full tarot image + royal-purple gradient + scrim */}
        <section className="relative overflow-hidden">
          <img src={tarotImage} alt="Tarot cards arranged for a spiritual reading" className="absolute inset-0 h-full w-full object-cover object-[center_38%]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,8,51,.88)_0%,rgba(26,8,51,.58)_38%,rgba(26,8,51,.82)_72%,#1A0833_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,77,.16),transparent_55%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <span className="star left-[8%] top-[18%] h-2 w-2" /><span className="star left-[48%] top-[10%] h-1.5 w-1.5" style={{ animationDelay: ".8s" }} /><span className="star left-[82%] top-[24%] h-2 w-2" style={{ animationDelay: "1.4s" }} /><span className="star left-[68%] top-[58%] h-1.5 w-1.5" style={{ animationDelay: ".3s" }} /><span className="star left-[18%] top-[68%] h-1.5 w-1.5" style={{ animationDelay: "1.8s" }} />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:pb-24 lg:pt-20">
            <div className="max-w-3xl">
              <div className="hero-scrim rounded-[28px] p-6 sm:p-8">
                <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[rgba(212,175,55,.55)] bg-black/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-[var(--gold-soft)]"><Sparkles size={15} /> Bookings through WhatsApp • Personalised sessions</p>
                <p className="mt-5 mb-2 text-lg font-bold tracking-wide text-[var(--gold)] sm:text-2xl">Your Soul Guide, Healer &amp; Mentor</p>
                <h1 className="font-serif-display mt-1 text-[clamp(2.9rem,8vw,5.6rem)] font-bold leading-[.92]"><span className="gold-text shimmer-text drop-shadow-[0_0_28px_rgba(255,184,77,.45)]">Divine Healer</span><br /><span className="gold-text shimmer-text drop-shadow-[0_0_28px_rgba(255,184,77,.45)]">Indu</span></h1>                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#F2EAFB] sm:text-lg">Navigate your life with divine guidance through Numerology, Tarot, Dowsing &amp; Akashic Reading, and heal yourself with the blessings of Reiki, Maa Green Tara, Maa Kali, Maa Baglamukhi &amp; Maa Tripurasundari.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#booking" className="rounded-full bg-[var(--gold)] px-6 py-3.5 font-extrabold text-[#2A0A4A] shadow-[0_10px_35px_rgba(255,184,77,.45)] hover:shadow-[0_10px_42px_rgba(255,184,77,.65)]">Book Your Healing Session</a>
                  <a href="#services" className="rounded-full border border-[var(--lavender)] bg-black/20 px-6 py-3.5 font-bold text-[var(--lavender-soft)]">Explore Services</a>
                </div>
                <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#E8D9FF]"><span className="inline-flex items-center gap-2"><Check className="text-[var(--gold)]" size={17} /> Confidential &amp; compassionate</span><span className="inline-flex items-center gap-2"><Check className="text-[var(--gold)]" size={17} /> Ancient + modern energy work</span><span className="inline-flex items-center gap-2"><Check className="text-[var(--gold)]" size={17} /> Book in advance</span></div>
                <p className="mt-7 border-t border-[rgba(212,175,55,.35)] pt-4 text-center text-xs font-bold uppercase tracking-[.24em] text-[var(--gold-soft)] sm:text-left">Tarot • Akashic • Reiki • Chakra • Aura</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 px-1">
                <span className="rounded-full border border-[rgba(212,175,55,.55)] bg-[rgba(26,8,51,.72)] px-3 py-1.5 text-xs font-bold"><span className="text-[var(--gold-soft)]">24 healing services</span> • One caring guide</span>
                <span className="rounded-full border border-[rgba(212,175,55,.55)] bg-[rgba(26,8,51,.72)] px-3 py-1.5 text-xs font-bold"><span className="text-[var(--gold-soft)]">WhatsApp booking</span> • Indu confirms the details personally</span>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="overflow-hidden border-y border-[rgba(212,175,55,.45)] bg-[#12031F] py-3" aria-hidden="true">
          <div className="marquee flex w-max items-center gap-6 whitespace-nowrap text-sm font-bold uppercase tracking-[.18em] text-[var(--gold-soft)]">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-6"><span>{item}</span><span className="text-[var(--gold)]">✦</span></span>
            ))}
          </div>
        </div>

        {/* ABOUT — same image, cropped differently, framed like a tarot card */}
        <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div className="reveal relative mx-auto w-full max-w-sm">
              <div className="rounded-[28px] border-2 border-[var(--gold)] bg-[#1A0833] p-3 shadow-[0_0_45px_rgba(255,184,77,.28)]">
                <div className="overflow-hidden rounded-[20px] border border-[rgba(212,175,55,.45)]">
                  <img src={profileImage} alt="Portrait of Divine Healer Indu" className="aspect-[4/5] w-full object-cover object-top" />
                </div>
                <p className="px-2 pb-1 pt-3 text-center text-xs uppercase tracking-[.22em] text-[var(--gold-soft)]">✦ Tarot • Akashic • Reiki ✦</p>
              </div>
              <div className="absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[#1B0530] px-4 py-3 text-center text-sm shadow-xl">Bookings arranged personally through WhatsApp</div>
            </div>
            <div className="reveal">
              <p className="text-xs font-extrabold uppercase tracking-[.28em] text-[var(--gold)]">✦ Divine Healer Indu</p>
              <h2 className="font-serif-display mt-3 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight"><span className="gold-text italic">Divine Healer Indu</span></h2>
              <p className="mt-5 text-lg font-semibold tracking-wide text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,.28)]">Reiki Grand Master &amp; Healer</p><p className="mt-2 leading-relaxed text-[var(--muted)]">Namaste, I’m Indu, the soul behind Divine Healer Indu. I am a Reiki Grand Master and Humkara &amp; Haleem healer, dedicated to offering spiritual guidance and energy healing.</p>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">Through Reiki, Humkara, Haleem, tarot and Akashic readings, and numerology, I offer compassionate, personalized sessions to help you find clarity, reconnect with your inner balance and navigate life’s challenges.</p>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">My intention is to provide a peaceful, supportive space where every person feels heard, respected and guided.</p>
              <p className="mt-5 text-sm font-bold uppercase tracking-[.2em] text-[var(--gold-soft)]">Heal • Align • Manifest</p>
              <p className="mt-3 font-serif-display text-xl font-semibold italic tracking-wide text-[var(--gold-soft)]">Indu Chaoudhary</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[["Energy Healing", "Reiki, chakra & aura work"], ["Soul Readings", "Tarot, Akashic & dowsing"], ["Life Guidance", "Numerology & compatibility"]].map(([t, d]) => <div key={t} className="tarot-card rounded-2xl border border-[rgba(212,175,55,.4)] bg-white/5 p-4"><p className="font-bold text-[var(--gold-soft)]">{t}</p><p className="mt-1 text-sm text-[var(--muted)]">{d}</p></div>)}
              </div>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--lavender-soft)]"><MessageCircle size={17} className="text-[var(--gold)]" /> Book through WhatsApp • Indu confirms the details personally</p>
            </div>
          </div>
        </section>

        {/* SERVICES — Choose Your Healing Path, faded tarot image + heavy overlay */}
        <section id="services" className="relative scroll-mt-24 overflow-hidden py-14 sm:py-20">
          <div aria-hidden="true" style={{ backgroundImage: `url(${tarotImage})`, backgroundSize: "cover", backgroundPosition: "center 25%", opacity: 0.25 }} className="absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,8,51,.92),rgba(42,10,74,.88)_55%,rgba(26,8,51,.94))]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="reveal flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.28em] text-[var(--gold)]">✦ Sacred Services</p><h2 className="font-serif-display mt-3 text-[clamp(2rem,5vw,3.4rem)] font-bold">Choose Your Healing <span className="gold-text italic">Path</span></h2><p className="mt-3 max-w-2xl text-[var(--muted)]">Every card opens a door. Select a service to begin your booking — or call for guidance on which path is right for you.</p><p className="mt-3 text-sm font-semibold text-[var(--gold-soft)]">Service prices are shown for information only. Consultation charges are non-refundable.</p></div><div className="flex items-center gap-2 text-sm"><MessageCircle size={18} className="text-[var(--gold)]" /><span>Book through WhatsApp • Indu confirms the details</span></div></div>
            <div className="mt-7 flex flex-wrap gap-3" aria-label="Choose service type">{(["Healing", "Guidance", "Numerology"] as const).map(tab => <button key={tab} onClick={() => setServiceTab(tab)} aria-pressed={serviceTab === tab} className={`rounded-full border px-6 py-3 text-sm font-extrabold tracking-wide transition ${serviceTab === tab ? "border-[var(--gold)] bg-[var(--gold)] text-[#2A0A4A] shadow-[0_0_22px_rgba(255,184,77,.45)]" : "border-[rgba(212,175,55,.45)] bg-[rgba(26,8,51,.55)] text-[var(--lavender-soft)] hover:border-[var(--gold)]"}`}>{tab}</button>)}</div>
            <p className="mt-4 text-sm text-[var(--muted)]" aria-live="polite">Showing {visibleServices.length} {serviceTab.toLowerCase()} services.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleServices.map((s) => <article key={s.name} className="tarot-card card-sheen group flex flex-col rounded-[24px] border border-[rgba(212,175,55,.4)] bg-[linear-gradient(165deg,rgba(67,26,112,.92),rgba(49,16,85,.94))] p-5 shadow-lg transition hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-[0_18px_45px_rgba(255,184,77,.22)]">
                {s.image && <div className="-mx-5 -mt-5 mb-4 overflow-hidden rounded-t-[24px] border-b border-[rgba(212,175,55,.4)]"><img src={s.image} alt={s.imageAlt || s.name} className="h-44 w-full object-cover" loading="lazy" /></div>}
                <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-[rgba(212,175,55,.45)] bg-[rgba(27,5,48,.55)] text-[var(--gold-soft)]">{s.icon}</span><span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--lavender-soft)]">{s.tag}</span></div>
                <h3 className="font-serif-display mt-4 text-xl font-bold leading-snug">{s.name}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{s.desc}</p>{s.price && <p className="mt-3 font-extrabold text-[var(--gold-soft)]">{s.price}</p>}
                <div className="mt-5 flex items-center gap-2"><button onClick={() => pickService(s.name)} className="flex-1 rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-extrabold text-[#2A0A4A]">Book Now</button><a href={WHATSAPP} target="_blank" rel="noopener" aria-label={`Ask about ${s.name} on WhatsApp`} className="grid h-10 w-10 place-items-center rounded-full border border-white/20"><MessageCircle size={18} /></a></div>
              </article>)}
            </div>
          </div>
        </section>

        <ShopSection />

        {/* DAILY DIVINE MESSAGE */}
        <section id="daily" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16">
          <div className="reveal overflow-hidden rounded-[32px] border border-[rgba(212,175,55,.55)] bg-[linear-gradient(145deg,#3A1A6B,#1A0833)] p-6 shadow-[0_24px_70px_rgba(0,0,0,.35)] sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.28em] text-[var(--gold)]">✦ Daily Divine Message</p>
                <h2 className="font-serif-display mt-3 text-[clamp(2rem,5vw,3.1rem)] font-bold leading-tight">A message for <span className="gold-text italic">today</span></h2>
                <p className="mt-4 leading-relaxed text-[var(--muted)]">Pause for a moment. Let the message find you — then carry its gentle focus with you through the day.</p>
                <button onClick={nextMessage} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 font-extrabold text-[#2A0A4A] shadow-[0_0_28px_rgba(255,184,77,.4)]"><RefreshCw size={18} /> {messageRevealed ? "Reveal Another Message" : "Reveal Today’s Message"}</button>
                <p className="mt-3 text-sm text-[var(--lavender)]">Message {messageIndex + 1} of {divineMessages.length}</p>
              </div>
              <div key={messageIndex} className="fade-up rounded-[24px] border border-[rgba(212,175,55,.5)] bg-[rgba(26,8,51,.68)] p-6 sm:p-8">
                <Quote className="text-[var(--gold)]" size={28} />
                <h3 className="font-serif-display mt-3 text-2xl font-bold text-[var(--gold-soft)]">{currentMessage.title}</h3>
                <p className="font-cormorant mt-3 text-xl italic leading-relaxed text-[#F2EAFB] sm:text-2xl">“{currentMessage.text}”</p>
                <p className="mt-5 inline-flex rounded-full border border-[rgba(212,175,55,.5)] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold-soft)]">✦ {currentMessage.focus}</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY + HOW */}
        <section id="why" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 sm:py-12">
          <div className="reveal text-center"><p className="text-xs font-extrabold uppercase tracking-[.28em] text-[var(--gold)]">✦ Why Choose Me</p><h2 className="font-serif-display mx-auto mt-3 max-w-3xl text-[clamp(2rem,5vw,3.3rem)] font-bold">Healing that honours <span className="gold-text italic">your story</span></h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[["Personalized Healing", "No two journeys are alike. Your session is shaped around your concern, energy, and pace.", <HandHeart key="a" />], ["Personalised Service", "Indu will discuss the suitable service format and timing with you directly after your WhatsApp request.", <MessageCircle key="b" />], ["Confidential & Compassionate", "Your story stays safe. Bring your truth without fear of judgement.", <ShieldCheck key="c" />], ["Ancient + Modern Energy Work", "Time-honoured healing wisdom, offered in a grounded, modern way.", <Sparkles key="d" />]].map(([title, desc, icon], i) => <div key={String(title)} className="tarot-card reveal rounded-3xl border border-[rgba(212,175,55,.35)] bg-[var(--surface)] p-6"><span className="font-serif-display text-5xl font-bold text-[rgba(212,175,55,.35)]">0{i + 1}</span><span className="mt-3 grid h-11 w-11 place-items-center rounded-full bg-[var(--royal-2)] text-[var(--gold-soft)]">{icon as React.ReactNode}</span><h3 className="font-serif-display mt-4 text-xl font-bold">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{desc as string}</p></div>)}
          </div>
          <div className="reveal mt-14 rounded-[28px] border border-[var(--line)] bg-[var(--royal)] p-6 sm:p-9"><h3 className="font-serif-display text-center text-3xl font-bold">How it works</h3><div className="mt-8 grid gap-8 md:grid-cols-3">{[["1. Share Your Concern", "Tell Indu what you are carrying through your booking or WhatsApp."], ["2. Get Your Reading / Healing Plan", "Receive intuitive insight and a gentle plan created for your situation."], ["3. Heal & Manifest", "Move through your session with clarity, protection, and renewed confidence."]].map(([t, d]) => <div key={t} className="relative text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-[var(--gold)] bg-[#1B0530] font-serif-display text-2xl font-bold text-[var(--gold-soft)] shadow-[0_0_22px_rgba(255,184,77,.3)]">{t.charAt(0)}</span><h4 className="mt-4 font-bold">{t.slice(3)}</h4><p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted)]">{d}</p></div>)}</div><div className="mt-8 text-center"><a href="#booking" className="inline-block rounded-full bg-[var(--gold)] px-6 py-3 font-extrabold text-[#2A0A4A]">Begin Step One</a></div></div>
        </section>

        {/* STORIES CAROUSEL + FAQ */}
        <section id="stories" className="scroll-mt-24 bg-[linear-gradient(180deg,#1B0530,#2A0A4A)] py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr]">
            <div className="reveal"><p className="text-xs font-extrabold uppercase tracking-[.28em] text-[var(--gold)]">✦ Kind Words</p><h2 className="font-serif-display mt-3 text-[clamp(2rem,5vw,3.2rem)] font-bold">Stories of <span className="gold-text italic">returning to light</span></h2><p className="mt-3 text-sm text-[var(--muted)]">Placeholders for client reflections. Each journey is personal; yours will be held with the same care.</p>
              <div key={storyIndex} className="fade-up mt-6 rounded-3xl border border-[rgba(212,175,55,.45)] bg-[rgba(255,255,255,.05)] p-6 sm:p-8">
                <div className="flex gap-1 text-[var(--gold)]" aria-label="Five stars">{[0,1,2,3,4].map(i => <Star key={i} size={16} fill="currentColor" />)}</div>
                <blockquote className="font-cormorant mt-4 text-2xl italic leading-relaxed text-[var(--lavender-soft)]">“{currentStory.text}”</blockquote>
                <p className="mt-5 font-bold text-[var(--gold-soft)]">{currentStory.title}</p><p className="text-xs text-[var(--muted)]">{currentStory.note}</p>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button onClick={() => setStoryIndex((storyIndex - 1 + testimonials.length) % testimonials.length)} aria-label="Previous story" className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(212,175,55,.55)] text-[var(--gold-soft)] hover:bg-[var(--gold)] hover:text-[#2A0A4A]"><ChevronLeft /></button>
                <button onClick={() => setStoryIndex((storyIndex + 1) % testimonials.length)} aria-label="Next story" className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(212,175,55,.55)] text-[var(--gold-soft)] hover:bg-[var(--gold)] hover:text-[#2A0A4A]"><ChevronRight /></button>
                <div className="flex gap-2" role="tablist" aria-label="Choose a story">{testimonials.map((t, i) => <button key={t.title} role="tab" aria-selected={i === storyIndex} aria-label={`Story ${i + 1}: ${t.title}`} onClick={() => setStoryIndex(i)} className={`h-2 rounded-full transition ${i === storyIndex ? "w-8 bg-[var(--gold)]" : "w-2 bg-white/25"}`} />)}</div>
                <span className="ml-auto text-sm text-[var(--muted)]">{storyIndex + 1} / {testimonials.length}</span>
              </div>
            </div>
            <div id="faq" className="reveal"><p className="text-xs font-extrabold uppercase tracking-[.28em] text-[var(--gold)]">✦ Questions</p><h3 className="font-serif-display mt-3 text-3xl font-bold">Gentle answers</h3><div className="mt-5 space-y-3">{faqs.map((f, i) => <div key={f.q} className="overflow-hidden rounded-2xl border border-white/10 bg-[#1B0530]"><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-bold">{f.q}<ChevronDown size={20} className={`shrink-0 text-[var(--gold)] transition ${openFaq === i ? "rotate-180" : ""}`} /></button>{openFaq === i && <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>}</div>)}</div></div>
          </div>
        </section>


        {/* BOOKING — faded tarot image + heavy purple overlay */}
        <section id="booking" className="relative scroll-mt-24 overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
          <div aria-hidden="true" style={{ backgroundImage: `url(${tarotImage})`, backgroundSize: "cover", backgroundPosition: "center 70%", opacity: 0.2 }} className="absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,8,51,.94),rgba(42,10,74,.90)_55%,rgba(26,8,51,.95))]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl">
            <div className="reveal overflow-hidden rounded-[32px] border border-[rgba(212,175,55,.55)] bg-[linear-gradient(145deg,rgba(75,29,122,.96),rgba(42,10,74,.97))] shadow-[0_30px_80px_rgba(0,0,0,.35)]">
              <div className="grid lg:grid-cols-[.9fr_1.1fr]">
                <div className="p-6 sm:p-9"><p className="text-xs font-extrabold uppercase tracking-[.28em] text-[var(--gold-soft)]">✦ Booking &amp; Contact</p><h2 className="font-serif-display mt-3 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight">Your healing begins with one <span className="gold-text italic">brave step</span></h2><p className="mt-4 leading-relaxed text-[var(--muted)]">Share a few details, then send your booking request directly to Indu on WhatsApp.</p><div className="mt-7 space-y-4"><div className="flex items-center gap-4 rounded-2xl border border-[rgba(212,175,55,.4)] bg-black/15 p-4"><MessageCircle className="shrink-0 text-[var(--gold-soft)]" /><span><span className="block font-bold">Booking through WhatsApp</span><span className="text-sm text-[var(--muted)]">Indu will personally confirm availability, timing, and how your service will be provided.</span></span></div></div><a href={WHATSAPP} target="_blank" rel="noopener" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-extrabold text-[#07331A]"><MessageCircle /> Message on WhatsApp</a></div>
                <div className="bg-[var(--ink)] p-6 text-[#1B0530] sm:p-9">
                  {saved ? <div className="flex h-full flex-col justify-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#E9F7E9] text-green-700"><Check size={32} /></span><h3 className="font-serif-display mt-5 text-3xl font-bold">Thank you, {saved.name}.</h3><p className="mt-3 leading-relaxed text-gray-700">Your ₹300 payment has been received and your booking for <strong>{saved.service}</strong> is confirmed. Indu will contact you to coordinate your appointment timing. You can also share your details with her on WhatsApp.</p><a href={whatsappText} target="_blank" rel="noopener" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-extrabold text-[#07331A]"><MessageCircle /> Message Indu on WhatsApp</a><button onClick={() => { setSaved(null); setName(""); setPhone(""); setMessage(""); }} className="mt-4 w-fit rounded-full border border-[#2A0A4A] px-5 py-2 font-bold">Make another request</button></div> : <form onSubmit={submitBooking}><h3 className="font-serif-display text-2xl font-bold">Request a session</h3><p className="mt-1 text-sm text-gray-600">Pay the ₹300 consultation and booking fee securely to submit your appointment. Your booking is confirmed only after payment verification.</p><label className="mt-6 block text-sm font-bold" htmlFor="name">Full name</label><input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3" /><label className="mt-4 block text-sm font-bold" htmlFor="phone">Phone number</label><input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number" inputMode="tel" required className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3" /><label className="mt-4 block text-sm font-bold" htmlFor="service">Service</label><select id="service" value={selectedService} onChange={e => setSelectedService(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3">{services.map(s => <option key={s.name}>{s.name}</option>)}</select>{isTarot && <><label className="mt-4 block text-sm font-bold" htmlFor="readingFormat">Tarot reading option</label><select id="readingFormat" value={readingFormat} onChange={e => setReadingFormat(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3"><option value="3 questions">3 questions</option><option value="30 minutes">30-minute session (no question limit)</option></select></>}{isKnot && <><label className="mt-4 block text-sm font-bold" htmlFor="knot">Choose your intention knot</label><select id="knot" value={selectedKnot} onChange={e => setSelectedKnot(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3">{knotServices.map(k => <option key={k}>{k}</option>)}</select></>}<label className="mt-4 block text-sm font-bold" htmlFor="message">Message <span className="font-normal text-gray-500">(optional)</span></label><textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Share your concern in a few words…" className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 [overflow-wrap:anywhere]" />{formError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{formError}</p>}<button disabled={isSubmitting} className="mt-6 w-full rounded-full bg-[#2A0A4A] px-5 py-3.5 font-extrabold text-white disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Processing secure payment…" : "Pay ₹300 & Confirm Booking"}</button><p className="mt-3 text-center text-xs text-gray-500">₹300 consultation and booking fee. Secure payment by Razorpay. Your booking is saved only after payment verification.</p></form>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(212,175,55,.25)] bg-[#12031F] px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--royal-2)] text-[var(--gold-soft)]"><MoonStar /></span><span className="font-serif-display text-2xl font-bold">Divine Healer Indu</span></div><p className="mt-4 max-w-md leading-relaxed text-[var(--muted)]">Reiki Grand Master • Humkara &amp; Haleem Healer<br />Heal • Align • Manifest</p><p className="mt-4 text-sm text-[var(--muted)]">Bookings through WhatsApp • Service details confirmed personally</p><p className="mt-2 text-xs font-bold uppercase tracking-[.2em] text-[var(--gold-soft)]">Tarot • Akashic • Reiki • Chakra • Aura</p></div><div><h3 className="font-bold text-[var(--gold-soft)]">Healing Services</h3><ul className="mt-4 space-y-2 text-sm text-[var(--muted)]"><li>Tarot &amp; Akashic Reading</li><li>Chakra, Aura &amp; Health Healing</li><li>Love, Marriage &amp; Compatibility</li><li>Money, Career &amp; Life Guidance</li><li>Numerology &amp; Black Magic Removal</li></ul></div><div><h3 className="font-bold text-[var(--gold-soft)]">Contact</h3><ul className="mt-4 space-y-3 text-sm text-[var(--muted)]"><li><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-white underline">WhatsApp Indu</a></li><li>Booking: WhatsApp only</li><li>Service details confirmed personally by Indu</li></ul><a href="#booking" className="mt-5 inline-block rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-extrabold text-[#2A0A4A]">Book Your Session</a></div><div><h3 className="font-bold text-[var(--gold-soft)]">Follow &amp; Explore</h3><p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">Discover more about Divine Healer Indu, watch videos and join the community.</p><ul className="mt-4 space-y-3 text-sm text-[var(--muted)]"><li><a href="https://m.youtube.com/@divinesoulIndu" target="_blank" rel="noopener noreferrer" className="text-white underline">YouTube Channel</a></li><li><a href="https://chat.whatsapp.com/EImG9I0iGGhKm3VykI6CX9?s=cl&amp;p=a&amp;iam=2" target="_blank" rel="noopener noreferrer" className="text-white underline">WhatsApp Community</a></li><li><a href="https://www.instagram.com/divine_healer_indu?knvt=MXd4Njd0N3k0M3dzaw==" target="_blank" rel="noopener noreferrer" className="text-white underline">Instagram</a></li><li><a href="https://m.facebook.com/story.php?story_fbid=pfbid0PNCdAVTTqdLftV3gt8rL8ffL5kphepsjMMAxe4FZeMpuMp1FP6uTYqTt3yWETTojl&amp;id=100009782231454&amp;mibextid=Nif5oz" target="_blank" rel="noopener noreferrer" className="text-white underline">Facebook</a></li></ul></div></div><div className="gold-line mx-auto mt-10 max-w-7xl" /><p className="mx-auto mt-6 max-w-7xl text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} Divine_healer_Indu. A space for healing, clarity, and compassionate guidance.</p>
      </footer>

      {/* FLOATING */}
      <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 sm:right-6">
        <a href={WHATSAPP} target="_blank" rel="noopener" aria-label="Open WhatsApp" className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-[#07331A] shadow-[0_10px_30px_rgba(0,0,0,.35)]"><MessageCircle size={27} /></a>
      </div>
    </div>
  );
}
