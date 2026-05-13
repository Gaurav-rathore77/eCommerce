import { Card, CardContent } from "@/components/ui/card";
import { Truck, Clock, MapPin, Package, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information | Rathore Brand",
  description: "Learn about our shipping policies, delivery times, and shipping rates.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer fast and reliable shipping across India. Learn about our delivery times, 
            shipping rates, and policies.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Shipping Options */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Standard Shipping</h3>
                <p className="text-muted-foreground mt-2">
                  5-7 business days
                </p>
                <p className="font-medium text-primary mt-2">FREE</p>
                <p className="text-xs text-muted-foreground">
                  On orders above ₹499
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Express Shipping</h3>
                <p className="text-muted-foreground mt-2">
                  2-3 business days
                </p>
                <p className="font-medium text-primary mt-2">₹99</p>
                <p className="text-xs text-muted-foreground">
                  Flat rate nationwide
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Same Day Delivery</h3>
                <p className="text-muted-foreground mt-2">
                  Available in select cities
                </p>
                <p className="font-medium text-primary mt-2">₹149</p>
                <p className="text-xs text-muted-foreground">
                  Mumbai, Delhi, Bangalore
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Policy */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Shipping Policy</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Areas
                  </h3>
                  <p className="text-muted-foreground">
                    We currently ship to all major cities and towns across India. 
                    For remote locations, delivery may take an additional 2-3 business days.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Processing Time
                  </h3>
                  <p className="text-muted-foreground">
                    Orders are processed within 24-48 hours (excluding weekends and holidays). 
                    You will receive a tracking number via email once your order is shipped.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-primary" />
                    Order Tracking
                  </h3>
                  <p className="text-muted-foreground">
                    Track your order in real-time using the tracking number provided in your 
                    shipping confirmation email. You can also track orders in your account dashboard.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Delivery Confirmation
                  </h3>
                  <p className="text-muted-foreground">
                    All deliveries require a signature upon receipt. If you&apos;re not available, 
                    the courier will attempt delivery up to 3 times before returning the package.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Free shipping is applicable only on prepaid orders above ₹499
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Cash on Delivery (COD) orders below ₹499 will incur a ₹50 shipping charge
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Delivery times may vary during peak seasons and sale periods
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  We are not responsible for delays caused by courier partners or natural calamities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Please ensure your delivery address is complete and accurate to avoid delays
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
