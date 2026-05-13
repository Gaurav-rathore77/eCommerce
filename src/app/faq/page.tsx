import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Rathore Brand",
  description: "Frequently asked questions about orders, shipping, returns, and more.",
};

const faqs = [
  {
    category: "Orders",
    questions: [
      {
        q: "How do I place an order?",
        a: "Simply browse our products, add items to your cart, and proceed to checkout. You can pay using Credit/Debit cards, UPI, or Cash on Delivery.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 2 hours of placing them. Please contact our support team immediately for assistance.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is shipped, you will receive an email with a tracking number. You can also track your order in your account dashboard under 'My Orders'.",
      },
    ],
  },
  {
    category: "Shipping",
    questions: [
      {
        q: "What are the shipping charges?",
        a: "We offer FREE shipping on all prepaid orders above ₹499. For orders below ₹499, a flat shipping fee of ₹50 applies. COD orders have a ₹50 shipping charge.",
      },
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 5-7 business days. Express shipping (₹99) delivers in 2-3 business days. Same-day delivery is available in select cities for ₹149.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within India. We plan to expand internationally soon.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day hassle-free return policy. Products must be unused, in original packaging with all tags attached.",
      },
      {
        q: "How do I return a product?",
        a: "Go to 'My Orders', select the order, and click 'Return'. Pack the item in original packaging, and our courier partner will pick it up from your doorstep.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed within 24-48 hours after we receive the returned item. The amount will be credited to your original payment method within 5-7 business days.",
      },
    ],
  },
  {
    category: "Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Credit/Debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, Wallets, and Cash on Delivery (COD).",
      },
      {
        q: "Is Cash on Delivery available?",
        a: "Yes, COD is available for orders up to ₹10,000. A ₹50 COD charge applies to all COD orders.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely! We use industry-standard SSL encryption and secure payment gateways. We never store your card details.",
      },
    ],
  },
  {
    category: "Products",
    questions: [
      {
        q: "Are your products authentic?",
        a: "Yes, all our products are 100% authentic and sourced directly from trusted manufacturers and authorized distributors.",
      },
      {
        q: "How do I find my size?",
        a: "Each product page has a detailed size chart. We recommend measuring yourself and comparing with our size guide for the best fit.",
      },
      {
        q: "The product I want is out of stock. Will it be restocked?",
        a: "Popular items are regularly restocked. Click 'Notify Me' on the product page to get an alert when it's back in stock.",
      },
    ],
  },
  {
    category: "Account",
    questions: [
      {
        q: "Do I need an account to shop?",
        a: "No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, and get exclusive offers.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a password reset link.",
      },
      {
        q: "How can I contact customer support?",
        a: "You can reach us via email at support@rathorebrand.com, call us at +91 98765 43210 (Mon-Sat, 10AM-7PM), or use the chat widget on our website.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, orders, shipping, and more.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((category) => (
            <Card key={category.category}>
              <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-primary">{category.category}</h2>
              <div className="space-y-6">
                {category.questions.map((faq, index) => (
                  <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0">
                    <h3 className="font-semibold text-lg mb-2">Q: {faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          ))}

          {/* Still have questions */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can&apos;t find the answer you&apos;re looking for? Please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  Contact Us
                </a>
                <a href="mailto:support@rathorebrand.com" className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input bg-background font-medium hover:bg-accent transition-colors">
                  Email Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
