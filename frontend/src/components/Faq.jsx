import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "Simply search for a doctor by specialty or name, view their available time slots, and click 'Book Now'. You will receive a confirmation email immediately."
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer: "Yes, you can manage your appointments through your dashboard. Cancellations made 24 hours in advance are eligible for a full refund if a fee was paid."
    },
    {
      question: "Is my medical data secure?",
      answer: "Absolutely. We use industry-standard end-to-end encryption and are fully HIPAA compliant to ensure your personal health information remains private."
    },
    {
      question: "How do I join as a doctor?",
      answer: "Click on the 'For Doctors' link in the header and submit your credentials. Our admin team will verify your license within 48-72 hours."
    },
    {
      question: "Do you offer online video consultations?",
      answer: "Yes, many of our doctors offer 'Telehealth' sessions. Look for the video icon next to the doctor's profile to see if they provide virtual visits."
    }
  ];

  return (
    <section className="py-20 px-6 my-5 max-w-4xl mx-auto bg-base-200">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-500">Everything you need to know about the GetaDoc platform.</p>
      </div>

      <div className="join join-vertical w-full">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="collapse collapse-arrow join-item border border-base-300 bg-base-100"
          >
            {/* Using radio buttons makes it so only one FAQ opens at a time (Accordion style) */}
            <input type="radio" name="faq-accordion" defaultChecked={index === 0} /> 
            
            <div className="collapse-title text-xl font-medium">
              {faq.question}
            </div>
            
            <div className="collapse-content"> 
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;