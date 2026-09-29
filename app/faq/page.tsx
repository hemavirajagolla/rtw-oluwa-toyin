const faqItems = [
  {
    question: "How do I place an order?",
    answer: "Choose your preferred item, select a size and add it to your bag. Then complete the checkout form and send your order through WhatsApp.",
  },
  {
    question: "What payment method do you use?",
    answer: "Payments are made by bank transfer only. After your order is sent, we will share the bank details on WhatsApp.",
  },
  {
    question: "Do you ship outside Nigeria?",
    answer: "Not at the moment. We deliver within Nigeria only: ₦3,000 within Lekki 1, Ikoyi & Victoria Island, ₦5,000 within The Island, ₦7,000 within The Mainland and ₦12,000 anywhere else in Nigeria. Delivery times are confirmed on WhatsApp after order confirmation.",
  },
  {
    question: "What is your returns policy?",
    answer: "We offer returns on eligible items within a specified period if they arrive damaged or do not match the order. Please contact us directly on WhatsApp for support.",
  },
  {
    question: "How do I find the right size?",
    answer: "Please use the size guide available on the website or contact us for guidance before placing your order.",
  },
];

export default function FaqPage() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="section-kicker">FAQ</p>
        <h1>Everything you need to know.</h1>
      </div>

      <div className="faq-list">
        {faqItems.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}<span aria-hidden="true">+</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
